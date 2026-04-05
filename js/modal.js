/* WeGuard Pro — modal.js */
function openModal(title, bodyHTML, footHTML, wide){
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML    = bodyHTML;
  document.getElementById('modal-foot').innerHTML    = footHTML||'';
  const box = document.getElementById('modal-box');
  box.className = 'modal' + (wide?' wide':'');
  document.getElementById('modal-wrap').classList.add('open');
}
function closeModal(){ document.getElementById('modal-wrap').classList.remove('open'); }
function maybeCloseModal(e){ if(e.target===document.getElementById('modal-wrap')) closeModal(); }
