/* patrol.js */
function pgPatrol(){
  const done=DEMO.checkpoints.filter(c=>c.done).length,total=DEMO.checkpoints.length;
  return `<div class="page-header"><div class="ph-left"><div class="page-title">Patrol Checkpoints</div><div class="page-sub">${done}/${total} cleared today</div></div><div class="page-actions">${S.role==='guard'?`<button class="btn btn-primary" onclick="openQR()">📷 Scan QR</button>`:''}</div></div>
  <div class="stats-grid c3" style="margin-bottom:1.5rem"><div class="stat-card"><div class="stat-card-icon sc-green">✅</div><div class="stat-label">Completed</div><div class="stat-value" style="color:var(--accent)">${done}</div></div><div class="stat-card"><div class="stat-card-icon sc-amber">⏳</div><div class="stat-label">Pending</div><div class="stat-value">${total-done}</div></div><div class="stat-card"><div class="stat-card-icon sc-blue">📊</div><div class="stat-label">Coverage</div><div class="stat-value">${Math.round(done/total*100)}%</div></div></div>
  ${DEMO.sites.map(s=>{const cps=DEMO.checkpoints.filter(c=>c.site===s.name);if(!cps.length)return'';return`<div class="card"><div class="card-head"><span class="card-title">${s.name}</span><span class="badge ${cps.filter(c=>c.done).length===cps.length?'badge-green':'badge-amber'}">${cps.filter(c=>c.done).length}/${cps.length}</span></div><div class="card-body">${cps.map(cp=>`<div class="checkpoint ${cp.done?'done':''}"><div class="cp-ico" style="background:${cp.done?'rgba(82,183,136,.12)':'var(--bg3)'}">${cp.done?'✅':'⭕'}</div><div style="flex:1"><div class="cp-name">${cp.name}</div><div class="cp-meta">${cp.done?`Cleared ${cp.lastScan} by ${cp.guard}`:'Not yet scanned'}</div></div>${S.role==='guard'&&!cp.done?`<button class="btn btn-sm btn-primary" onclick="markCP('${cp.id}')">Mark done</button>`:''}${S.role!=='guard'&&!cp.done?'<span class="badge badge-amber">Pending</span>':''}</div>`).join('')}</div></div>`;}).join('')}`;
}
function markCP(id){const cp=DEMO.checkpoints.find(c=>c.id===id);if(cp){cp.done=true;cp.lastScan=nowTime();cp.guard=S.user?.name||'Guard';}go('patrol');}
function openQR(){openModal('Scan Checkpoint',`<div style="text-align:center;padding:2rem"><div style="width:140px;height:140px;background:var(--bg3);border-radius:16px;margin:0 auto 1rem;display:flex;align-items:center;justify-content:center;font-size:52px;border:1px solid var(--border2)">📷</div><p style="color:var(--text2);font-size:13px;margin-bottom:1rem">Point camera at QR, or select manually:</p><select id="qr-cp">${DEMO.checkpoints.filter(c=>!c.done).map(c=>`<option value="${c.id}">${c.name} — ${c.site}</option>`).join('')}</select></div>`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="markCP(document.getElementById('qr-cp').value);closeModal()">Confirm</button>`);}

/* incidents.js */
function pgIncidents(){
  const isC=S.role==='client',list=isC?DEMO.incidents.filter(i=>i.site==='Mall Complex'):DEMO.incidents;
  return `<div class="page-header"><div class="ph-left"><div class="page-title">Incidents</div><div class="page-sub">${list.filter(i=>i.status==='open').length} open · ${list.length} total</div></div><div class="page-actions">${S.role!=='client'?`<button class="btn btn-primary" onclick="openLogInc()">+ Log incident</button>`:''}</div></div>
  <div class="stats-grid c3" style="margin-bottom:1.5rem"><div class="stat-card"><div class="stat-card-icon sc-red">🔴</div><div class="stat-label">High severity</div><div class="stat-value" style="color:var(--red)">${list.filter(i=>i.severity==='high').length}</div></div><div class="stat-card"><div class="stat-card-icon sc-amber">📋</div><div class="stat-label">Open</div><div class="stat-value">${list.filter(i=>i.status==='open').length}</div></div><div class="stat-card"><div class="stat-card-icon sc-green">✅</div><div class="stat-label">Resolved</div><div class="stat-value" style="color:var(--accent)">${list.filter(i=>i.status==='resolved').length}</div></div></div>
  <div class="card"><div class="card-body no-pad"><div class="tbl-wrap"><table><thead><tr><th>ID</th><th>Type</th><th>Site</th><th>Guard</th><th>Severity</th><th>Time</th><th>Status</th><th>Actions</th></tr></thead><tbody>
  ${list.map(inc=>`<tr><td style="font-family:monospace;font-size:11px;color:var(--text3)">${inc.id}</td><td><strong>${inc.type}</strong></td><td>${inc.site}</td><td>${inc.guard}</td><td>${sevBadge(inc.severity)}</td><td style="font-size:12px">${inc.time}</td><td>${incBadge(inc.status)}</td><td><div style="display:flex;gap:6px"><button class="btn btn-xs" onclick="viewInc('${inc.id}')">View</button>${inc.status==='open'&&S.role!=='client'?`<button class="btn btn-xs btn-primary" onclick="resolveInc('${inc.id}')">Resolve</button>`:''}</div></td></tr>`).join('')}
  </tbody></table></div></div></div>`;
}
function openLogInc(){openModal('Log incident',`<div class="form-row-2"><div class="form-row" style="margin-bottom:0"><label class="form-label">Type</label><select id="i-t"><option>Trespassing</option><option>Theft Attempt</option><option>Suspicious Activity</option><option>Equipment Fault</option><option>Medical Emergency</option><option>Vandalism</option><option>Other</option></select></div><div class="form-row" style="margin-bottom:0"><label class="form-label">Severity</label><select id="i-s"><option value="low">Low</option><option value="medium" selected>Medium</option><option value="high">High</option></select></div></div><div class="form-row"><label class="form-label">Site</label><select id="i-si">${DEMO.sites.map(s=>`<option>${s.name}</option>`).join('')}</select></div><div class="form-row"><label class="form-label">Description</label><textarea id="i-d" placeholder="Describe what happened..."></textarea></div>`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="submitInc()">Submit</button>`);}
function submitInc(){const d=document.getElementById('i-d').value.trim();if(!d){alert('Add description.');return;}DEMO.incidents.unshift({id:'INC-0'+(42+DEMO.incidents.length),type:document.getElementById('i-t').value,site:document.getElementById('i-si').value,guard:S.user?.name||'Guard',severity:document.getElementById('i-s').value,time:'Just now',status:'open',desc:d});closeModal();go('incidents');}
function viewInc(id){const inc=DEMO.incidents.find(i=>i.id===id);if(!inc)return;openModal(inc.type,`<div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:1rem">${[['Site',inc.site],['Guard',inc.guard],['Time',inc.time],['ID',inc.id]].map(([l,v])=>`<div style="background:var(--bg2);padding:12px;border-radius:10px"><div style="font-size:11px;color:var(--text3);margin-bottom:4px">${l}</div><div style="font-size:13px;font-weight:500;color:var(--text)">${v}</div></div>`).join('')}</div><div style="display:flex;gap:8px;margin-bottom:1rem">${sevBadge(inc.severity)}${incBadge(inc.status)}</div><div style="background:var(--bg2);padding:14px;border-radius:10px;font-size:13px;color:var(--text2)">${inc.desc||'No description.'}</div>`,`<button class="btn" onclick="closeModal()">Close</button>${inc.status==='open'?`<button class="btn btn-primary" onclick="resolveInc('${inc.id}');closeModal()">Mark resolved</button>`:''}`);}
function resolveInc(id){const inc=DEMO.incidents.find(i=>i.id===id);if(inc)inc.status='resolved';go('incidents');}

/* sites.js */
function pgSites(){
  return `<div class="page-header"><div class="ph-left"><div class="page-title">Sites</div><div class="page-sub">Protected locations</div></div><div class="page-actions"><button class="btn btn-primary" onclick="openAddSite()">+ Add site</button></div></div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px">
    ${DEMO.sites.map((s,idx)=>`<div class="card" style="margin-bottom:0;transition:transform .2s,box-shadow .2s;cursor:pointer" onmouseenter="this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 40px rgba(0,0,0,.5)'" onmouseleave="this.style.transform='';this.style.boxShadow=''">
      <div style="height:100px;background:linear-gradient(135deg,#0d2b1f,#1a3d2e);border-radius:16px 16px 0 0;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden">
        <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(82,183,136,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(82,183,136,.04) 1px,transparent 1px);background-size:20px 20px"></div>
        <div style="font-size:40px;position:relative">${['🏬','💻','🏥','🏘'][idx%4]}</div>
      </div>
      <div class="card-body">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:6px"><div style="font-family:'Syne',sans-serif;font-size:16px;font-weight:700;color:var(--text)">${s.name}</div><span class="badge badge-green">Active</span></div>
        <div style="font-size:12px;color:var(--text3);margin-bottom:4px">📍 ${s.address}</div>
        <div style="font-size:12px;color:var(--text3);margin-bottom:14px">👤 ${s.client}</div>
        <div style="display:flex;gap:14px;padding-top:12px;border-top:0.5px solid var(--border)">
          <div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--text)">${s.guards}</div><div style="font-size:11px;color:var(--text3)">Guards</div></div>
          <div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--text)">${s.checkpoints}</div><div style="font-size:11px;color:var(--text3)">Checkpoints</div></div>
          <div style="text-align:center"><div style="font-size:20px;font-weight:700;color:var(--accent)">${fc(s.monthly)}</div><div style="font-size:11px;color:var(--text3)">Monthly</div></div>
        </div>
      </div>
    </div>`).join('')}
  </div>`;
}
function openAddSite(){openModal('Add new site',`<div class="form-row"><label class="form-label">Site name</label><input id="sn" placeholder="e.g. Airport Terminal"/></div><div class="form-row"><label class="form-label">Address</label><input id="sa" placeholder="Full address"/></div><div class="form-row"><label class="form-label">Client name</label><input id="sc" placeholder="e.g. BIAL Ltd"/></div><div class="form-row-2"><div class="form-row" style="margin-bottom:0"><label class="form-label">Monthly (₹)</label><input id="sm" type="number" placeholder="30000"/></div><div class="form-row" style="margin-bottom:0"><label class="form-label">Checkpoints</label><input id="scp" type="number" placeholder="4"/></div></div>`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="submitSite()">Add</button>`);}
function submitSite(){const n=document.getElementById('sn').value.trim();if(!n){alert('Enter site name.');return;}DEMO.sites.push({id:'S00'+(DEMO.sites.length+1),name:n,address:document.getElementById('sa').value,client:document.getElementById('sc').value,guards:0,monthly:parseInt(document.getElementById('sm').value)||0,checkpoints:parseInt(document.getElementById('scp').value)||0,lat:Math.random()*60+20,lng:Math.random()*60+20});closeModal();go('sites');}

/* shifts.js */
function pgShifts(){
  return `<div class="page-header"><div class="ph-left"><div class="page-title">Shift Schedule</div><div class="page-sub">Week of 30 Mar – 5 Apr 2026</div></div><div class="page-actions"><button class="btn btn-sm" onclick="exportShifts()">Export CSV</button></div></div>
  <div class="card"><div class="card-body" style="overflow-x:auto"><div class="shift-grid">
    <div class="shift-cell shift-hdr" style="text-align:left;padding-left:12px">Guard</div>
    ${DAYS.map(d=>`<div class="shift-cell shift-hdr">${d}</div>`).join('')}
    ${DEMO.guards.map(g=>`<div class="shift-cell shift-name">${g.name.split(' ')[0]}</div>${(DEMO.shifts[g.name]||[]).map(s=>`<div class="shift-cell" style="display:flex;align-items:center;justify-content:center"><div class="sb ${s==='Day'?'sb-day':s==='Night'?'sb-night':s==='Leave'?'sb-leave':'sb-off'}">${s}</div></div>`).join('')}`).join('')}
  </div></div></div>`;
}
function exportShifts(){const r=['Guard,'+DAYS.join(','),...DEMO.guards.map(g=>`${g.name},${(DEMO.shifts[g.name]||[]).join(',')}`)];const b=new Blob([r.join('\n')],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='shifts.csv';a.click();}

/* billing.js */
function pgBilling(){
  const paid=DEMO.invoices.filter(i=>i.status==='paid').reduce((a,b)=>a+b.amount,0),pend=DEMO.invoices.filter(i=>i.status==='pending').reduce((a,b)=>a+b.amount,0),over=DEMO.invoices.filter(i=>i.status==='overdue').reduce((a,b)=>a+b.amount,0);
  return `<div class="page-header"><div class="ph-left"><div class="page-title">Billing & Invoices</div><div class="page-sub">Client payment management</div></div><div class="page-actions"><button class="btn btn-primary" onclick="openCreateInv()">+ Create invoice</button></div></div>
  <div class="stats-grid c3" style="margin-bottom:1.5rem"><div class="stat-card"><div class="stat-card-icon sc-green">💰</div><div class="stat-label">Collected</div><div class="stat-value" style="color:var(--accent);font-size:22px" id="b1">₹0</div></div><div class="stat-card"><div class="stat-card-icon sc-amber">⏳</div><div class="stat-label">Pending</div><div class="stat-value" style="font-size:22px" id="b2">₹0</div></div><div class="stat-card"><div class="stat-card-icon sc-red">⚠️</div><div class="stat-label">Overdue</div><div class="stat-value" style="color:var(--red);font-size:22px" id="b3">₹0</div></div></div>
  <div class="card"><div class="card-body no-pad"><div class="tbl-wrap"><table><thead><tr><th>Invoice</th><th>Client</th><th>Site</th><th>Month</th><th>Amount</th><th>Due</th><th>Status</th><th>Actions</th></tr></thead><tbody>
  ${DEMO.invoices.map(inv=>`<tr><td style="font-family:monospace;font-size:11px;color:var(--text3)">${inv.id}</td><td><strong>${inv.client}</strong></td><td>${inv.site}</td><td>${inv.month}</td><td style="font-family:monospace;font-weight:700;color:var(--accent)">${fc(inv.amount)}</td><td style="font-size:12px">${inv.due}</td><td>${invBadge(inv.status)}</td><td><div style="display:flex;gap:6px">${inv.status!=='paid'?`<button class="btn btn-xs btn-primary" onclick="markPaid('${inv.id}')">Mark paid</button>`:''}<button class="btn btn-xs" onclick="alert('PDF generation requires jsPDF integration.')">PDF</button></div></td></tr>`).join('')}
  </tbody></table></div></div></div>`;
}
function afterBilling(){
  const paid=DEMO.invoices.filter(i=>i.status==='paid').reduce((a,b)=>a+b.amount,0),pend=DEMO.invoices.filter(i=>i.status==='pending').reduce((a,b)=>a+b.amount,0),over=DEMO.invoices.filter(i=>i.status==='overdue').reduce((a,b)=>a+b.amount,0);
  const e1=document.getElementById('b1'),e2=document.getElementById('b2'),e3=document.getElementById('b3');
  if(e1)animateCount(e1,paid,1200,'₹'); if(e2)animateCount(e2,pend,1200,'₹'); if(e3)animateCount(e3,over,1200,'₹');
}
function openCreateInv(){openModal('Create invoice',`<div class="form-row"><label class="form-label">Site / Client</label><select id="iv-s" onchange="let o=this.options[this.selectedIndex];document.getElementById('iv-a').value=o.dataset.amt||''">${DEMO.sites.map(s=>`<option value="${s.name}" data-amt="${s.monthly}">${s.name} — ${s.client}</option>`).join('')}</select></div><div class="form-row"><label class="form-label">Month</label><input id="iv-m" placeholder="e.g. April 2026"/></div><div class="form-row"><label class="form-label">Amount (₹)</label><input id="iv-a" type="number"/></div><div class="form-row"><label class="form-label">Due date</label><input id="iv-d" type="date"/></div>`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="submitInv()">Create</button>`);setTimeout(()=>{const s=document.getElementById('iv-s');if(s){document.getElementById('iv-a').value=s.options[s.selectedIndex]?.dataset.amt||'';}},50);}
function submitInv(){const s=document.getElementById('iv-s');const o=s.options[s.selectedIndex];DEMO.invoices.unshift({id:'INV-0'+(24+DEMO.invoices.length),client:o?.dataset.client||s.value,site:s.value,amount:parseInt(document.getElementById('iv-a').value)||0,month:document.getElementById('iv-m').value,status:'pending',due:document.getElementById('iv-d').value});closeModal();go('billing');}
function markPaid(id){const inv=DEMO.invoices.find(i=>i.id===id);if(inv)inv.status='paid';go('billing');}

/* reports.js */
function pgReports(){
  return `<div class="page-header"><div class="ph-left"><div class="page-title">Reports & Analytics</div><div class="page-sub">Performance overview</div></div><div class="page-actions"><button class="btn btn-sm" onclick="alert('PDF export requires jsPDF integration.')">Export PDF</button></div></div>
  <div class="stats-grid c4" style="margin-bottom:1.5rem">
    <div class="stat-card"><div class="stat-card-icon sc-green">💼</div><div class="stat-label">Total revenue</div><div class="stat-value" id="r1" style="font-size:20px">₹0</div></div>
    <div class="stat-card"><div class="stat-card-icon sc-red">⚠️</div><div class="stat-label">Incidents/month</div><div class="stat-value" id="r2">0</div></div>
    <div class="stat-card"><div class="stat-card-icon sc-blue">📅</div><div class="stat-label">Avg attendance</div><div class="stat-value" id="r3">0<span style="font-size:18px">%</span></div></div>
    <div class="stat-card"><div class="stat-card-icon sc-amber">🗺</div><div class="stat-label">Patrol coverage</div><div class="stat-value" id="r4">0<span style="font-size:18px">%</span></div></div>
  </div>
  <div class="two-col">
    <div class="card"><div class="card-head"><span class="card-title">Guard performance</span></div><div class="card-body">
      ${DEMO.guards.map((g,i)=>{const a=Math.floor(78+Math.random()*22);return`<div style="margin-bottom:14px"><div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">${avHTML(g.name,i,28)}<span style="font-size:13px;font-weight:500;color:var(--text)">${g.name}</span><span style="margin-left:auto;font-size:12px;color:var(--text3)">${a}%</span></div><div class="prog-track"><div class="prog-fill" data-w="${a}" style="width:0;background:${a>88?'var(--accent)':a>75?'var(--amber)':'var(--red)'}"></div></div></div>`;}).join('')}
    </div></div>
    <div class="card"><div class="card-head"><span class="card-title">Revenue by site</span></div><div class="card-body">
      ${DEMO.sites.map((s,i)=>{const pct=Math.round(s.monthly/DEMO.sites.reduce((a,b)=>a+b.monthly,0)*100);const cols=['var(--accent)','var(--blue)','var(--purple)','var(--amber)'];return`<div class="prog-row"><div class="prog-label" style="font-size:12px">${s.name.split(' ')[0]}</div><div class="prog-track"><div class="prog-fill" data-w="${pct}" style="width:0;background:${cols[i%cols.length]}"></div></div><div class="prog-val">${fc(s.monthly)}</div></div>`;}).join('')}
    </div></div>
  </div>`;
}
function afterReports(){
  const rev=DEMO.invoices.reduce((a,b)=>a+b.amount,0);
  const cov=Math.round(DEMO.checkpoints.filter(c=>c.done).length/DEMO.checkpoints.length*100);
  const e1=document.getElementById('r1'),e2=document.getElementById('r2'),e3=document.getElementById('r3'),e4=document.getElementById('r4');
  if(e1)animateCount(e1,rev,1200,'₹'); if(e2)animateCount(e2,DEMO.incidents.length,800); if(e3)animateCount(e3,87,800); if(e4)animateCount(e4,cov,800);
  animateBars();
}

/* documents.js */
function pgDocuments(){
  return `<div class="page-header"><div class="ph-left"><div class="page-title">Documents</div><div class="page-sub">Guard IDs, certificates & files</div></div><div class="page-actions"><button class="btn btn-primary" onclick="openUploadDoc()">+ Upload</button></div></div>
  ${DEMO.guards.map((g,i)=>`<div class="card"><div class="card-head"><div style="display:flex;align-items:center;gap:10px">${avHTML(g.name,i,32)}<span class="card-title">${g.name}</span></div><button class="btn btn-sm" onclick="openUploadFor('${g.id}')">Upload</button></div><div class="card-body"><div class="doc-grid">${g.docs.length?g.docs.map(d=>`<div class="doc-card" onclick="alert('Open file: '+${JSON.stringify(d)})"><div class="doc-ico">${d==='ID'?'🪪':d==='Certificate'?'📜':d==='Medical'?'🏥':'📄'}</div><div class="doc-name">${d}</div><div class="doc-meta">Verified ✓</div></div>`).join(''):`<div style="font-size:12px;color:var(--text3);padding:8px">No documents uploaded</div>`}</div></div></div>`).join('')}`;
}
function openUploadDoc(){openModal('Upload document',`<div class="form-row"><label class="form-label">Guard</label><select id="dg">${DEMO.guards.map(g=>`<option value="${g.id}">${g.name}</option>`).join('')}</select></div><div class="form-row"><label class="form-label">Document type</label><select id="dt"><option>ID</option><option>Certificate</option><option>Medical</option><option>Training</option><option>Other</option></select></div><div class="form-row"><label class="form-label">File</label><input type="file" id="df"/></div><div class="alert alert-info" style="font-size:12px">Files upload to Firebase Storage when configured.</div>`,`<button class="btn" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="submitDoc()">Upload</button>`);}
function openUploadFor(id){openUploadDoc();setTimeout(()=>{const s=document.getElementById('dg');if(s)s.value=id;},50);}
function submitDoc(){const gid=document.getElementById('dg').value,dt=document.getElementById('dt').value,g=DEMO.guards.find(x=>x.id===gid);if(g&&!g.docs.includes(dt))g.docs.push(dt);closeModal();go('documents');}

/* map.js */
function pgMap(){
  const locs=DEMO.guardLocations;
  return `<div class="page-header"><div class="ph-left"><div class="page-title">Live Guard Map</div><div class="page-sub">${locs.length} guards broadcasting</div></div><div class="page-actions"><span class="badge badge-green"><span class="sdot sdot-green"></span>Live tracking</span></div></div>
  <div class="two-col" style="align-items:start">
    <div>
      <div class="map-container">
        <div class="map-grid"></div>
        <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:8px;z-index:0;opacity:.3">
          <svg viewBox="0 0 200 200" width="160" fill="none" stroke="var(--accent)" stroke-width="0.5" opacity=".5">
            <circle cx="100" cy="100" r="90"/><circle cx="100" cy="100" r="60"/><circle cx="100" cy="100" r="30"/>
            <line x1="10" y1="100" x2="190" y2="100"/><line x1="100" y1="10" x2="100" y2="190"/>
          </svg>
        </div>
        ${locs.map((g,i)=>`<div class="map-pin" style="top:${g.top}%;left:${g.left}%" title="${g.guard}">
          <div class="pin-icon" style="background:${['#2D6A4F','#185FA5','#534AB7','#854F0B'][i%4]}">
            <div class="pin-inner">${ini(g.guard)}</div>
          </div>
          <div class="pin-label">${g.guard.split(' ')[0]}</div>
        </div>`).join('')}
        <div class="map-legend">
          <div style="font-size:11px;font-weight:600;color:var(--text2);margin-bottom:6px">GUARD LOCATIONS</div>
          ${locs.map(g=>`<div class="map-legend-row"><span class="sdot sdot-green"></span>${g.guard.split(' ')[0]} — ${g.site}</div>`).join('')}
        </div>
      </div>
      <div class="alert alert-blue" style="margin-top:10px;font-size:12px">🗺 Plug in Google Maps API key + Firestore <code>locations</code> collection for real GPS tracking.</div>
    </div>
    <div class="card" style="margin-bottom:0"><div class="card-head"><span class="card-title">Guard locations</span></div><div class="card-body no-pad">
      ${locs.map((g,i)=>`<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:0.5px solid var(--border)">${avHTML(g.guard,i,36)}<div style="flex:1"><div style="font-weight:500;color:var(--text);font-size:13px">${g.guard}</div><div style="font-size:11px;color:var(--text3)">${g.site}</div></div><span class="badge badge-green"><span class="sdot sdot-green"></span>Live</span></div>`).join('')}
      <div style="padding:12px 16px;font-size:12px;color:var(--text3)">Updates every 30 seconds</div>
    </div></div>
  </div>`;
}

/* my-shift (guard) */
function pgMyShift(){
  const g=DEMO.guards[0];
  return `<div class="page-header"><div class="ph-left"><div class="page-title">My Shift</div><div class="page-sub">${g.name} · ${g.id}</div></div><div class="page-actions"><button class="btn btn-danger" onclick="triggerSOS('${g.name}','${g.site}')">🚨 SOS Alert</button></div></div>
  <div class="alert alert-info" style="margin-bottom:1.5rem">On duty at <strong>${g.site}</strong> — ${g.shift} shift · Check-in: ${DEMO.attendance.find(a=>a.guard===g.name)?.checkIn||'Not checked in'}</div>
  <div class="two-col">
    <div class="card"><div class="card-head"><span class="card-title">Patrol log</span></div><div class="card-body">
      ${[['09:00','Started perimeter check — all clear'],['09:45','Gate 2 inspected, visitor logged'],['10:30','Routine patrol — Block A complete'],['11:15','CCTV check — all feeds normal']].map(([t,m],idx,arr)=>`<div class="tl-item"><div style="position:relative"><div class="tl-dot" style="background:var(--accent)"></div>${idx<arr.length-1?'<div class="tl-line"></div>':''}</div><div><div class="tl-text">${m}</div><div class="tl-time">${t}</div></div></div>`).join('')}
    </div></div>
    <div class="card"><div class="card-head"><span class="card-title">This week</span></div><div class="card-body no-pad">
      ${DAYS.map((d,i)=>{const sh=(DEMO.shifts[g.name]||[])[i];return`<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 16px;border-bottom:0.5px solid var(--border)"><span style="color:var(--text2);font-size:13px">${d}</span><span class="badge ${sh==='Day'?'badge-green':sh==='Night'?'badge-purple':sh==='Leave'?'badge-amber':'badge-gray'}">${sh||'—'}</span></div>`;}).join('')}
    </div></div>
  </div>
  <div style="display:flex;gap:10px;margin-top:8px">
    <button class="btn btn-primary" onclick="go('attendance')">Check in / out</button>
    <button class="btn btn-primary" onclick="go('patrol')">Patrol checkpoints</button>
    <button class="btn" onclick="go('incidents')">Log incident</button>
  </div>`;
}

/* site-report (client) */
function pgSiteReport(){
  const site=DEMO.sites[0],guards=DEMO.guards.filter(g=>g.site===site.name);
  return `<div class="page-header"><div class="ph-left"><div class="page-title">Site Report</div><div class="page-sub">${site.name} · ${site.address}</div></div></div>
  <div class="stats-grid c3" style="margin-bottom:1.5rem"><div class="stat-card"><div class="stat-card-icon sc-green">👮</div><div class="stat-label">Guards assigned</div><div class="stat-value">${guards.length}</div></div><div class="stat-card"><div class="stat-card-icon sc-red">⚠️</div><div class="stat-label">Incidents</div><div class="stat-value">${DEMO.incidents.filter(i=>i.site===site.name).length}</div></div><div class="stat-card"><div class="stat-card-icon sc-amber">💰</div><div class="stat-label">Monthly fee</div><div class="stat-value" style="font-size:20px">${fc(site.monthly)}</div></div></div>
  <div class="card"><div class="card-head"><span class="card-title">Assigned guards</span></div><div class="card-body no-pad">
    ${guards.map((g,i)=>`<div style="display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:0.5px solid var(--border)">${avHTML(g.name,i,36)}<div style="flex:1"><div style="font-weight:500;color:var(--text)">${g.name}</div><div style="font-size:11px;color:var(--text3)">${g.shift} shift</div></div>${stsBadge(g.status)}</div>`).join('')}
  </div></div>`;
}
