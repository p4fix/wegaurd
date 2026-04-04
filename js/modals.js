/* =====================
   WeGuard — modals.js
   Add guard / Add site
   ===================== */

function openModal(title, bodyHTML, footHTML) {
  document.getElementById('m-title').textContent = title;
  document.getElementById('m-body').innerHTML    = bodyHTML;
  document.getElementById('m-foot').innerHTML    = footHTML;
  document.getElementById('modal-wrap').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-wrap').classList.remove('open');
}

function maybeClose(e) {
  if (e.target === document.getElementById('modal-wrap')) closeModal();
}

/* ---- Add Guard ---- */
function openAddGuard() {
  const siteOptions = S.sites.map(s => `<option>${s.name}</option>`).join('');

  openModal(
    'Add new guard',
    `<div class="form-row">
       <label class="form-label">Full name</label>
       <input type="text" id="m-gname" placeholder="e.g. Arjun Mehta" />
     </div>
     <div class="form-row">
       <label class="form-label">Assign to site</label>
       <select id="m-gsite">${siteOptions}</select>
     </div>
     <div class="form-row">
       <label class="form-label">Shift</label>
       <select id="m-gshift"><option>Day</option><option>Night</option></select>
     </div>
     <div class="form-row">
       <label class="form-label">Phone</label>
       <input type="text" id="m-gphone" placeholder="+91 98765 XXXXX" />
     </div>`,
    `<button class="btn" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="submitGuard()">Add guard</button>`
  );
}

function submitGuard() {
  const name = document.getElementById('m-gname').value.trim();
  if (!name) { alert('Please enter a name.'); return; }

  const newId = 'G00' + (S.guards.length + 1);
  S.guards.push({
    id:     newId,
    name,
    site:   document.getElementById('m-gsite').value,
    status: 'off-duty',
    shift:  document.getElementById('m-gshift').value,
    phone:  document.getElementById('m-gphone').value,
  });
  S.shifts[name] = ['Day', 'Day', 'Day', 'Day', 'Day', 'Off', 'Off'];

  closeModal();
  go(S.page); // re-render current page
}

/* ---- Add Site ---- */
function openAddSite() {
  openModal(
    'Add new site',
    `<div class="form-row">
       <label class="form-label">Site name</label>
       <input type="text" id="m-sname" placeholder="e.g. Airport Terminal" />
     </div>
     <div class="form-row">
       <label class="form-label">Address</label>
       <input type="text" id="m-saddr" placeholder="Full address" />
     </div>
     <div class="form-row">
       <label class="form-label">Client name</label>
       <input type="text" id="m-sclient" placeholder="e.g. BIAL Ltd" />
     </div>`,
    `<button class="btn" onclick="closeModal()">Cancel</button>
     <button class="btn btn-primary" onclick="submitSite()">Add site</button>`
  );
}

function submitSite() {
  const name = document.getElementById('m-sname').value.trim();
  if (!name) { alert('Please enter a site name.'); return; }

  S.sites.push({
    name,
    address:   document.getElementById('m-saddr').value,
    guards:    0,
    incidents: 0,
    client:    document.getElementById('m-sclient').value,
  });

  closeModal();
  go(S.page);
}
