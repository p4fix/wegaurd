/* ═══ guards.js ═══ */
function pgGuards(){
  return `
  <div class="page-header">
    <div class="ph-left"><div class="page-title">Guards</div><div class="page-sub">Manage security personnel</div></div>
    <div class="page-actions"><button class="btn btn-primary" onclick="openAddGuard()">+ Add guard</button></div>
  </div>
  <div class="stats-grid c3" style="margin-bottom:1.5rem">
    <div class="stat-card"><div class="stat-card-icon sc-green">👥</div><div class="stat-label">Total</div><div class="stat-value">${DEMO.guards.length}</div></div>
    <div class="stat-card"><div class="stat-card-icon sc-green">✅</div><div class="stat-label">On duty</div><div class="stat-value" style="color:var(--accent)">${DEMO.guards.filter(g=>g.status==='on-duty').length}</div></div>
    <div class="stat-card"><div class="stat-card-icon sc-amber">🏖</div><div class="stat-label">On leave</div><div class="stat-value">${DEMO.guards.filter(g=>g.status==='on-leave').length}</div></div>
  </div>
  <div class="card">
    <div class="card-body no-pad">
      <div class="tbl-wrap">
        <table>
          <thead><tr><th>Guard</th><th>Site</th><th>Shift</th><th>Status</th><th>Phone</th><th>Joined</th><th>Actions</th></tr></thead>
          <tbody>
            ${DEMO.guards.map((g,i)=>`<tr>
              <td><div class="guard-row">${avHTML(g.name,i,36)}<div><div class="g-name">${g.name}</div><div class="g-id">${g.id}</div></div></div></td>
              <td>${g.site}</td>
              <td><span class="badge ${g.shift==='Night'?'badge-purple':'badge-gray'}">${g.shift}</span></td>
              <td>${stsBadge(g.status)}</td>
              <td style="font-size:12px">${g.phone}</td>
              <td style="font-size:12px">${g.joinDate}</td>
              <td><div style="display:flex;gap:6px">
                <button class="btn btn-sm" onclick="viewGuard('${g.id}')">View</button>
                <button class="btn btn-sm btn-danger" onclick="removeGuard('${g.id}')">Remove</button>
              </div></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  </div>`;
}

function openAddGuard(){
  openModal('Add new guard',`
    <div class="form-row-2">
      <div class="form-row" style="margin-bottom:0"><label class="form-label">Full name</label><input id="gn" placeholder="e.g. Arjun Mehta"/></div>
      <div class="form-row" style="margin-bottom:0"><label class="form-label">Employee ID</label><input id="gi" placeholder="G007"/></div>
    </div>
    <div class="form-row"><label class="form-label">Phone</label><input id="gp" placeholder="+91 98765 XXXXX"/></div>
    <div class="form-row-2">
      <div class="form-row" style="margin-bottom:0"><label class="form-label">Assign to site</label><select id="gs">${DEMO.sites.map(s=>`<option>${s.name}</option>`).join('')}</select></div>
      <div class="form-row" style="margin-bottom:0"><label class="form-label">Shift</label><select id="gsh"><option>Day</option><option>Night</option></select></div>
    </div>
    <div class="form-row"><label class="form-label">Join date</label><input type="date" id="gd" value="${new Date().toISOString().split('T')[0]}"/></div>`,
    `<button class="btn" onclick="closeModal()">Cancel</button><button class="btn btn-primary" onclick="submitAddGuard()">Add guard</button>`
  );
}
function submitAddGuard(){
  const name=document.getElementById('gn').value.trim();
  if(!name){alert('Enter a name.');return;}
  DEMO.guards.push({id:document.getElementById('gi').value.trim()||'G00'+(DEMO.guards.length+1),name,site:document.getElementById('gs').value,status:'off-duty',shift:document.getElementById('gsh').value,phone:document.getElementById('gp').value,joinDate:document.getElementById('gd').value,docs:[]});
  DEMO.shifts[name]=['Day','Day','Day','Day','Day','Off','Off'];
  closeModal(); go('guards');
}
function viewGuard(id){
  const g=DEMO.guards.find(x=>x.id===id); if(!g) return;
  const i=DEMO.guards.indexOf(g);
  openModal(g.name,`
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:1.5rem;padding:1rem;background:var(--bg2);border-radius:12px">
      ${avHTML(g.name,i,52)}
      <div><div style="font-family:'Syne',sans-serif;font-size:20px;font-weight:700;color:var(--text)">${g.name}</div><div style="color:var(--text3);font-size:13px">${g.id} · ${g.site}</div><div style="margin-top:8px">${stsBadge(g.status)}</div></div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:1rem">
      ${[['📞 Phone',g.phone],['⏰ Shift',g.shift],['📅 Joined',g.joinDate],['📄 Docs',g.docs.length+' uploaded']].map(([l,v])=>`<div style="background:var(--bg2);padding:12px;border-radius:10px"><div style="font-size:11px;color:var(--text3);margin-bottom:4px">${l}</div><div style="font-size:13px;font-weight:500;color:var(--text)">${v}</div></div>`).join('')}
    </div>
    <div style="display:flex;flex-wrap:wrap;gap:6px">${g.docs.map(d=>`<span class="badge badge-green">${d}</span>`).join('')||'<span style="font-size:12px;color:var(--text3)">No documents</span>'}</div>`,
    `<button class="btn" onclick="closeModal()">Close</button><button class="btn btn-primary" onclick="closeModal();go('documents')">Manage docs</button>`
  );
}
function removeGuard(id){
  if(!confirm('Remove this guard?')) return;
  DEMO.guards=DEMO.guards.filter(g=>g.id!==id); go('guards');
}
