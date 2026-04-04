/* =====================
   WeGuard — app.js
   Entry point & role switcher
   ===================== */

function switchRole(role, btn) {
  S.role = role;

  // update role button styles
  document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // set default page and user info per role
  const roleMap = {
    admin:  { page: 'dashboard',   name: 'Admin',       av: 'AD' },
    guard:  { page: 'my-shift',    name: 'Rajiv Sharma', av: 'RS' },
    client: { page: 'site-report', name: 'Omaxe Ltd',    av: 'OM' },
  };

  S.page = roleMap[role].page;
  document.getElementById('u-name').textContent = roleMap[role].name;
  document.getElementById('u-av').textContent   = roleMap[role].av;

  renderSidebar();
  renderMain();
}

/* ---- Boot ---- */
renderSidebar();
renderMain();
