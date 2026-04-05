/* ═══ modal.js ═══ */
function openModal(title, body, foot, wide){
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = body;
  document.getElementById('modal-foot').innerHTML = foot||'';
  document.getElementById('modal-box').className = 'modal glass'+(wide?' wide':'');
  document.getElementById('modal-wrap').classList.add('open');
}
function closeModal(){ document.getElementById('modal-wrap').classList.remove('open'); }
function maybeCloseModal(e){ if(e.target===document.getElementById('modal-wrap')) closeModal(); }

/* ═══ ui.js — notifications + SOS ═══ */
const S = { role:'admin', page:'dashboard', user:null };

let notifOpen=false, userMenuOpen=false;

function toggleNotifs(){
  notifOpen=!notifOpen;
  document.getElementById('notif-panel').style.display = notifOpen?'block':'none';
  if(notifOpen){ renderNotifs(); userMenuOpen=false; document.getElementById('user-menu').style.display='none'; }
}
function toggleUserMenu(){
  userMenuOpen=!userMenuOpen;
  document.getElementById('user-menu').style.display = userMenuOpen?'block':'none';
  if(userMenuOpen){ notifOpen=false; document.getElementById('notif-panel').style.display='none'; }
}
function closeUserMenu(){ userMenuOpen=false; document.getElementById('user-menu').style.display='none'; }

function renderNotifs(){
  const colors={danger:'var(--red)',warning:'var(--amber)',info:'var(--accent)'};
  const list = DEMO.notifications;
  document.getElementById('notif-list').innerHTML = list.length
    ? list.map(n=>`<div class="notif-item" style="border-left:2px solid ${colors[n.type]||'transparent'}">
        <div class="notif-item-title">${n.title}</div>
        <div class="notif-item-sub">${n.sub}</div>
        <div class="notif-item-time">${n.time}</div>
      </div>`).join('')
    : '<div style="padding:2rem;text-align:center;color:var(--text3);font-size:13px">All clear</div>';
}

function clearAllNotifs(){
  DEMO.notifications=[];
  document.getElementById('notif-count').style.display='none';
  renderNotifs();
}

function updateBadge(){
  const el=document.getElementById('notif-count');
  const n=DEMO.notifications.length;
  el.textContent=n; el.style.display=n?'flex':'none';
}

function triggerSOS(guardName, site){
  const name=guardName||'Rajiv Sharma';
  const loc =site||'Mall Complex — Gate 2';
  document.getElementById('sos-guard').textContent = name+' — distress signal received';
  document.getElementById('sos-loc').textContent   = loc;
  document.getElementById('sos-time').textContent  = 'Alert received: '+nowTime();
  document.getElementById('sos-overlay').style.display='flex';
  DEMO.notifications.unshift({id:'N'+Date.now(),title:'🚨 SOS — '+name,sub:loc,time:'Just now',type:'danger'});
  updateBadge();
}
function dismissSOS(){ document.getElementById('sos-overlay').style.display='none'; }

document.addEventListener('click', e=>{
  if(!e.target.closest('#notif-panel')&&!e.target.closest('#notif-btn')){ notifOpen=false; document.getElementById('notif-panel').style.display='none'; }
  if(!e.target.closest('#user-menu')&&!e.target.closest('.tb-user')){ closeUserMenu(); }
});
