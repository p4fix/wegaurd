/* WeGuard Pro — nav.js */
const NAV_CONFIG = {
  admin: [
    { section:'Overview', items:[
      { id:'dashboard', label:'Dashboard', ico:'grid' },
      { id:'map',       label:'Live map',  ico:'map'  },
    ]},
    { section:'Operations', items:[
      { id:'attendance', label:'Attendance',   ico:'clock'  },
      { id:'patrol',     label:'Patrol',       ico:'route'  },
      { id:'incidents',  label:'Incidents',    ico:'alert'  },
    ]},
    { section:'Management', items:[
      { id:'guards',    label:'Guards',         ico:'shield' },
      { id:'sites',     label:'Sites',          ico:'home'   },
      { id:'shifts',    label:'Shifts',         ico:'cal'    },
      { id:'documents', label:'Documents',      ico:'file'   },
    ]},
    { section:'Finance', items:[
      { id:'billing',  label:'Billing',  ico:'money' },
      { id:'reports',  label:'Reports',  ico:'bar'   },
    ]},
  ],
  guard: [
    { section:'My Day', items:[
      { id:'my-shift',    label:'My shift',     ico:'cal'   },
      { id:'attendance',  label:'Check in/out', ico:'clock' },
      { id:'patrol',      label:'Patrol',       ico:'route' },
      { id:'incidents',   label:'Log incident', ico:'alert' },
    ]},
  ],
  client: [
    { section:'My Site', items:[
      { id:'site-report', label:'Site report', ico:'home'  },
      { id:'map',         label:'Guard map',   ico:'map'   },
      { id:'incidents',   label:'Incidents',   ico:'alert' },
      { id:'billing',     label:'Invoices',    ico:'money' },
    ]},
  ],
};

function renderNav(){
  const nav = NAV_CONFIG[S.role] || NAV_CONFIG.admin;
  let html = '';
  nav.forEach(sec => {
    html += `<div class="nav-section"><div class="nav-label">${sec.section}</div>`;
    sec.items.forEach(item => {
      html += `<div class="nav-item ${S.page===item.id?'active':''}" onclick="go('${item.id}')">
        ${ICO[item.ico]||''}
        <span>${item.label}</span>
      </div>`;
    });
    html += '</div>';
  });
  document.getElementById('sidebar-nav').innerHTML = html;
}

function toggleSidebar(){
  const sb = document.getElementById('sidebar');
  const mw = document.querySelector('.main-wrap');
  sb.classList.toggle('hidden');
  if(window.innerWidth > 768){
    mw.classList.toggle('full');
  } else {
    sb.classList.toggle('open');
  }
}
