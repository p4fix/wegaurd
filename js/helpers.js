/* WeGuard Pro — helpers.js */

function ini(name){ return name.split(' ').map(n=>n[0]).join('').toUpperCase(); }
function avc(i){ return AVATAR_COLORS[i % AVATAR_COLORS.length]; }
function fmtCurrency(n){ return '₹'+Number(n).toLocaleString('en-IN'); }
function fmtDate(d){ return new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}); }
function nowTime(){ return new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:false}); }
function nowDate(){ return new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'}); }

function sevBadge(s){
  const m={high:'badge-red',medium:'badge-amber',low:'badge-gray'};
  const l={high:'High',medium:'Medium',low:'Low'};
  return `<span class="badge ${m[s]||'badge-gray'}">${l[s]||s}</span>`;
}
function stsBadge(s){
  if(s==='on-duty')  return '<span class="badge badge-green"><span class="status-dot dot-green"></span>On duty</span>';
  if(s==='off-duty') return '<span class="badge badge-gray"><span class="status-dot dot-gray"></span>Off duty</span>';
  return '<span class="badge badge-amber"><span class="status-dot dot-amber"></span>On leave</span>';
}
function incStsBadge(s){ return s==='open'?'<span class="badge badge-amber">Open</span>':'<span class="badge badge-green">Resolved</span>'; }
function invStsBadge(s){
  if(s==='paid')    return '<span class="badge badge-green">Paid</span>';
  if(s==='overdue') return '<span class="badge badge-red">Overdue</span>';
  return '<span class="badge badge-amber">Pending</span>';
}
function attStsBadge(s){
  if(s==='present') return '<span class="badge badge-green">Present</span>';
  if(s==='absent')  return '<span class="badge badge-red">Absent</span>';
  return '<span class="badge badge-amber">On leave</span>';
}

function avatarHTML(name, i, size='sm'){
  const [bg,fg] = avc(i);
  return `<div class="avatar ${size}" style="background:${bg};color:${fg}">${ini(name)}</div>`;
}

function fillDemo(email, pass){
  document.getElementById('l-email').value = email;
  document.getElementById('l-pass').value  = pass;
}
