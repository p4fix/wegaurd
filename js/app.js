/* WeGuard Pro — app.js
   Login, routing, boot
*/

/* ── LOGIN ── */
function doLogin(){
  const email = document.getElementById('l-email').value.trim().toLowerCase();
  const pass  = document.getElementById('l-pass').value;
  const errEl = document.getElementById('l-error');
  errEl.style.display = 'none';

  // Try demo login first (works without Firebase)
  const demoUser = DEMO_USERS[email];
  if(demoUser && demoUser.password === pass){
    S.user = { email, name: demoUser.name, role: demoUser.role, av: demoUser.av };
    S.role = demoUser.role;
    S.usingFirebase = false;
    bootUI();
    return;
  }

  // Try Firebase auth if configured
  if(window.FB && window.FB.auth.app.options.apiKey !== 'YOUR_API_KEY'){
    document.getElementById('l-btn').textContent = 'Signing in...';
    window.FB.signInWithEmailAndPassword(window.FB.auth, email, pass)
      .then(cred => {
        S.usingFirebase = true;
        // Map Firebase user to a role — store role in Firestore users collection
        return window.FB.getDoc(window.FB.doc(window.FB.db, 'users', cred.user.uid))
          .then(snap => {
            const data = snap.exists() ? snap.data() : { role:'guard', name:cred.user.email };
            S.user = { email, name: data.name||email, role: data.role||'guard', av: ini(data.name||email) };
            S.role = S.user.role;
            bootUI();
          });
      })
      .catch(err => {
        errEl.textContent = 'Invalid email or password.';
        errEl.style.display = 'block';
        document.getElementById('l-btn').textContent = 'Sign in';
      });
    return;
  }

  errEl.textContent = 'Invalid credentials. Use a demo account below.';
  errEl.style.display = 'block';
}

function doLogout(){
  if(window.FB && S.usingFirebase) window.FB.signOut(window.FB.auth);
  S.user = null; S.role = 'admin'; S.page = 'dashboard';
  document.getElementById('app').style.display = 'none';
  document.getElementById('login-screen').style.display = 'flex';
  document.getElementById('l-pass').value = '';
  document.getElementById('l-btn').textContent = 'Sign in';
  closeUserMenu();
}

/* ── BOOT ── */
function bootApp(){
  // If Firebase is real, watch auth state
  if(window.FB && window.FB.auth.app.options.apiKey !== 'YOUR_API_KEY'){
    window.FB.onAuthStateChanged(window.FB.auth, user => {
      if(!user){
        document.getElementById('login-screen').style.display = 'flex';
        document.getElementById('app').style.display = 'none';
      }
    });
  }

  // Enter key on login
  document.getElementById('l-pass').addEventListener('keydown', e => {
    if(e.key === 'Enter') doLogin();
  });
  document.getElementById('l-email').addEventListener('keydown', e => {
    if(e.key === 'Enter') document.getElementById('l-pass').focus();
  });
}

function bootUI(){
  document.getElementById('login-screen').style.display = 'none';
  document.getElementById('app').style.display = 'block';

  // Set user info in topbar
  document.getElementById('top-name').textContent = S.user.name.split(' ')[0];
  document.getElementById('top-avatar').textContent = S.user.av;
  document.getElementById('um-name').textContent = S.user.name;
  document.getElementById('um-role').textContent = S.user.role.charAt(0).toUpperCase() + S.user.role.slice(1);
  document.getElementById('um-avatar').textContent = S.user.av;

  // Set default page per role
  const defaults = { admin:'dashboard', guard:'my-shift', client:'site-report' };
  S.page = defaults[S.role] || 'dashboard';

  updateNotifCount();
  renderNav();
  renderPage();

  // Ticker updates
  startTicker();
}

/* ── ROUTING ── */
function go(page){
  S.page = page;
  // Close any open panels
  notifOpen = false;
  document.getElementById('notif-panel').style.display = 'none';
  closeUserMenu();
  renderNav();
  renderPage();
  window.scrollTo(0,0);
}

function renderPage(){
  const pageMap = {
    // Admin
    'dashboard':   pgDashboard,
    'guards':      pgGuards,
    'attendance':  pgAttendance,
    'patrol':      pgPatrol,
    'incidents':   pgIncidents,
    'sites':       pgSites,
    'shifts':      pgShifts,
    'billing':     pgBilling,
    'reports':     pgReports,
    'documents':   pgDocuments,
    'map':         pgMap,
    // Guard
    'my-shift':    pgMyShift,
    // Client
    'site-report': pgSiteReport,
  };
  const fn = pageMap[S.page];
  document.getElementById('main').innerHTML = fn ? fn() : `<div class="page-header"><div class="page-title">Page not found</div></div>`;
}

/* ── TICKER ── */
function startTicker(){
  const messages = [
    `${DEMO.guards.filter(g=>g.status==='on-duty').length} guards on duty — all sites covered`,
    `${DEMO.checkpoints.filter(c=>c.done).length}/${DEMO.checkpoints.length} patrol checkpoints cleared today`,
    `${DEMO.incidents.filter(i=>i.status==='open').length} open incident(s) require attention`,
    `Next shift change: 20:00 — ${DEMO.guards.filter(g=>g.shift==='Night').length} night guards rostered`,
  ];
  let idx = 0;
  const el = document.getElementById('ticker-text');
  setInterval(() => {
    el.style.opacity = '0';
    setTimeout(() => { el.textContent = messages[++idx % messages.length]; el.style.opacity = '1'; }, 400);
  }, 5000);
}

/* ── FIREBASE REALTIME (when configured) ── */
function setupFirebaseListeners(){
  if(!window.FB || !S.usingFirebase) return;
  const db = window.FB.db;

  // Listen for new incidents
  window.FB.onSnapshot(
    window.FB.query(window.FB.collection(db,'incidents'), window.FB.orderBy('createdAt','desc'), window.FB.limit(20)),
    snap => {
      DEMO.incidents = snap.docs.map(d => ({ id:d.id, ...d.data() }));
      if(S.page==='incidents') renderPage();
    }
  );

  // Listen for guard status changes
  window.FB.onSnapshot(window.FB.collection(db,'guards'), snap => {
    DEMO.guards = snap.docs.map(d => ({ id:d.id, ...d.data() }));
    if(S.page==='guards' || S.page==='dashboard') renderPage();
  });

  // Listen for SOS alerts
  window.FB.onSnapshot(
    window.FB.query(window.FB.collection(db,'alerts'), window.FB.where('type','==','sos'), window.FB.where('active','==',true)),
    snap => {
      snap.docChanges().forEach(change => {
        if(change.type==='added'){
          const d = change.doc.data();
          triggerSOS(d.guardName, d.site);
        }
      });
    }
  );
}

/* ── FIREBASE DATA WRITE HELPERS (use when Firebase is configured) ── */
async function fbAddIncident(data){
  if(!window.FB || !S.usingFirebase) return;
  return window.FB.addDoc(window.FB.collection(window.FB.db,'incidents'), {
    ...data, createdAt: window.FB.serverTimestamp(), createdBy: S.user.email
  });
}

async function fbUpdateGuardStatus(guardId, status){
  if(!window.FB || !S.usingFirebase) return;
  return window.FB.updateDoc(window.FB.doc(window.FB.db,'guards',guardId), { status });
}

async function fbLogAttendance(guardId, type){
  if(!window.FB || !S.usingFirebase) return;
  const field = type==='in' ? 'checkIn' : 'checkOut';
  return window.FB.setDoc(
    window.FB.doc(window.FB.db,'attendance',`${guardId}_${new Date().toISOString().split('T')[0]}`),
    { [field]: window.FB.serverTimestamp(), guardId, date: new Date().toISOString().split('T')[0] },
    { merge: true }
  );
}

async function fbUpdateGuardLocation(lat, lng){
  if(!window.FB || !S.usingFirebase || !S.user) return;
  return window.FB.setDoc(
    window.FB.doc(window.FB.db,'locations', S.user.email),
    { lat, lng, name: S.user.name, updatedAt: window.FB.serverTimestamp() },
    { merge: true }
  );
}

// Start GPS broadcast for guards
function startGPSBroadcast(){
  if(S.role !== 'guard') return;
  if(!navigator.geolocation) return;
  setInterval(() => {
    navigator.geolocation.getCurrentPosition(pos => {
      fbUpdateGuardLocation(pos.coords.latitude, pos.coords.longitude);
    });
  }, 30000);
}

// Boot
window.addEventListener('load', () => {
  if(window.FB) setupFirebaseListeners();
  bootApp();
  // If Firebase auth already has a session
  if(window.FB && window.FB.auth.currentUser){
    const u = window.FB.auth.currentUser;
    S.user = { email: u.email, name: u.displayName||u.email, role:'admin', av: ini(u.displayName||u.email) };
    S.role = 'admin';
    bootUI();
  }
});
