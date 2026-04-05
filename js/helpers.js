/* ═══ helpers.js ═══ */
function ini(n){ return n.split(' ').map(x=>x[0]).join('').toUpperCase(); }
function avc(i){ return AV_COLORS[i%AV_COLORS.length]; }
function fc(n){ return '₹'+Number(n).toLocaleString('en-IN'); }
function nowTime(){ return new Date().toLocaleTimeString('en-IN',{hour:'2-digit',minute:'2-digit',hour12:false}); }
function nowDate(){ return new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'}); }
function fillDemo(e,p){ document.getElementById('l-email').value=e; document.getElementById('l-pass').value=p; }

function avHTML(name,i,size=36){
  const [bg,fg]=avc(i);
  return `<div class="g-avatar" style="width:${size}px;height:${size}px;background:${bg};color:${fg};font-size:${Math.floor(size*.35)}px">${ini(name)}</div>`;
}

function sevBadge(s){
  return s==='high'?'<span class="badge badge-red">High</span>':s==='medium'?'<span class="badge badge-amber">Medium</span>':'<span class="badge badge-gray">Low</span>';
}
function stsBadge(s){
  if(s==='on-duty')  return '<span class="badge badge-green"><span class="sdot sdot-green"></span>On duty</span>';
  if(s==='off-duty') return '<span class="badge badge-gray"><span class="sdot sdot-gray"></span>Off duty</span>';
  return '<span class="badge badge-amber"><span class="sdot sdot-amber"></span>On leave</span>';
}
function incBadge(s){ return s==='open'?'<span class="badge badge-amber">Open</span>':'<span class="badge badge-green">Resolved</span>'; }
function invBadge(s){
  if(s==='paid')    return '<span class="badge badge-green">Paid</span>';
  if(s==='overdue') return '<span class="badge badge-red">Overdue</span>';
  return '<span class="badge badge-amber">Pending</span>';
}
function attBadge(s){
  if(s==='present') return '<span class="badge badge-green">Present</span>';
  if(s==='absent')  return '<span class="badge badge-red">Absent</span>';
  return '<span class="badge badge-amber">On leave</span>';
}

// Animated counter
function animateCount(el, target, duration=1200, prefix='', suffix=''){
  const start = performance.now();
  const update = now => {
    const p = Math.min((now-start)/duration, 1);
    const ease = 1-Math.pow(1-p,3);
    el.textContent = prefix + Math.round(target*ease).toLocaleString() + suffix;
    if(p<1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

// Animate bars after render
function animateBars(){
  setTimeout(()=>{
    document.querySelectorAll('.prog-fill[data-w]').forEach(el=>{
      el.style.width = el.dataset.w+'%';
    });
  }, 100);
}
