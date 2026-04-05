/* WeGuard Pro — pages/incidents.js */
function pgIncidents(){
  const isClient = S.role==='client';
  const list     = isClient ? DEMO.incidents.filter(i=>i.site==='Mall Complex') : DEMO.incidents;

  return `
  <div class="page-header">
    <div><div class="page-title">Incidents</div><div class="page-sub">${list.length} total · ${list.filter(i=>i.status==='open').length} open</div></div>
    <div class="header-actions">
      ${S.role!=='client'?`<button class="btn btn-primary" onclick="openLogIncident()">+ Log incident</button>`:''}
    </div>
  </div>

  <div class="stats-grid col3" style="margin-bottom:1.25rem">
    <div class="stat-card"><div class="stat-label">High severity</div><div class="stat-value" style="color:#E24B4A">${list.filter(i=>i.severity==='high').length}</div></div>
    <div class="stat-card"><div class="stat-label">Open</div><div class="stat-value">${list.filter(i=>i.status==='open').length}</div></div>
    <div class="stat-card"><div class="stat-label">Resolved</div><div class="stat-value" style="color:var(--accent)">${list.filter(i=>i.status==='resolved').length}</div></div>
  </div>

  <div class="card">
    <div class="table-wrap">
      <table>
        <thead><tr><th>ID</th><th>Type</th><th>Site</th><th>Guard</th><th>Severity</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${list.map(inc=>`<tr>
            <td style="font-family:var(--mono);font-size:11px;color:var(--text-3)">${inc.id}</td>
            <td style="font-weight:500">${inc.type}</td>
            <td style="color:var(--text-2)">${inc.site}</td>
            <td style="color:var(--text-2)">${inc.guard}</td>
            <td>${sevBadge(inc.severity)}</td>
            <td style="font-size:12px;color:var(--text-2)">${inc.time}</td>
            <td>${incStsBadge(inc.status)}</td>
            <td>
              <div style="display:flex;gap:6px">
                <button class="btn btn-xs" onclick="viewIncident('${inc.id}')">View</button>
                ${inc.status==='open' && S.role!=='client' ? `<button class="btn btn-xs btn-primary" onclick="resolveIncident('${inc.id}')">Resolve</button>` : ''}
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function openLogIncident(){
  openModal('Log incident', `
    <div class="form-row-2">
      <div class="form-row" style="margin-bottom:0">
        <label class="form-label">Incident type</label>
        <select id="i-type"><option>Trespassing</option><option>Theft Attempt</option><option>Suspicious Activity</option><option>Equipment Fault</option><option>Medical Emergency</option><option>Vandalism</option><option>Other</option></select>
      </div>
      <div class="form-row" style="margin-bottom:0">
        <label class="form-label">Severity</label>
        <select id="i-sev"><option value="low">Low</option><option value="medium" selected>Medium</option><option value="high">High</option></select>
      </div>
    </div>
    <div class="form-row">
      <label class="form-label">Site</label>
      <select id="i-site">${DEMO.sites.map(s=>`<option>${s.name}</option>`).join('')}</select>
    </div>
    <div class="form-row">
      <label class="form-label">Description</label>
      <textarea id="i-desc" placeholder="Describe what happened in detail..."></textarea>
    </div>`,
    `<button class="btn" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="submitIncident()">Submit</button>`
  );
}

function submitIncident(){
  const desc = document.getElementById('i-desc').value.trim();
  if(!desc){ alert('Add a description.'); return; }
  const num = 42 + DEMO.incidents.length;
  DEMO.incidents.unshift({
    id: 'INC-0'+num,
    type: document.getElementById('i-type').value,
    site: document.getElementById('i-site').value,
    guard: S.user?.name || 'Guard',
    severity: document.getElementById('i-sev').value,
    time: 'Just now',
    status: 'open',
    desc
  });
  closeModal(); go('incidents');
}

function viewIncident(id){
  const inc = DEMO.incidents.find(i=>i.id===id);
  if(!inc) return;
  openModal(inc.type, `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:1rem">
      <div><div class="stat-label">Site</div><div style="font-weight:500">${inc.site}</div></div>
      <div><div class="stat-label">Guard</div><div style="font-weight:500">${inc.guard}</div></div>
      <div><div class="stat-label">Severity</div>${sevBadge(inc.severity)}</div>
      <div><div class="stat-label">Status</div>${incStsBadge(inc.status)}</div>
      <div><div class="stat-label">Time</div><div style="font-size:13px">${inc.time}</div></div>
      <div><div class="stat-label">ID</div><div style="font-family:var(--mono);font-size:12px">${inc.id}</div></div>
    </div>
    <div><div class="stat-label" style="margin-bottom:6px">Description</div>
    <div style="background:var(--bg-secondary);padding:12px;border-radius:var(--radius);font-size:13px">${inc.desc||'No description provided.'}</div></div>`,
    `<button class="btn" onclick="closeModal()">Close</button>
     ${inc.status==='open'?`<button class="btn btn-primary" onclick="resolveIncident('${inc.id}');closeModal()">Mark resolved</button>`:''}`
  );
}

function resolveIncident(id){
  const inc = DEMO.incidents.find(i=>i.id===id);
  if(inc) inc.status='resolved';
  go('incidents');
}
