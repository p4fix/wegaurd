/* WeGuard Pro — pages/patrol.js */
function pgPatrol(){
  const done   = DEMO.checkpoints.filter(c=>c.done).length;
  const total  = DEMO.checkpoints.length;
  const site   = S.role==='guard' ? 'Mall Complex' : null;
  const cps    = site ? DEMO.checkpoints.filter(c=>c.site===site) : DEMO.checkpoints;
  return `
  <div class="page-header">
    <div><div class="page-title">Patrol Checkpoints</div><div class="page-sub">${done}/${total} cleared today</div></div>
    ${S.role==='guard'?`<button class="btn btn-primary" onclick="openQRScan()">Scan QR checkpoint</button>`:''}
  </div>

  <div class="stats-grid col3" style="margin-bottom:1.25rem">
    <div class="stat-card"><div class="stat-label">Completed</div><div class="stat-value" style="color:var(--accent)">${done}</div></div>
    <div class="stat-card"><div class="stat-label">Pending</div><div class="stat-value">${total-done}</div></div>
    <div class="stat-card"><div class="stat-label">Progress</div><div class="stat-value">${Math.round(done/total*100)}%</div></div>
  </div>

  ${DEMO.sites.map(s=>{
    const siteCP = DEMO.checkpoints.filter(c=>c.site===s.name);
    if(!siteCP.length) return '';
    return `
    <div class="card">
      <div class="card-header"><span class="card-title">${s.name}</span><span class="badge badge-gray">${siteCP.filter(c=>c.done).length}/${siteCP.length} done</span></div>
      <div class="checkpoint-list">
        ${siteCP.map(cp=>`
          <div class="checkpoint ${cp.done?'done':''}">
            <div class="cp-icon" style="background:${cp.done?'var(--accent-light)':'var(--bg-secondary)'}">
              ${cp.done ? '✓' : '○'}
            </div>
            <div style="flex:1">
              <div class="cp-name">${cp.name}</div>
              <div class="cp-time">${cp.done ? `Cleared at ${cp.lastScan} by ${cp.guard}` : 'Not yet scanned'}</div>
            </div>
            ${S.role==='guard' && !cp.done ? `<button class="btn btn-sm btn-primary" onclick="markCheckpoint('${cp.id}')">Mark done</button>` : ''}
            ${S.role!=='guard' && !cp.done ? '<span class="badge badge-amber">Pending</span>' : ''}
          </div>`).join('')}
      </div>
    </div>`;
  }).join('')}`;
}

function markCheckpoint(id){
  const cp = DEMO.checkpoints.find(c=>c.id===id);
  if(cp){ cp.done=true; cp.lastScan=nowTime(); cp.guard=S.user?.name||'Guard'; }
  go('patrol');
}

function openQRScan(){
  openModal('Scan Checkpoint QR',
    `<div style="text-align:center;padding:2rem">
      <div style="width:160px;height:160px;background:var(--bg-secondary);border-radius:var(--radius-lg);margin:0 auto 1rem;display:flex;align-items:center;justify-content:center;font-size:48px">📷</div>
      <p style="color:var(--text-2);font-size:13px;margin-bottom:1rem">Point camera at checkpoint QR code, or select manually:</p>
      <select id="qr-cp" style="text-align:center">
        ${DEMO.checkpoints.filter(c=>!c.done).map(c=>`<option value="${c.id}">${c.name} — ${c.site}</option>`).join('')}
      </select>
    </div>`,
    `<button class="btn" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="markCheckpoint(document.getElementById('qr-cp').value);closeModal()">Confirm scan</button>`
  );
}
