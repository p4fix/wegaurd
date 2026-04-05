/* WeGuard Pro — pages/dashboard.js */
function pgDashboard(){
  const onDuty   = DEMO.guards.filter(g=>g.status==='on-duty').length;
  const open     = DEMO.incidents.filter(i=>i.status==='open').length;
  const revenue  = DEMO.invoices.filter(i=>i.status==='paid').reduce((a,b)=>a+b.amount,0);
  const pending  = DEMO.invoices.filter(i=>i.status!=='paid').reduce((a,b)=>a+b.amount,0);

  return `
  <div class="page-header">
    <div><div class="page-title">Dashboard</div><div class="page-sub">${nowDate()}</div></div>
    <div class="header-actions">
      <button class="btn btn-danger btn-sm" onclick="triggerSOS()">Test SOS</button>
    </div>
  </div>

  <div class="stats-grid col4">
    <div class="stat-card">
      <div class="stat-label">Guards on duty</div>
      <div class="stat-value" style="color:var(--accent)">${onDuty}</div>
      <div class="stat-sub"><span class="status-dot dot-green"></span>${DEMO.guards.length} total guards</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Active sites</div>
      <div class="stat-value">${DEMO.sites.length}</div>
      <div class="stat-sub">${DEMO.checkpoints.filter(c=>c.done).length} checkpoints cleared today</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Open incidents</div>
      <div class="stat-value" style="color:${open>0?'#E24B4A':'var(--accent)'}">${open}</div>
      <div class="stat-sub">${DEMO.incidents.length} total this month</div>
    </div>
    <div class="stat-card">
      <div class="stat-label">Revenue (March)</div>
      <div class="stat-value" style="font-size:22px">${fmtCurrency(revenue)}</div>
      <div class="stat-sub stat-trend-dn">${fmtCurrency(pending)} pending</div>
    </div>
  </div>

  <div class="two-col">
    <div class="card">
      <div class="card-header">
        <span class="card-title">Guard status</span>
        <button class="btn btn-sm" onclick="go('guards')">Manage</button>
      </div>
      ${DEMO.guards.map((g,i)=>`
        <div style="display:flex;align-items:center;gap:10px;padding:9px 0;border-bottom:0.5px solid var(--border)">
          ${avatarHTML(g.name,i,'sm')}
          <div style="flex:1">
            <div style="font-weight:500;font-size:13px">${g.name}</div>
            <div style="font-size:11px;color:var(--text-2)">${g.site}</div>
          </div>
          ${stsBadge(g.status)}
        </div>`).join('')}
    </div>

    <div>
      <div class="card">
        <div class="card-header">
          <span class="card-title">Recent incidents</span>
          <button class="btn btn-sm" onclick="go('incidents')">View all</button>
        </div>
        ${DEMO.incidents.slice(0,4).map(inc=>`
          <div style="display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:0.5px solid var(--border)">
            <span class="status-dot ${inc.severity==='high'?'dot-red':inc.severity==='medium'?'dot-amber':'dot-gray'}" style="margin-top:5px;width:8px;height:8px"></span>
            <div style="flex:1">
              <div style="font-weight:500;font-size:13px">${inc.type}</div>
              <div style="font-size:11px;color:var(--text-2)">${inc.site} · ${inc.time}</div>
            </div>
            ${incStsBadge(inc.status)}
          </div>`).join('')}
      </div>

      <div class="card">
        <div class="card-header"><span class="card-title">Today's attendance</span><button class="btn btn-sm" onclick="go('attendance')">Full report</button></div>
        ${DEMO.attendance.slice(0,4).map(a=>`
          <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:0.5px solid var(--border);font-size:13px">
            <span>${a.guard.split(' ')[0]}</span>
            <span style="font-family:var(--mono);font-size:12px;color:var(--text-2)">${a.checkIn||'—'}</span>
            ${attStsBadge(a.status)}
          </div>`).join('')}
      </div>
    </div>
  </div>

  <div class="card">
    <div class="card-header"><span class="card-title">Site overview</span><button class="btn btn-sm" onclick="go('sites')">Manage sites</button></div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Site</th><th>Client</th><th>Guards</th><th>Monthly fee</th><th>Checkpoints</th><th>Status</th></tr></thead>
        <tbody>
          ${DEMO.sites.map(s=>`<tr>
            <td style="font-weight:500">${s.name}</td>
            <td style="color:var(--text-2)">${s.client}</td>
            <td>${s.guards}</td>
            <td style="font-family:var(--mono)">${fmtCurrency(s.monthly)}</td>
            <td>${s.checkpoints} points</td>
            <td><span class="badge badge-green">Active</span></td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}
