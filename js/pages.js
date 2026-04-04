/* =====================
   WeGuard — pages.js
   One function per page
   ===================== */

/* ---- DASHBOARD ---- */
function pgDash() {
  const onDuty = S.guards.filter(g => g.status === 'on-duty').length;
  const open   = S.incidents.filter(i => i.status === 'open').length;

  return `
    <div class="page-header">
      <div>
        <div class="page-title">Dashboard</div>
        <div class="page-sub">Monday, 30 March 2026</div>
      </div>
    </div>

    <div class="stats-row">
      <div class="stat-card">
        <div class="stat-label">Guards</div>
        <div class="stat-value">${S.guards.length}</div>
        <div class="stat-sub"><span class="dot" style="background:#2D6A4F"></span>${onDuty} on duty now</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Active sites</div>
        <div class="stat-value">${S.sites.length}</div>
        <div class="stat-sub">All operational</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Open incidents</div>
        <div class="stat-value">${open}</div>
        <div class="stat-sub">Needs review</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Patrol hours</div>
        <div class="stat-value">43</div>
        <div class="stat-sub">This week</div>
      </div>
    </div>

    <div class="two-col">
      <div class="card">
        <div class="card-header">
          <span class="card-title">Recent incidents</span>
          <button class="btn btn-sm" onclick="go('incidents')">View all</button>
        </div>
        ${S.incidents.slice(0, 3).map(inc => `
          <div class="incident-row">
            <div class="inc-dot" style="background:${inc.severity === 'high' ? '#E24B4A' : inc.severity === 'medium' ? '#EF9F27' : '#888780'}"></div>
            <div class="inc-body">
              <div class="inc-title">${inc.type}</div>
              <div class="inc-meta">${inc.site} · ${inc.guard}</div>
            </div>
            <div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px">
              <div class="inc-time">${inc.time}</div>
              ${incStsBadge(inc.status)}
            </div>
          </div>`).join('')}
      </div>

      <div class="card">
        <div class="card-header">
          <span class="card-title">Guard status</span>
          <button class="btn btn-sm" onclick="go('guards')">Manage</button>
        </div>
        ${S.guards.map((g, i) => {
          const [bg, fg] = avatarColor(i);
          return `
            <div class="g-row" style="padding:8px 0;border-bottom:0.5px solid rgba(0,0,0,0.08)">
              <div class="g-avatar" style="background:${bg};color:${fg}">${initials(g.name)}</div>
              <div style="flex:1">
                <div class="g-name">${g.name}</div>
                <div class="g-id">${g.site}</div>
              </div>
              ${stsBadge(g.status)}
            </div>`;
        }).join('')}
      </div>
    </div>`;
}

/* ---- GUARDS ---- */
function pgGuards() {
  return `
    <div class="page-header">
      <div>
        <div class="page-title">Guards</div>
        <div class="page-sub">Security staff profiles</div>
      </div>
      <button class="btn btn-primary" onclick="openAddGuard()">+ Add guard</button>
    </div>

    <div class="card">
      <table>
        <thead>
          <tr>
            <th>Guard</th>
            <th>Assigned site</th>
            <th>Shift</th>
            <th>Status</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          ${S.guards.map((g, i) => {
            const [bg, fg] = avatarColor(i);
            return `
              <tr>
                <td>
                  <div class="g-row">
                    <div class="g-avatar" style="background:${bg};color:${fg}">${initials(g.name)}</div>
                    <div>
                      <div class="g-name">${g.name}</div>
                      <div class="g-id">${g.id}</div>
                    </div>
                  </div>
                </td>
                <td style="color:var(--text-secondary)">${g.site}</td>
                <td><span class="badge ${g.shift === 'Night' ? 'badge-teal' : 'badge-gray'}">${g.shift}</span></td>
                <td>${stsBadge(g.status)}</td>
                <td style="font-size:12px;color:var(--text-secondary)">${g.phone}</td>
              </tr>`;
          }).join('')}
        </tbody>
      </table>
    </div>`;
}

/* ---- SITES ---- */
function pgSites() {
  return `
    <div class="page-header">
      <div>
        <div class="page-title">Sites</div>
        <div class="page-sub">Locations under protection</div>
      </div>
      <button class="btn btn-primary" onclick="openAddSite()">+ Add site</button>
    </div>

    <div class="site-grid">
      ${S.sites.map(s => `
        <div class="site-card">
          <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px">
            <div class="site-name">${s.name}</div>
            <span class="badge badge-green" style="font-size:10px">Active</span>
          </div>
          <div class="site-addr">${s.address}</div>
          <div style="font-size:11px;color:var(--text-tertiary)">Client: ${s.client}</div>
          <div class="site-stats">
            <div class="site-stat"><strong>${s.guards}</strong><span>Guards</span></div>
            <div class="site-stat"><strong>${s.incidents}</strong><span>Incidents</span></div>
          </div>
        </div>`).join('')}
    </div>`;
}

/* ---- SHIFTS ---- */
function pgShifts() {
  return `
    <div class="page-header">
      <div>
        <div class="page-title">Shift schedule</div>
        <div class="page-sub">Week of 30 Mar – 5 Apr 2026</div>
      </div>
    </div>

    <div class="card" style="overflow-x:auto">
      <div class="shift-grid">
        <div class="shift-cell shift-header" style="text-align:left;padding-left:8px">Guard</div>
        ${DAYS.map(d => `<div class="shift-cell shift-header">${d}</div>`).join('')}

        ${S.guards.map(g => `
          <div class="shift-cell shift-name-cell">${g.name.split(' ')[0]}</div>
          ${(S.shifts[g.name] || []).map(s => `
            <div class="shift-cell" style="display:flex;align-items:center;justify-content:center">
              <div class="shift-block ${s === 'Day' ? 'sb-day' : s === 'Night' ? 'sb-night' : s === 'Leave' ? 'sb-leave' : 'sb-off'}">${s}</div>
            </div>`).join('')}`).join('')}
      </div>
    </div>`;
}

/* ---- INCIDENTS ---- */
function pgIncidents() {
  return `
    <div class="page-header">
      <div>
        <div class="page-title">Incidents</div>
        <div class="page-sub">All logged incidents across sites</div>
      </div>
    </div>

    <div class="card">
      <table>
        <thead>
          <tr>
            <th>ID</th><th>Type</th><th>Site</th><th>Guard</th><th>Severity</th><th>Time</th><th>Status</th>
          </tr>
        </thead>
        <tbody>
          ${S.incidents.map(inc => `
            <tr>
              <td style="font-size:11px;color:var(--text-tertiary);font-family:var(--font-mono)">${inc.id}</td>
              <td style="font-weight:500">${inc.type}</td>
              <td style="color:var(--text-secondary)">${inc.site}</td>
              <td style="color:var(--text-secondary)">${inc.guard}</td>
              <td>${sevBadge(inc.severity)}</td>
              <td style="font-size:12px;color:var(--text-secondary)">${inc.time}</td>
              <td>${incStsBadge(inc.status)}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}

/* ---- MY SHIFT (Guard view) ---- */
function pgMyShift() {
  const g = S.guards[0];
  const patrolLog = [
    { time: '09:00', msg: 'Started perimeter check — all clear' },
    { time: '09:45', msg: 'Gate 2 inspected, visitor logged' },
    { time: '10:30', msg: 'Routine patrol — Block A' },
    { time: '11:15', msg: 'CCTV check — all feeds normal' },
  ];

  return `
    <div class="page-header">
      <div>
        <div class="page-title">My shift</div>
        <div class="page-sub">${g.name} · ${g.id}</div>
      </div>
    </div>

    <div class="alert-info">
      Currently on duty at <strong>${g.site}</strong> — Day shift · Started 08:00
    </div>

    <div class="two-col">
      <div class="card">
        <div class="card-header"><span class="card-title">Today's patrol log</span></div>
        ${patrolLog.map((entry, i) => `
          <div class="tl-item">
            <div style="position:relative">
              <div class="tl-dot" style="background:#2D6A4F"></div>
              ${i < patrolLog.length - 1 ? '<div class="tl-line"></div>' : ''}
            </div>
            <div>
              <div class="tl-text">${entry.msg}</div>
              <div class="tl-time">${entry.time}</div>
            </div>
          </div>`).join('')}
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">This week</span></div>
        ${DAYS.map((d, i) => {
          const sh = S.shifts['Rajiv Sharma'][i];
          return `
            <div style="display:flex;align-items:center;justify-content:space-between;padding:7px 0;border-bottom:0.5px solid rgba(0,0,0,0.08);font-size:13px">
              <span style="color:var(--text-secondary)">${d}</span>
              <span class="badge ${sh === 'Day' ? 'badge-teal' : sh === 'Off' ? 'badge-gray' : 'badge-amber'}">${sh}</span>
            </div>`;
        }).join('')}
      </div>
    </div>

    <div style="margin-top:8px">
      <button class="btn btn-primary" onclick="go('log-incident')">+ Log new incident</button>
    </div>`;
}

/* ---- LOG INCIDENT (Guard view) ---- */
function pgLogInc() {
  return `
    <div class="page-header">
      <div>
        <div class="page-title">Log incident</div>
        <div class="page-sub">Report something at your site</div>
      </div>
    </div>

    <div class="card" style="max-width:480px">
      <div class="form-row">
        <label class="form-label">Incident type</label>
        <select id="inc-type">
          <option>Trespassing</option>
          <option>Theft Attempt</option>
          <option>Suspicious Activity</option>
          <option>Equipment Fault</option>
          <option>Injury</option>
          <option>Other</option>
        </select>
      </div>
      <div class="form-row">
        <label class="form-label">Severity</label>
        <select id="inc-sev">
          <option value="low">Low</option>
          <option value="medium" selected>Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <div class="form-row">
        <label class="form-label">Description</label>
        <textarea id="inc-desc" placeholder="Describe what happened..."></textarea>
      </div>
      <button class="btn btn-primary" id="inc-submit">Submit report</button>
    </div>`;
}

function wireLogInc() {
  const btn = document.getElementById('inc-submit');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const desc = document.getElementById('inc-desc').value.trim();
    if (!desc) { alert('Please add a description.'); return; }
    const newId = 'INC-0' + (42 + S.incidents.length);
    S.incidents.unshift({
      id:       newId,
      type:     document.getElementById('inc-type').value,
      site:     'Mall Complex',
      guard:    'Rajiv Sharma',
      severity: document.getElementById('inc-sev').value,
      time:     'Just now',
      status:   'open',
    });
    go('my-shift');
  });
}

/* ---- SITE REPORT (Client view) ---- */
function pgSiteReport() {
  const site       = S.sites[0];
  const siteGuards = S.guards.filter(g => g.site === site.name);

  return `
    <div class="page-header">
      <div>
        <div class="page-title">Site report</div>
        <div class="page-sub">${site.name} · ${site.address}</div>
      </div>
    </div>

    <div class="stats-row" style="grid-template-columns:repeat(3,1fr)">
      <div class="stat-card">
        <div class="stat-label">Guards on site</div>
        <div class="stat-value">${site.guards}</div>
        <div class="stat-sub">Active now</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Incidents (month)</div>
        <div class="stat-value">${site.incidents}</div>
        <div class="stat-sub">1 unresolved</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Site status</div>
        <div class="stat-value" style="font-size:20px;color:#2D6A4F">Active</div>
        <div class="stat-sub">No current alerts</div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><span class="card-title">Guards assigned to your site</span></div>
      ${siteGuards.map((g, i) => {
        const [bg, fg] = avatarColor(i);
        return `
          <div class="g-row" style="padding:10px 0;border-bottom:0.5px solid rgba(0,0,0,0.08)">
            <div class="g-avatar" style="background:${bg};color:${fg}">${initials(g.name)}</div>
            <div style="flex:1">
              <div class="g-name">${g.name}</div>
              <div class="g-id">${g.shift} shift</div>
            </div>
            ${stsBadge(g.status)}
          </div>`;
      }).join('')}
    </div>`;
}

/* ---- CLIENT INCIDENTS ---- */
function pgClientInc() {
  const mine = S.incidents.filter(i => i.site === 'Mall Complex');

  return `
    <div class="page-header">
      <div>
        <div class="page-title">Incidents</div>
        <div class="page-sub">Mall Complex — all reports</div>
      </div>
    </div>

    <div class="card">
      <table>
        <thead>
          <tr><th>ID</th><th>Type</th><th>Severity</th><th>Time</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${mine.map(inc => `
            <tr>
              <td style="font-size:11px;color:var(--text-tertiary);font-family:var(--font-mono)">${inc.id}</td>
              <td style="font-weight:500">${inc.type}</td>
              <td>${sevBadge(inc.severity)}</td>
              <td style="font-size:12px;color:var(--text-secondary)">${inc.time}</td>
              <td>${incStsBadge(inc.status)}</td>
            </tr>`).join('')}
        </tbody>
      </table>
    </div>`;
}
