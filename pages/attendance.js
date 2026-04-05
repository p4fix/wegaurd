/* attendance.js */
function pgAttendance(){
  const p=DEMO.attendance.filter(a=>a.status==='present').length,ab=DEMO.attendance.filter(a=>a.status==='absent').length,lv=DEMO.attendance.filter(a=>a.status==='leave').length;
  const isG=S.role==='guard';
  return `<div class="page-header"><div class="ph-left"><div class="page-title">${isG?'My Attendance':'Attendance'}</div><div class="page-sub">${nowDate()}</div></div><div class="page-actions">${isG?`<button class="btn btn-primary" onclick="checkIn()">Check in</button><button class="btn" onclick="checkOut()">Check out</button>`:`<button class="btn btn-sm" onclick="exportCSV()">Export CSV</button>`}</div></div>
  ${!isG?`<div class="stats-grid c3" style="margin-bottom:1.5rem"><div class="stat-card"><div class="stat-card-icon sc-green">✅</div><div class="stat-label">Present</div><div class="stat-value" style="color:var(--accent)" id="att1">0</div></div><div class="stat-card"><div class="stat-card-icon sc-red">❌</div><div class="stat-label">Absent</div><div class="stat-value" style="color:var(--red)" id="att2">0</div></div><div class="stat-card"><div class="stat-card-icon sc-amber">🏖</div><div class="stat-label">On leave</div><div class="stat-value" id="att3">0</div></div></div>`:''}
  <div class="card"><div class="card-body no-pad"><div class="tbl-wrap"><table><thead><tr><th>Guard</th><th>Site</th><th>Check in</th><th>Check out</th><th>Status</th>${!isG?'<th>Action</th>':''}</tr></thead><tbody>
  ${DEMO.attendance.map(a=>`<tr><td><strong>${a.guard}</strong></td><td>${a.site}</td><td style="font-family:monospace;font-size:12px;color:var(--accent)">${a.checkIn||'—'}</td><td style="font-family:monospace;font-size:12px;color:var(--text3)">${a.checkOut||'—'}</td><td>${attBadge(a.status)}</td>${!isG?`<td><button class="btn btn-xs" onclick="markPresent('${a.id}')">Mark present</button></td>`:''}</tr>`).join('')}
  </tbody></table></div></div></div>`;
}
function afterAttendance(){
  const p=DEMO.attendance.filter(a=>a.status==='present').length,ab=DEMO.attendance.filter(a=>a.status==='absent').length,lv=DEMO.attendance.filter(a=>a.status==='leave').length;
  const e1=document.getElementById('att1'),e2=document.getElementById('att2'),e3=document.getElementById('att3');
  if(e1)animateCount(e1,p,800); if(e2)animateCount(e2,ab,800); if(e3)animateCount(e3,lv,800);
}
function checkIn(){const t=nowTime();const a=DEMO.attendance.find(x=>x.guard===S.user?.name);if(a){a.checkIn=t;a.status='present';}alert('Checked in at '+t);go('attendance');}
function checkOut(){const t=nowTime();const a=DEMO.attendance.find(x=>x.guard===S.user?.name);if(a)a.checkOut=t;alert('Checked out at '+t);go('attendance');}
function markPresent(id){const a=DEMO.attendance.find(x=>x.id===id);if(a){a.status='present';if(!a.checkIn)a.checkIn=nowTime();}go('attendance');}
function exportCSV(){const r=['Guard,Site,Date,Check In,Check Out,Status',...DEMO.attendance.map(a=>`${a.guard},${a.site},${a.date},${a.checkIn||''},${a.checkOut||''},${a.status}`)];const b=new Blob([r.join('\n')],{type:'text/csv'});const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='attendance.csv';a.click();}
