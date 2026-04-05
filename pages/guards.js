/* WeGuard Pro — pages/guards.js */
function pgGuards(){
  return `
  <div class="page-header">
    <div><div class="page-title">Guards</div><div class="page-sub">Manage security staff</div></div>
    <div class="header-actions">
      <button class="btn btn-primary" onclick="openAddGuard()">+ Add guard</button>
    </div>
  </div>

  <div class="stats-grid col3" style="margin-bottom:1.25rem">
    <div class="stat-card"><div class="stat-label">Total guards</div><div class="stat-value">${DEMO.guards.length}</div></div>
    <div class="stat-card"><div class="stat-label">On duty now</div><div class="stat-value" style="color:var(--accent)">${DEMO.guards.filter(g=>g.status==='on-duty').length}</div></div>
    <div class="stat-card"><div class="stat-label">On leave</div><div class="stat-value">${DEMO.guards.filter(g=>g.status==='on-leave').length}</div></div>
  </div>

  <div class="card">
    <div class="table-wrap">
      <table>
        <thead><tr><th>Guard</th><th>Assigned site</th><th>Shift</th><th>Status</th><th>Phone</th><th>Joined</th><th>Actions</th></tr></thead>
        <tbody>
          ${DEMO.guards.map((g,i)=>`<tr>
            <td>
              <div class="guard-row">
                ${avatarHTML(g.name,i,'sm')}
                <div><div class="guard-name">${g.name}</div><div class="guard-id">${g.id}</div></div>
              </div>
            </td>
            <td style="color:var(--text-2)">${g.site}</td>
            <td><span class="badge ${g.shift==='Night'?'badge-purple':'badge-gray'}">${g.shift}</span></td>
            <td>${stsBadge(g.status)}</td>
            <td style="font-size:12px;color:var(--text-2)">${g.phone}</td>
            <td style="font-size:12px;color:var(--text-2)">${g.joinDate}</td>
            <td>
              <div style="display:flex;gap:6px">
                <button class="btn btn-sm" onclick="viewGuard('${g.id}')">View</button>
                <button class="btn btn-sm btn-danger" onclick="removeGuard('${g.id}')">Remove</button>
              </div>
            </td>
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>`;
}

function openAddGuard(){
  openModal('Add new guard', `
    <div class="form-row-2">
      <div class="form-row" style="margin-bottom:0"><label class="form-label">Full name</label><input id="gn" placeholder="e.g. Arjun Mehta"/></div>
      <div class="form-row" style="margin-bottom:0"><label class="form-label">Employee ID</label><input id="gi" placeholder="G007"/></div>
    </div>
    <div class="form-row"><label class="form-label">Phone</label><input id="gp" placeholder="+91 98765 XXXXX"/></div>
    <div class="form-row-2">
      <div class="form-row" style="margin-bottom:0">
        <label class="form-label">Assign to site</label>
        <select id="gs">${DEMO.sites.map(s=>`<option>${s.name}</option>`).join('')}</select>
      </div>
      <div class="form-row" style="margin-bottom:0">
        <label class="form-label">Shift</label>
        <select id="gsh"><option>Day</option><option>Night</option></select>
      </div>
    </div>
    <div class="form-row"><label class="form-label">Join date</label><input type="date" id="gd" value="${new Date().toISOString().split('T')[0]}"/></div>`,
    `<button class="btn" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="submitAddGuard()">Add guard</button>`
  );
}

function submitAddGuard(){
  const name = document.getElementById('gn').value.trim();
  if(!name){ alert('Enter a name.'); return; }
  const id = document.getElementById('gi').value.trim() || 'G00'+(DEMO.guards.length+1);
  DEMO.guards.push({
    id, name, site: document.getElementById('gs').value,
    status:'off-duty', shift: document.getElementById('gsh').value,
    phone: document.getElementById('gp').value,
    joinDate: document.getElementById('gd').value, docs:[]
  });
  DEMO.shifts[name] = ['Day','Day','Day','Day','Day','Off','Off'];
  closeModal(); go('guards');
}

function viewGuard(id){
  const g = DEMO.guards.find(x=>x.id===id);
  if(!g) return;
  const i = DEMO.guards.indexOf(g);
  openModal(g.name, `
    <div style="display:flex;align-items:center;gap:16px;margin-bottom:1.25rem">
      ${avatarHTML(g.name,i,'lg')}
      <div>
        <div style="font-size:18px;font-weight:600">${g.name}</div>
        <div style="color:var(--text-2);font-size:13px">${g.id} · ${g.site}</div>
        <div style="margin-top:6px">${stsBadge(g.status)}</div>
      </div>
    </div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:1rem">
      <div><div style="font-size:11px;color:var(--text-2);margin-bottom:3px">Phone</div><div style="font-size:13px">${g.phone}</div></div>
      <div><div style="font-size:11px;color:var(--text-2);margin-bottom:3px">Shift</div><div style="font-size:13px">${g.shift}</div></div>
      <div><div style="font-size:11px;color:var(--text-2);margin-bottom:3px">Join date</div><div style="font-size:13px">${g.joinDate}</div></div>
      <div><div style="font-size:11px;color:var(--text-2);margin-bottom:3px">Documents</div><div style="font-size:13px">${g.docs.length} uploaded</div></div>
    </div>
    <div style="font-size:12px;font-weight:500;color:var(--text-2);margin-bottom:8px">DOCUMENTS</div>
    <div style="display:flex;flex-wrap:wrap;gap:6px">
      ${g.docs.map(d=>`<span class="badge badge-teal">${d}</span>`).join('') || '<span style="font-size:12px;color:var(--text-3)">No documents uploaded</span>'}
    </div>`,
    `<button class="btn" onclick="closeModal()">Close</button>
     <button class="btn btn-primary" onclick="closeModal();go('documents')">Manage docs</button>`
  );
}

function removeGuard(id){
  if(!confirm('Remove this guard?')) return;
  DEMO.guards = DEMO.guards.filter(g=>g.id!==id);
  go('guards');
}
