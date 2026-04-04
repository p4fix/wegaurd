/* =====================
   WeGuard — render.js
   Sidebar + routing
   ===================== */

const NAV = {
  admin: [
    { label: 'Overview',    items: [{ id: 'dashboard', label: 'Dashboard',      ico: icoGrid }] },
    { label: 'Management',  items: [{ id: 'guards',    label: 'Guards',         ico: icoShield },
                                     { id: 'sites',     label: 'Sites',          ico: icoHome },
                                     { id: 'shifts',    label: 'Shift schedule', ico: icoCal }] },
    { label: 'Operations',  items: [{ id: 'incidents', label: 'Incidents',      ico: icoAlert }] },
  ],
  guard: [
    { label: 'My view', items: [{ id: 'my-shift',      label: 'My shift',    ico: icoCal },
                                  { id: 'log-incident', label: 'Log incident', ico: icoAlert }] },
  ],
  client: [
    { label: 'My site', items: [{ id: 'site-report',       label: 'Site report', ico: icoHome },
                                  { id: 'client-incidents', label: 'Incidents',   ico: icoAlert }] },
  ],
};

function renderSidebar() {
  const nav = NAV[S.role];
  let html = '';
  nav.forEach(section => {
    html += `<div class="nav-label">${section.label}</div>`;
    section.items.forEach(item => {
      html += `
        <div class="nav-item ${S.page === item.id ? 'active' : ''}" onclick="go('${item.id}')">
          ${item.ico()}
          <span>${item.label}</span>
        </div>`;
    });
  });
  document.getElementById('sidebar').innerHTML = html;
}

function renderMain() {
  const pages = {
    'dashboard':        pgDash,
    'guards':           pgGuards,
    'sites':            pgSites,
    'shifts':           pgShifts,
    'incidents':        pgIncidents,
    'my-shift':         pgMyShift,
    'log-incident':     pgLogInc,
    'site-report':      pgSiteReport,
    'client-incidents': pgClientInc,
  };
  const fn = pages[S.page];
  document.getElementById('main').innerHTML = fn ? fn() : '<p>Page not found.</p>';
  if (S.page === 'log-incident') wireLogInc();
}

function go(page) {
  S.page = page;
  renderSidebar();
  renderMain();
}
