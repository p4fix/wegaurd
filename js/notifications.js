/* WeGuard Pro — notifications.js */
let notifOpen = false;

function toggleNotifs(){
  notifOpen = !notifOpen;
  const panel = document.getElementById('notif-panel');
  panel.style.display = notifOpen ? 'block' : 'none';
  if(notifOpen) renderNotifs();
  closeUserMenu();
}

function renderNotifs(){
  const list = document.getElementById('notif-list');
  if(!DEMO.notifications.length){
    list.innerHTML = '<div style="padding:1.5rem;text-align:center;color:var(--text-3);font-size:13px">No notifications</div>';
    return;
  }
  const typeColors = { danger:'#FCEBEB', warning:'#FAEEDA', info:'var(--accent-light)' };
  list.innerHTML = DEMO.notifications.map(n => `
    <div class="notif-item" style="border-left:3px solid ${typeColors[n.type]||'transparent'}">
      <div class="notif-item-title">${n.title}</div>
      <div class="notif-item-sub">${n.sub}</div>
      <div class="notif-item-time">${n.time}</div>
    </div>`).join('');
}

function clearAllNotifs(){
  DEMO.notifications = [];
  document.getElementById('notif-count').style.display = 'none';
  renderNotifs();
}

function updateNotifCount(){
  const el = document.getElementById('notif-count');
  el.textContent = DEMO.notifications.length;
  el.style.display = DEMO.notifications.length ? 'flex' : 'none';
}

/* WeGuard Pro — sos.js */
function triggerSOS(guardName, site){
  const name = guardName || 'Rajiv Sharma';
  const loc  = site || 'Mall Complex, Gate 2';
  document.getElementById('sos-guard-name').textContent = name + ' — distress signal received';
  document.getElementById('sos-location').textContent   = loc;
  document.getElementById('sos-time').textContent       = 'Alert time: ' + nowTime();
  document.getElementById('sos-overlay').style.display  = 'flex';
  DEMO.notifications.unshift({ id:'N'+Date.now(), title:'🚨 SOS Alert!', sub:name+' — '+loc, time:'Just now', type:'danger' });
  updateNotifCount();
}

function dismissSOS(){
  document.getElementById('sos-overlay').style.display = 'none';
}

/* User menu */
let userMenuOpen = false;
function toggleUserMenu(){
  userMenuOpen = !userMenuOpen;
  document.getElementById('user-menu').style.display = userMenuOpen ? 'block' : 'none';
  if(notifOpen){ toggleNotifs(); }
}
function closeUserMenu(){
  userMenuOpen = false;
  document.getElementById('user-menu').style.display = 'none';
}

document.addEventListener('click', e => {
  if(!e.target.closest('#notif-panel') && !e.target.closest('.icon-btn:not(.sos-trigger)')){
    if(notifOpen){ notifOpen=false; document.getElementById('notif-panel').style.display='none'; }
  }
  if(!e.target.closest('#user-menu') && !e.target.closest('.user-chip')){ closeUserMenu(); }
});
