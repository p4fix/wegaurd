/* WeGuard Pro — pages/attendance.js */
function pgAttendance(){
  const present = DEMO.attendance.filter(a=>a.status==='present').length;
  const absent  = DEMO.attendance.filter(a=>a.status==='absent').length;
  const onLeave = DEMO.attendance.filter(a=>a.status==='leave').length;

  const isGuard = S.role === 'guard';
  const myAtt   = isGuard ? DEMO.attendance.filter(a=>a.guard===S.user?.name) : DEMO.attendance;

  return `
  <div class="page-header">
    <div><div class="page-title">${isGuard?'My Attendance':'Attendance'}</div><div class="page-sub">${nowDate()}</div></div>
    ${isGuard ? `
    <div class="header-actions">
      <button class="btn btn-primary" onclick="checkIn()">Check in</button>
      <button class="btn" onclick="checkOut()">Check out</button>
    </div>` : `
    <div class="header-actions">
      <button class="btn btn-sm" onclick="exportAttendance()">Export CSV</button>
    </div>`}
  </div>

  ${!isGuard ? `
  <div class="stats-grid col3">
    <div class="stat-card"><div class="stat-label">Present</div><div class="stat-value" style="color:var(--accent)">${present}</div></div>
    <div class="stat-card"><div class="stat-label">Absent</div><div class="stat-value" style="color:#E24B4A">${absent}</div></div>
    <div class="stat-card"><div class="stat-label">On leave</div><div class="stat-value">${onLeave}</div></div>
  </div>` : ''}

  <div class="card">
    <div class="card-header"><span class="card-title">Today's records</span></div>
    <div class="table-wrap">
      <table>
        <thead><tr><th>Guard</th><th>Site</th><th>Check in</th><th>Check out</th><th>Status</th>${!isGuard?'<th>Action</th>':''}</tr></thead>
        <tbody>
          ${myAtt.map(a=>`<tr>
            <td style="font-weight:500">${a.guard}</td>
            <td style="color:var(--text-2)">${a.site}</td>
            <td style="font-family:var(--mono);font-size:12px">${a.checkIn || '—'}</td>
            <td style="font-family:var(--mono);font-size:12px">${a.checkOut || '—'}</td>
            <td>${attStsBadge(a.status)}</td>
            ${!isGuard ? `<td>
              <button class="btn btn-xs" onclick="markAttendance('${a.id}','present')">Mark present</button>
            </td>` : ''}
          </tr>`).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <div class="card">
    <div class="card-header"><span class="card-title">Monthly summary — March 2026</span></div>
    <div style="display:flex;flex-direction:column;gap:10px">
      ${DEMO.guards.map((g,i)=>{
        const pct = Math.floor(70 + Math.random()*30);
        return `
        <div class="report-bar">
          ${avatarHTML(g.name,i,'sm')}
          <div style="min-width:120px;font-size:13px">${g.name.split(' ')[0]}</div>
          <div class="bar-track"><div class="bar-fill" style="width:${pct}%;background:${pct>85?'var(--accent)':pct>70?'#EF9F27':'#E24B4A'}"></div></div>
          <div class="bar-val">${pct}%</div>
        </div>`;
      }).join('')}
    </div>
  </div>`;
}

function checkIn(){
  const t = nowTime();
  const g = DEMO.attendance.find(a=>a.guard===S.user?.name);
  if(g){ g.checkIn=t; g.status='present'; }
  else {
    DEMO.attendance.push({ id:'A'+Date.now(), guard:S.user?.name||'Guard', site:'Mall Complex', date:new Date().toISOString().split('T')[0], checkIn:t, checkOut:null, status:'present' });
  }
  alert(`Checked in at ${t}`);
  go('attendance');
}

function checkOut(){
  const t = nowTime();
  const g = DEMO.attendance.find(a=>a.guard===S.user?.name);
  if(g){ g.checkOut=t; }
  alert(`Checked out at ${t}`);
  go('attendance');
}

function markAttendance(id, status){
  const a = DEMO.attendance.find(x=>x.id===id);
  if(a){ a.status=status; if(!a.checkIn) a.checkIn=nowTime(); }
  go('attendance');
}

function exportAttendance(){
  const rows = ['Guard,Site,Date,Check In,Check Out,Status', ...DEMO.attendance.map(a=>`${a.guard},${a.site},${a.date},${a.checkIn||''},${a.checkOut||''},${a.status}`)];
  const blob  = new Blob([rows.join('\n')], {type:'text/csv'});
  const a     = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download='attendance.csv'; a.click();
}
