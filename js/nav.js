/* ═══ nav.js ═══ */
const ICO = {
  grid:   `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>`,
  shield: `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2L4 6v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V6l-8-4z"/></svg>`,
  home:   `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  cal:    `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
  alert:  `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  clock:  `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  map:    `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></svg>`,
  file:   `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>`,
  money:  `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`,
  bar:    `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
  route:  `<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="6" cy="19" r="3"/><path d="M9 19h8.5a3.5 3.5 0 000-7h-11a3.5 3.5 0 010-7H15"/><circle cx="18" cy="5" r="3"/></svg>`,
};

const NAV = {
  admin: [
    { sec:'Overview', items:[
      { id:'dashboard', label:'Dashboard', ico:'grid' },
      { id:'map',       label:'Live map',  ico:'map'  },
    ]},
    { sec:'Operations', items:[
      { id:'attendance', label:'Attendance',  ico:'clock', badge: ()=>DEMO.attendance.filter(a=>a.status==='absent').length||null },
      { id:'patrol',     label:'Patrol',      ico:'route', badge: ()=>DEMO.checkpoints.filter(c=>!c.done).length||null },
      { id:'incidents',  label:'Incidents',   ico:'alert', badge: ()=>DEMO.incidents.filter(i=>i.status==='open').length||null },
    ]},
    { sec:'Management', items:[
      { id:'guards',    label:'Guards',     ico:'shield' },
      { id:'sites',     label:'Sites',      ico:'home'   },
      { id:'shifts',    label:'Shifts',     ico:'cal'    },
      { id:'documents', label:'Documents',  ico:'file'   },
    ]},
    { sec:'Finance', items:[
      { id:'billing', label:'Billing',  ico:'money', badge: ()=>DEMO.invoices.filter(i=>i.status==='overdue').length||null },
      { id:'reports', label:'Reports',  ico:'bar'   },
    ]},
  ],
  guard: [
    { sec:'My Day', items:[
      { id:'my-shift',   label:'My shift',    ico:'cal'   },
      { id:'attendance', label:'Check in/out', ico:'clock' },
      { id:'patrol',     label:'Patrol',       ico:'route' },
      { id:'incidents',  label:'Log incident', ico:'alert' },
    ]},
  ],
  client: [
    { sec:'My Site', items:[
      { id:'site-report', label:'Site report', ico:'home'  },
      { id:'map',         label:'Guard map',   ico:'map'   },
      { id:'incidents',   label:'Incidents',   ico:'alert' },
      { id:'billing',     label:'Invoices',    ico:'money' },
    ]},
  ],
};

function renderNav(){
  const nav = NAV[S.role]||NAV.admin;
  let h = '';
  nav.forEach(sec=>{
    h += `<div class="nav-section"><div class="nav-label">${sec.sec}</div>`;
    sec.items.forEach(it=>{
      const b = it.badge && it.badge();
      h += `<div class="nav-item${S.page===it.id?' active':''}" onclick="go('${it.id}')">
        ${ICO[it.ico]||''}
        <span>${it.label}</span>
        ${b?`<span class="nav-badge">${b}</span>`:''}
      </div>`;
    });
    h += '</div>';
  });
  document.getElementById('sidebar-nav').innerHTML = h;
}

let sbOpen = true;
function toggleSidebar(){
  sbOpen = !sbOpen;
  document.getElementById('sidebar').classList.toggle('collapsed', !sbOpen);
  document.querySelector('.main-area').classList.toggle('wide', !sbOpen);
}
