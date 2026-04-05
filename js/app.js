/* ═══ app.js ═══ */

/* ── LOGIN ── */
function doLogin(){
  const email=document.getElementById('l-email').value.trim().toLowerCase();
  const pass=document.getElementById('l-pass').value;
  const errEl=document.getElementById('l-error');
  errEl.style.display='none';
  const btn=document.getElementById('l-btn');

  const demo=DEMO_USERS[email];
  if(demo && demo.password===pass){
    S.user={email,name:demo.name,role:demo.role,av:demo.av};
    S.role=demo.role;
    bootUI(); return;
  }

  // Firebase auth
  if(window.FB && window.FB.auth.app.options.apiKey!=='YOUR_API_KEY'){
    btn.querySelector('span').textContent='Signing in...';
    window.FB.signInWithEmailAndPassword(window.FB.auth,email,pass)
      .then(cred=>{
        S.usingFirebase=true;
        S.user={email,name:cred.user.displayName||email,role:'admin',av:ini(cred.user.displayName||email)};
        S.role='admin'; bootUI();
      })
      .catch(()=>{
        errEl.textContent='Invalid email or password.';
        errEl.style.display='block';
        btn.querySelector('span').textContent='Sign in';
      });
    return;
  }

  errEl.textContent='Invalid credentials. Click a demo account above.';
  errEl.style.display='block';
}

function doLogout(){
  if(window.FB) window.FB.signOut(window.FB.auth).catch(()=>{});
  S.user=null; S.role='admin'; S.page='dashboard';
  document.getElementById('app').style.display='none';
  document.getElementById('login-screen').style.display='flex';
  document.getElementById('l-pass').value='';
  closeUserMenu();
}

/* ── BOOT ── */
function bootUI(){
  document.getElementById('login-screen').style.display='none';
  document.getElementById('app').style.display='block';

  const roleLabels={admin:'Administrator',guard:'Security Guard',client:'Client'};
  document.getElementById('top-name').textContent=S.user.name.split(' ')[0];
  document.getElementById('top-role').textContent=roleLabels[S.role]||'User';
  document.getElementById('top-avatar').textContent=S.user.av;
  document.getElementById('um-avatar').textContent=S.user.av;
  document.getElementById('um-name').textContent=S.user.name;
  document.getElementById('um-role').textContent=roleLabels[S.role]||'';

  const defs={admin:'dashboard',guard:'my-shift',client:'site-report'};
  S.page=defs[S.role]||'dashboard';

  updateBadge();
  renderNav();
  renderPage();
  startTicker();
}

function bootApp(){
  document.getElementById('l-pass').addEventListener('keydown',e=>{if(e.key==='Enter')doLogin();});
  document.getElementById('l-email').addEventListener('keydown',e=>{if(e.key==='Enter')document.getElementById('l-pass').focus();});
}

/* ── ROUTING ── */
function go(page){
  S.page=page;
  notifOpen=false;
  document.getElementById('notif-panel').style.display='none';
  closeUserMenu();
  renderNav();
  // fade out/in
  const main=document.getElementById('main');
  main.style.opacity='0';
  main.style.transform='translateY(10px)';
  setTimeout(()=>{
    renderPage();
    main.style.transition='opacity .25s ease,transform .25s ease';
    main.style.opacity='1';
    main.style.transform='translateY(0)';
    setTimeout(()=>{ main.style.transition=''; },300);
  },120);
  window.scrollTo(0,0);
}

const PAGE_MAP={
  dashboard:  [pgDashboard,  afterDashboard],
  guards:     [pgGuards,     null],
  attendance: [pgAttendance, afterAttendance],
  patrol:     [pgPatrol,     null],
  incidents:  [pgIncidents,  null],
  sites:      [pgSites,      null],
  shifts:     [pgShifts,     null],
  billing:    [pgBilling,    afterBilling],
  reports:    [pgReports,    afterReports],
  documents:  [pgDocuments,  null],
  map:        [pgMap,        null],
  'my-shift': [pgMyShift,   null],
  'site-report':[pgSiteReport,null],
};

function renderPage(){
  const entry=PAGE_MAP[S.page];
  document.getElementById('main').innerHTML=entry?entry[0]():`<div class="page-header"><div class="page-title">Page not found</div></div>`;
  if(entry && entry[1]) setTimeout(entry[1], 50);
}

/* ── TICKER ── */
function startTicker(){
  const msgs=[
    `${DEMO.guards.filter(g=>g.status==='on-duty').length} guards on duty — all sites covered`,
    `${DEMO.checkpoints.filter(c=>c.done).length}/${DEMO.checkpoints.length} patrol checkpoints cleared today`,
    `${DEMO.incidents.filter(i=>i.status==='open').length} open incident(s) require attention`,
    `Next shift change at 20:00 — ${DEMO.guards.filter(g=>g.shift==='Night').length} night guards rostered`,
    `System uptime: 99.9% · WeGuard Pro v2.0`,
  ];
  let idx=0;
  const el=document.getElementById('ticker-text');
  setInterval(()=>{
    el.style.opacity='0';
    setTimeout(()=>{ el.textContent=msgs[++idx%msgs.length]; el.style.opacity='1'; el.style.transition='opacity .4s'; },350);
  },5000);
}

window.addEventListener('load',()=>{ if(window.FB) bootApp(); else bootApp(); });
