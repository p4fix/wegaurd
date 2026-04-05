/* WeGuard Pro — pages/sites.js */
function pgSites(){
  return `
  <div class="page-header">
    <div><div class="page-title">Sites</div><div class="page-sub">All protected locations</div></div>
    <button class="btn btn-primary" onclick="openAddSite()">+ Add site</button>
  </div>
  <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:14px">
    ${DEMO.sites.map(s=>`
      <div class="card" style="margin-bottom:0">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:8px">
          <div style="font-size:15px;font-weight:600">${s.name}</div>
          <span class="badge badge-green">Active</span>
        </div>
        <div style="font-size:12px;color:var(--text-2);margin-bottom:4px">📍 ${s.address}</div>
        <div style="font-size:12px;color:var(--text-3);margin-bottom:14px">👤 ${s.client}</div>
        <div style="display:flex;gap:16px;padding-top:12px;border-top:0.5px solid var(--border)">
          <div style="text-align:center">
            <div style="font-size:20px;font-weight:600">${s.guards}</div>
            <div style="font-size:11px;color:var(--text-2)">Guards</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:20px;font-weight:600">${s.checkpoints}</div>
            <div style="font-size:11px;color:var(--text-2)">Checkpoints</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:20px;font-weight:600">${fmtCurrency(s.monthly)}</div>
            <div style="font-size:11px;color:var(--text-2)">Monthly</div>
          </div>
        </div>
      </div>`).join('')}
  </div>`;
}

function openAddSite(){
  openModal('Add new site', `
    <div class="form-row"><label class="form-label">Site name</label><input id="sn" placeholder="e.g. Airport Terminal"/></div>
    <div class="form-row"><label class="form-label">Address</label><input id="sa" placeholder="Full address"/></div>
    <div class="form-row"><label class="form-label">Client name</label><input id="sc" placeholder="e.g. BIAL Ltd"/></div>
    <div class="form-row-2">
      <div class="form-row" style="margin-bottom:0"><label class="form-label">Monthly fee (₹)</label><input id="sm" type="number" placeholder="30000"/></div>
      <div class="form-row" style="margin-bottom:0"><label class="form-label">Checkpoints</label><input id="scp" type="number" placeholder="4"/></div>
    </div>`,
    `<button class="btn" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="submitAddSite()">Add site</button>`
  );
}

function submitAddSite(){
  const name = document.getElementById('sn').value.trim();
  if(!name){ alert('Enter a site name.'); return; }
  DEMO.sites.push({ id:'S00'+(DEMO.sites.length+1), name, address:document.getElementById('sa').value, client:document.getElementById('sc').value, guards:0, monthly:parseInt(document.getElementById('sm').value)||0, checkpoints:parseInt(document.getElementById('scp').value)||0 });
  closeModal(); go('sites');
}

/* ── SHIFTS ── */
function pgShifts(){
  return `
  <div class="page-header">
    <div><div class="page-title">Shift Schedule</div><div class="page-sub">Week of 30 Mar – 5 Apr 2026</div></div>
    <button class="btn btn-sm" onclick="exportShifts()">Export</button>
  </div>
  <div class="card" style="overflow-x:auto">
    <div class="shift-grid">
      <div class="shift-cell shift-header" style="text-align:left;padding-left:10px">Guard</div>
      ${DAYS.map(d=>`<div class="shift-cell shift-header">${d}</div>`).join('')}
      ${DEMO.guards.map(g=>`
        <div class="shift-cell shift-name-cell">${g.name.split(' ')[0]}</div>
        ${(DEMO.shifts[g.name]||[]).map(s=>`
          <div class="shift-cell" style="display:flex;align-items:center;justify-content:center">
            <div class="shift-block ${s==='Day'?'sb-day':s==='Night'?'sb-night':s==='Leave'?'sb-leave':'sb-off'}">${s}</div>
          </div>`).join('')}`).join('')}
    </div>
  </div>`;
}

function exportShifts(){
  const rows=['Guard,'+DAYS.join(','),...DEMO.guards.map(g=>`${g.name},${(DEMO.shifts[g.name]||[]).join(',')}`)];
  const blob=new Blob([rows.join('\n')],{type:'text/csv'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='shifts.csv'; a.click();
}

/* ── BILLING ── */
function pgBilling(){
  const paid    = DEMO.invoices.filter(i=>i.status==='paid').reduce((a,b)=>a+b.amount,0);
  const pending = DEMO.invoices.filter(i=>i.status==='pending').reduce((a,b)=>a+b.amount,0);
  const overdue = DEMO.invoices.filter(i=>i.status==='overdue').reduce((a,b)=>a+b.amount,0);
  return `
  <div class="page-header">
    <div><div class="page-title">Billing & Invoices</div><div class="page-sub">Manage client payments</div></div>
    <button class="btn btn-primary" onclick="openCreateInvoice()">+ Create invoice</button>
  </div>
  <div class="stats-grid col3">
    <div class="stat-card"><div class="stat-label">Collected</div><div class="stat-value" style="color:var(--accent)">${fmtCurrency(paid)}</div><div class="stat-sub">This month</div></div>
    <div class="stat-card"><div class="stat-label">Pending</div><div class="stat-value">${fmtCurrency(pending)}</div><div class="stat-sub">${DEMO.invoices.filter(i=>i.status==='pending').length} invoices</div></div>
    <div class="stat-card"><div class="stat-label">Overdue</div><div class="stat-value" style="color:#E24B4A">${fmtCurrency(overdue)}</div><div class="stat-sub">${DEMO.invoices.filter(i=>i.status==='overdue').length} invoices</div></div>
  </div>
  <div class="card">
    <div class="table-wrap">
      <table>
        <thead><tr><th>Invoice</th><th>Client</th><th>Site</th><th>Month</th><th>Amount</th><th>Due date</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          ${DEMO.invoices.map(inv=>`<tr>
            <td style="font-family:var(--mono);font-size:11px;color:var(--text-3)">${inv.id}</td>
            <td style="font-weight:500">${inv.client}</td>
            <td style="color:var(--text-2)">${inv.site}</td>
            <td style="color:var(--text-2)">${inv.month}</td>
            <td style="font-family:var(--mono);font-weight:500">${fmtCurrency(inv.amount)}</td>
            <td style="font-size:12px;color:var(--text-2)">${inv.due}</td>
            <td>${invStsBadge(inv.status)}</td>
            <td>
              <div style="display:flex;gap:6px">
                ${inv.status!=='paid'?`<button class="btn btn-xs btn-primary" onclick="markPaid('${inv.id}')">Mark paid</button>`:''}
                <button class="btn btn-xs" onclick="downloadInvoice('${inv.id}')">PDF</button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function openCreateInvoice(){
  openModal('Create invoice',`
    <div class="form-row"><label class="form-label">Client / Site</label>
      <select id="inv-site">${DEMO.sites.map(s=>`<option value="${s.name}" data-client="${s.client}" data-amount="${s.monthly}">${s.name} — ${s.client}</option>`).join('')}</select>
    </div>
    <div class="form-row"><label class="form-label">Month</label><input id="inv-month" placeholder="e.g. April 2026"/></div>
    <div class="form-row"><label class="form-label">Amount (₹)</label><input id="inv-amt" type="number"/></div>
    <div class="form-row"><label class="form-label">Due date</label><input id="inv-due" type="date"/></div>`,
    `<button class="btn" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="submitInvoice()">Create</button>`
  );
  document.getElementById('inv-site').onchange=function(){
    const opt=this.options[this.selectedIndex];
    document.getElementById('inv-amt').value=opt.dataset.amount||'';
  };
  document.getElementById('inv-site').dispatchEvent(new Event('change'));
}

function submitInvoice(){
  const sel=document.getElementById('inv-site');
  const opt=sel.options[sel.selectedIndex];
  const num='INV-0'+(24+DEMO.invoices.length);
  DEMO.invoices.unshift({
    id:num, client:opt.dataset.client, site:sel.value,
    amount:parseInt(document.getElementById('inv-amt').value)||0,
    month:document.getElementById('inv-month').value,
    status:'pending', due:document.getElementById('inv-due').value
  });
  closeModal(); go('billing');
}

function markPaid(id){
  const inv=DEMO.invoices.find(i=>i.id===id);
  if(inv) inv.status='paid';
  go('billing');
}

function downloadInvoice(id){
  alert('In production this would generate and download a PDF invoice for '+id+'.\nIntegrate with jsPDF or a server-side PDF generator.');
}

/* ── REPORTS ── */
function pgReports(){
  return `
  <div class="page-header">
    <div><div class="page-title">Reports</div><div class="page-sub">Performance & analytics</div></div>
    <button class="btn btn-sm" onclick="exportReport()">Export PDF</button>
  </div>
  <div class="stats-grid col4">
    <div class="stat-card"><div class="stat-label">Total revenue</div><div class="stat-value" style="font-size:20px">${fmtCurrency(DEMO.invoices.reduce((a,b)=>a+b.amount,0))}</div></div>
    <div class="stat-card"><div class="stat-label">Incidents/month</div><div class="stat-value">${DEMO.incidents.length}</div></div>
    <div class="stat-card"><div class="stat-label">Avg attendance</div><div class="stat-value">87%</div></div>
    <div class="stat-card"><div class="stat-label">Patrol coverage</div><div class="stat-value">${Math.round(DEMO.checkpoints.filter(c=>c.done).length/DEMO.checkpoints.length*100)}%</div></div>
  </div>
  <div class="two-col">
    <div class="card">
      <div class="card-header"><span class="card-title">Guard performance</span></div>
      ${DEMO.guards.map((g,i)=>{
        const att=Math.floor(78+Math.random()*22), patrol=Math.floor(70+Math.random()*30), inc=Math.floor(Math.random()*3);
        return `<div style="padding:10px 0;border-bottom:0.5px solid var(--border)">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
            ${avatarHTML(g.name,i,'sm')}
            <span style="font-weight:500;font-size:13px">${g.name}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;font-size:11px;color:var(--text-2)">
            <div>Attendance<br><strong style="font-size:14px;color:var(--text);font-family:var(--mono)">${att}%</strong></div>
            <div>Patrol<br><strong style="font-size:14px;color:var(--text);font-family:var(--mono)">${patrol}%</strong></div>
            <div>Incidents<br><strong style="font-size:14px;color:var(--text);font-family:var(--mono)">${inc}</strong></div>
          </div>
        </div>`;
      }).join('')}
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">Revenue by site</span></div>
      ${DEMO.sites.map((s,i)=>{
        const pct=Math.round(s.monthly/DEMO.sites.reduce((a,b)=>a+b.monthly,0)*100);
        const colors=['var(--accent)','#185FA5','#534AB7','#854F0B'];
        return `<div class="report-bar">
          <div style="min-width:110px;font-size:12px;color:var(--text-2)">${s.name.split(' ')[0]}</div>
          <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${colors[i%colors.length]}"></div></div>
          <div class="bar-val">${fmtCurrency(s.monthly)}</div>
        </div>`;
      }).join('')}
      <div style="border-top:0.5px solid var(--border);margin-top:1rem;padding-top:1rem">
        <div class="card-header" style="padding-bottom:10px"><span class="card-title">Incidents by type</span></div>
        ${['Trespassing','Theft Attempt','Suspicious Activity','Equipment Fault','Medical Emergency'].map((t,i)=>{
          const count=DEMO.incidents.filter(inc=>inc.type===t).length;
          return `<div class="report-bar">
            <div style="min-width:120px;font-size:12px;color:var(--text-2)">${t}</div>
            <div class="bar-track"><div class="bar-fill" style="width:${count*33}%;background:#E24B4A"></div></div>
            <div class="bar-val">${count}</div>
          </div>`;
        }).join('')}
      </div>
    </div>
  </div>`;
}

function exportReport(){
  alert('In production, this generates a PDF report.\nIntegrate with jsPDF, Puppeteer, or a server-side renderer.');
}

/* ── DOCUMENTS ── */
function pgDocuments(){
  return `
  <div class="page-header">
    <div><div class="page-title">Documents</div><div class="page-sub">Guard IDs, certificates & files</div></div>
    <button class="btn btn-primary" onclick="openUploadDoc()">+ Upload document</button>
  </div>
  <div style="margin-bottom:1.25rem">
    ${DEMO.guards.map((g,i)=>`
      <div class="card">
        <div class="card-header">
          <div style="display:flex;align-items:center;gap:10px">${avatarHTML(g.name,i,'sm')}<span class="card-title">${g.name}</span></div>
          <button class="btn btn-sm" onclick="openUploadDocFor('${g.id}')">Upload</button>
        </div>
        <div class="doc-grid">
          ${g.docs.length ? g.docs.map(d=>`
            <div class="doc-card" onclick="viewDoc('${d}','${g.name}')">
              <div class="doc-icon">${d==='ID'?'🪪':d==='Certificate'?'📜':d==='Medical'?'🏥':'📄'}</div>
              <div class="doc-name">${d}</div>
              <div class="doc-meta">Verified ✓</div>
            </div>`).join('') :
            `<div style="font-size:12px;color:var(--text-3);padding:8px">No documents yet</div>`}
        </div>
      </div>`).join('')}
  </div>`;
}

function openUploadDoc(){
  openModal('Upload document',`
    <div class="form-row"><label class="form-label">Guard</label>
      <select id="doc-guard">${DEMO.guards.map(g=>`<option value="${g.id}">${g.name}</option>`).join('')}</select>
    </div>
    <div class="form-row"><label class="form-label">Document type</label>
      <select id="doc-type"><option>ID</option><option>Certificate</option><option>Medical</option><option>Training</option><option>Other</option></select>
    </div>
    <div class="form-row"><label class="form-label">File</label><input type="file" id="doc-file"/></div>
    <div class="alert alert-info" style="font-size:12px">With Firebase Storage configured, files will be uploaded and stored securely. In demo mode, only metadata is saved.</div>`,
    `<button class="btn" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="submitDoc()">Upload</button>`
  );
}

function openUploadDocFor(guardId){
  openUploadDoc();
  setTimeout(()=>{ const sel=document.getElementById('doc-guard'); if(sel) sel.value=guardId; },50);
}

function submitDoc(){
  const guardId=document.getElementById('doc-guard').value;
  const docType=document.getElementById('doc-type').value;
  const g=DEMO.guards.find(x=>x.id===guardId);
  if(g && !g.docs.includes(docType)) g.docs.push(docType);
  closeModal(); go('documents');
}

function viewDoc(type, guardName){
  alert(`Document: ${type}\nGuard: ${guardName}\n\nIn production, this would open the stored file from Firebase Storage.`);
}

/* ── MAP ── */
function pgMap(){
  const onDuty=DEMO.guardLocations;
  return `
  <div class="page-header">
    <div><div class="page-title">Live Guard Map</div><div class="page-sub">${onDuty.length} guards broadcasting location</div></div>
    <div class="header-actions">
      <span class="badge badge-green"><span class="status-dot dot-green"></span>Live</span>
    </div>
  </div>
  <div class="two-col" style="align-items:start">
    <div>
      <div class="map-container">
        <div style="font-size:13px;color:var(--text-2);text-align:center;z-index:1">
          <div style="font-size:32px;margin-bottom:8px">🗺️</div>
          <strong>Interactive map</strong><br>
          <span style="font-size:12px">Integrate Google Maps or Mapbox API<br>with your Firebase config to show real GPS locations</span>
        </div>
        <div class="map-pins">
          ${onDuty.map(g=>`
            <div class="map-pin" style="left:${g.lng}%;top:${g.lat}%" title="${g.guard}">
              <div class="pin-dot" style="background:${g.status==='on-duty'?'#40916C':'#E24B4A'}"></div>
              <div class="pin-label">${g.guard.split(' ')[0]}</div>
            </div>`).join('')}
        </div>
        <div class="map-legend">
          <div class="legend-row"><div class="pin-dot" style="background:#40916C;display:inline-block;width:10px;height:10px;border-radius:50%"></div> On duty</div>
          <div class="legend-row"><div class="pin-dot" style="background:#E24B4A;display:inline-block;width:10px;height:10px;border-radius:50%"></div> Off duty</div>
        </div>
      </div>
      <div class="alert alert-info" style="font-size:12px;margin-top:8px">
        To enable real GPS tracking: add Google Maps JS API key to index.html, then use the <code>navigator.geolocation</code> API to write guard positions to Firestore in real-time.
      </div>
    </div>
    <div class="card" style="margin-bottom:0">
      <div class="card-header"><span class="card-title">Guard locations</span></div>
      ${onDuty.map((g,i)=>`
        <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:0.5px solid var(--border)">
          ${avatarHTML(g.guard,i,'sm')}
          <div style="flex:1">
            <div style="font-weight:500;font-size:13px">${g.guard}</div>
            <div style="font-size:11px;color:var(--text-2)">${g.site}</div>
          </div>
          <span class="badge badge-green"><span class="status-dot dot-green"></span>Live</span>
        </div>`).join('')}
      <div style="padding-top:12px;font-size:12px;color:var(--text-3)">Locations update every 30 seconds</div>
    </div>
  </div>`;
}

/* ── GUARD MY-SHIFT ── */
function pgMyShift(){
  const g   = DEMO.guards[0];
  const att = DEMO.attendance.find(a=>a.guard===g.name);
  return `
  <div class="page-header">
    <div><div class="page-title">My Shift</div><div class="page-sub">${g.name} · ${g.id}</div></div>
    <button class="btn btn-danger" onclick="triggerSOS('${g.name}','${g.site}')">🚨 SOS</button>
  </div>
  <div class="alert alert-info">On duty at <strong>${g.site}</strong> — ${g.shift} shift · Check-in: ${att?.checkIn||'Not checked in'}</div>
  <div class="two-col">
    <div class="card">
      <div class="card-header"><span class="card-title">Patrol log</span></div>
      ${[['09:00','Started perimeter check'],['09:45','Gate 2 inspected'],['10:30','Routine patrol — Block A'],['11:15','CCTV check — all feeds normal']].map(([t,m],idx,arr)=>`
        <div class="tl-item">
          <div style="position:relative">
            <div class="tl-dot" style="background:var(--accent)"></div>
            ${idx<arr.length-1?'<div class="tl-line"></div>':''}
          </div>
          <div><div class="tl-text">${m}</div><div class="tl-time">${t}</div></div>
        </div>`).join('')}
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">This week</span></div>
      ${DAYS.map((d,i)=>{const sh=(DEMO.shifts[g.name]||[])[i];return `
        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:0.5px solid var(--border);font-size:13px">
          <span style="color:var(--text-2)">${d}</span>
          <span class="badge ${sh==='Day'?'badge-teal':sh==='Off'?'badge-gray':sh==='Night'?'badge-purple':'badge-amber'}">${sh||'—'}</span>
        </div>`}).join('')}
    </div>
  </div>
  <div style="display:flex;gap:10px;margin-top:8px">
    <button class="btn btn-primary" onclick="go('attendance')">Check in / out</button>
    <button class="btn btn-primary" onclick="go('patrol')">Patrol checkpoints</button>
    <button class="btn" onclick="go('incidents')">Log incident</button>
  </div>`;
}

/* ── CLIENT SITE REPORT ── */
function pgSiteReport(){
  const site  = DEMO.sites[0];
  const guards = DEMO.guards.filter(g=>g.site===site.name);
  return `
  <div class="page-header">
    <div><div class="page-title">Site Report</div><div class="page-sub">${site.name} · ${site.address}</div></div>
  </div>
  <div class="stats-grid col3">
    <div class="stat-card"><div class="stat-label">Guards assigned</div><div class="stat-value">${guards.length}</div></div>
    <div class="stat-card"><div class="stat-label">Incidents this month</div><div class="stat-value">${DEMO.incidents.filter(i=>i.site===site.name).length}</div></div>
    <div class="stat-card"><div class="stat-label">Monthly fee</div><div class="stat-value" style="font-size:20px">${fmtCurrency(site.monthly)}</div></div>
  </div>
  <div class="card">
    <div class="card-header"><span class="card-title">Your guards</span></div>
    ${guards.map((g,i)=>`
      <div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:0.5px solid var(--border)">
        ${avatarHTML(g.name,i,'sm')}
        <div style="flex:1"><div style="font-weight:500;font-size:13px">${g.name}</div><div style="font-size:11px;color:var(--text-2)">${g.shift} shift</div></div>
        ${stsBadge(g.status)}
      </div>`).join('')}
  </div>`;
}
