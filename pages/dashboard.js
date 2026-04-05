/* ═══ pages/dashboard.js ═══ */
function pgDashboard(){
  const onDuty  = DEMO.guards.filter(g=>g.status==='on-duty').length;
  const openInc = DEMO.incidents.filter(i=>i.status==='open').length;
  const revenue = DEMO.invoices.filter(i=>i.status==='paid').reduce((a,b)=>a+b.amount,0);
  const cpDone  = DEMO.checkpoints.filter(c=>c.done).length;

  return `
  <div class="page-header">
    <div class="ph-left">
      <div class="page-title">Operations Dashboard</div>
      <div class="page-sub">${nowDate()} · Real-time overview</div>
    </div>
    <div class="page-actions">
      <button class="btn btn-danger btn-sm" onclick="triggerSOS()">🚨 Test SOS</button>
      <button class="btn btn-sm" onclick="go('reports')">View reports</button>
    </div>
  </div>

  <!-- HERO BANNER -->
  <div style="background:linear-gradient(135deg,#0d2b1f 0%,#1a3d2e 60%,#0d2b1f 100%);border:0.5px solid rgba(82,183,136,.2);border-radius:20px;padding:1.5rem 2rem;margin-bottom:1.5rem;display:flex;align-items:center;justify-content:space-between;position:relative;overflow:hidden">
    <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(82,183,136,.03) 1px,transparent 1px),linear-gradient(90deg,rgba(82,183,136,.03) 1px,transparent 1px);background-size:30px 30px;pointer-events:none"></div>
    <div style="position:relative;z-index:1">
      <div style="font-size:12px;color:var(--accent);font-weight:600;letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px">Security status</div>
      <div style="font-family:'Syne',sans-serif;font-size:28px;font-weight:700;color:var(--text);margin-bottom:8px">All sites <span style="color:var(--accent)">operational</span></div>
      <div style="font-size:13px;color:var(--text2)">${onDuty} guards on duty · ${DEMO.sites.length} sites active · ${cpDone} checkpoints cleared</div>
    </div>
    <div style="display:flex;align-items:center;gap:1rem;position:relative;z-index:1">
      <svg viewBox="0 0 120 140" width="90" opacity=".6">
        <defs><linearGradient id="dg" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#52B788"/><stop offset="100%" style="stop-color:#2D6A4F"/></linearGradient></defs>
        <path d="M60 8 L105 28 L105 65 C105 92 85 112 60 122 C35 112 15 92 15 65 L15 28 Z" fill="url(#dg)" opacity="0.2"/>
        <path d="M60 14 L100 32 L100 65 C100 90 82 108 60 118 C38 108 20 90 20 65 L20 32 Z" fill="none" stroke="url(#dg)" stroke-width="1.5"/>
        <polyline points="42,65 54,78 80,50" fill="none" stroke="#52B788" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </div>

  <!-- STAT CARDS -->
  <div class="stats-grid c4">
    <div class="stat-card" style="animation-delay:.05s">
      <div class="stat-card-icon sc-green">🛡️</div>
      <div class="stat-label">Guards on duty</div>
      <div class="stat-value" id="sc1">0</div>
      <div class="stat-sub"><span class="sdot sdot-green"></span><span class="trend-up">↑ 2 from yesterday</span></div>
      <svg class="stat-spark" viewBox="0 0 60 24" width="60" height="24" fill="none" stroke="var(--accent)" stroke-width="1.5"><polyline points="0,18 10,14 20,16 30,10 40,12 50,6 60,8"/></svg>
    </div>
    <div class="stat-card" style="animation-delay:.1s">
      <div class="stat-card-icon sc-blue">🏢</div>
      <div class="stat-label">Active sites</div>
      <div class="stat-value" id="sc2">0</div>
      <div class="stat-sub"><span class="sdot sdot-green"></span>All operational</div>
    </div>
    <div class="stat-card" style="animation-delay:.15s">
      <div class="stat-card-icon sc-red">⚠️</div>
      <div class="stat-label">Open incidents</div>
      <div class="stat-value" id="sc3" style="color:${openInc>0?'var(--red)':'var(--accent)'}">0</div>
      <div class="stat-sub">${openInc>0?'<span class="trend-dn">Needs attention</span>':'<span class="trend-up">All resolved</span>'}</div>
    </div>
    <div class="stat-card" style="animation-delay:.2s">
      <div class="stat-card-icon sc-amber">💰</div>
      <div class="stat-label">Revenue collected</div>
      <div class="stat-value" id="sc4" style="font-size:22px">₹0</div>
      <div class="stat-sub"><span class="trend-up">March 2026</span></div>
      <svg class="stat-spark" viewBox="0 0 60 24" width="60" height="24" fill="none" stroke="var(--amber)" stroke-width="1.5"><polyline points="0,20 10,16 20,18 30,12 40,8 50,10 60,4"/></svg>
    </div>
  </div>

  <div class="two-col">
    <!-- GUARD STATUS -->
    <div class="card">
      <div class="card-head">
        <span class="card-title">Guard status</span>
        <button class="btn btn-sm" onclick="go('guards')">Manage →</button>
      </div>
      <div class="card-body no-pad">
        ${DEMO.guards.map((g,i)=>`
        <div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:0.5px solid var(--border);transition:background .1s" onmouseenter="this.style.background='var(--glass)'" onmouseleave="this.style.background=''">
          ${avHTML(g.name,i,36)}
          <div style="flex:1">
            <div style="font-weight:500;font-size:13px;color:var(--text)">${g.name}</div>
            <div style="font-size:11px;color:var(--text3)">${g.site} · ${g.shift} shift</div>
          </div>
          ${stsBadge(g.status)}
        </div>`).join('')}
      </div>
    </div>

    <div>
      <!-- INCIDENTS -->
      <div class="card">
        <div class="card-head">
          <span class="card-title">Recent incidents</span>
          <button class="btn btn-sm" onclick="go('incidents')">View all →</button>
        </div>
        <div class="card-body no-pad">
          ${DEMO.incidents.slice(0,4).map(inc=>`
          <div style="display:flex;align-items:center;gap:12px;padding:11px 16px;border-bottom:0.5px solid var(--border);transition:background .1s" onmouseenter="this.style.background='var(--glass)'" onmouseleave="this.style.background=''">
            <div style="width:8px;height:8px;border-radius:50%;flex-shrink:0;background:${inc.severity==='high'?'var(--red)':inc.severity==='medium'?'var(--amber)':'var(--text3)'}"></div>
            <div style="flex:1">
              <div style="font-weight:500;font-size:13px;color:var(--text)">${inc.type}</div>
              <div style="font-size:11px;color:var(--text3)">${inc.site} · ${inc.time}</div>
            </div>
            ${incBadge(inc.status)}
          </div>`).join('')}
        </div>
      </div>

      <!-- PATROL PROGRESS -->
      <div class="card">
        <div class="card-head">
          <span class="card-title">Today's patrol</span>
          <button class="btn btn-sm" onclick="go('patrol')">Details →</button>
        </div>
        <div class="card-body">
          ${DEMO.sites.map(s=>{
            const cps=DEMO.checkpoints.filter(c=>c.site===s.name);
            const done=cps.filter(c=>c.done).length;
            const pct=cps.length?Math.round(done/cps.length*100):0;
            return `<div class="prog-row">
              <div class="prog-label">${s.name.split(' ')[0]}</div>
              <div class="prog-track"><div class="prog-fill" data-w="${pct}" style="width:0;background:${pct===100?'var(--accent)':pct>50?'var(--amber)':'var(--red)'}"></div></div>
              <div class="prog-val">${done}/${cps.length}</div>
            </div>`;
          }).join('')}
        </div>
      </div>
    </div>
  </div>

  <!-- SITE OVERVIEW TABLE -->
  <div class="card">
    <div class="card-head"><span class="card-title">Site overview</span><button class="btn btn-sm" onclick="go('sites')">Manage →</button></div>
    <div class="card-body no-pad">
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Site</th><th>Client</th><th>Guards</th><th>Monthly fee</th><th>Open incidents</th><th>Status</th></tr></thead>
          <tbody>
            ${DEMO.sites.map(s=>{
              const oi=DEMO.incidents.filter(i=>i.site===s.name&&i.status==='open').length;
              return `<tr>
                <td><strong>${s.name}</strong></td>
                <td>${s.client}</td>
                <td>${s.guards}</td>
                <td style="font-weight:600;color:var(--accent)">${fc(s.monthly)}</td>
                <td>${oi>0?`<span class="badge badge-red">${oi} open</span>`:'<span class="badge badge-green">Clear</span>'}</td>
                <td><span class="badge badge-green"><span class="sdot sdot-green"></span>Active</span></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

function afterDashboard(){
  // Animate counters
  const onDuty  = DEMO.guards.filter(g=>g.status==='on-duty').length;
  const openInc = DEMO.incidents.filter(i=>i.status==='open').length;
  const revenue = DEMO.invoices.filter(i=>i.status==='paid').reduce((a,b)=>a+b.amount,0);
  const el1=document.getElementById('sc1'),el2=document.getElementById('sc2'),el3=document.getElementById('sc3'),el4=document.getElementById('sc4');
  if(el1) animateCount(el1, onDuty, 800);
  if(el2) animateCount(el2, DEMO.sites.length, 800);
  if(el3) animateCount(el3, openInc, 800);
  if(el4) animateCount(el4, revenue, 1200, '₹');
  animateBars();
}
