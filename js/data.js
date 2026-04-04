/* =====================
   WeGuard — data.js
   Central app state
   ===================== */

const S = {
  role: 'admin',
  page: 'dashboard',

  guards: [
    { id: 'G001', name: 'Rajiv Sharma',  site: 'Mall Complex',  status: 'on-duty',  shift: 'Day',   phone: '+91 98765 00001' },
    { id: 'G002', name: 'Priya Kaur',    site: 'Tech Park',     status: 'on-duty',  shift: 'Night', phone: '+91 98765 00002' },
    { id: 'G003', name: 'Amit Singh',    site: 'Hospital Wing', status: 'off-duty', shift: 'Day',   phone: '+91 98765 00003' },
    { id: 'G004', name: 'Deepa Nair',    site: 'Residential A', status: 'on-leave', shift: 'Day',   phone: '+91 98765 00004' },
    { id: 'G005', name: 'Suresh Kumar',  site: 'Mall Complex',  status: 'on-duty',  shift: 'Night', phone: '+91 98765 00005' },
  ],

  sites: [
    { name: 'Mall Complex',  address: 'GT Road, Ludhiana',        guards: 2, incidents: 3, client: 'Omaxe Ltd'      },
    { name: 'Tech Park',     address: 'Focal Point, Ludhiana',    guards: 1, incidents: 1, client: 'Infosys Pvt Ltd' },
    { name: 'Hospital Wing', address: 'Civil Lines, Ludhiana',    guards: 1, incidents: 0, client: 'DMC Hospital'    },
    { name: 'Residential A', address: 'Sarabha Nagar, Ludhiana',  guards: 1, incidents: 2, client: 'DLF Homes'      },
  ],

  incidents: [
    { id: 'INC-041', type: 'Trespassing',        site: 'Mall Complex',  guard: 'Rajiv Sharma', severity: 'medium', time: 'Today, 09:14',    status: 'open'     },
    { id: 'INC-040', type: 'Theft Attempt',       site: 'Residential A', guard: 'Deepa Nair',   severity: 'high',   time: 'Yesterday, 22:30', status: 'resolved' },
    { id: 'INC-039', type: 'Equipment Fault',     site: 'Tech Park',     guard: 'Priya Kaur',   severity: 'low',    time: 'Yesterday, 14:00', status: 'resolved' },
    { id: 'INC-038', type: 'Suspicious Activity', site: 'Mall Complex',  guard: 'Suresh Kumar', severity: 'medium', time: '2 days ago',       status: 'resolved' },
  ],

  shifts: {
    'Rajiv Sharma': ['Day',   'Day',   'Day',   'Off',   'Day',   'Day',   'Off'  ],
    'Priya Kaur':   ['Night', 'Night', 'Off',   'Night', 'Night', 'Off',   'Night'],
    'Amit Singh':   ['Day',   'Off',   'Day',   'Day',   'Off',   'Day',   'Day'  ],
    'Deepa Nair':   ['Leave', 'Leave', 'Leave', 'Leave', 'Leave', 'Leave', 'Leave'],
    'Suresh Kumar': ['Night', 'Off',   'Night', 'Night', 'Night', 'Off',   'Night'],
  },
};

/* ---- Helpers ---- */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const AVATAR_COLORS = [
  ['#EAF3EE', '#1B4332'],
  ['#EAF3DE', '#3B6D11'],
  ['#E6F1FB', '#185FA5'],
  ['#EEEDFE', '#534AB7'],
  ['#FAEEDA', '#854F0B'],
];

function initials(name) {
  return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

function avatarColor(index) {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

function sevBadge(s) {
  if (s === 'high')   return '<span class="badge badge-red">High</span>';
  if (s === 'medium') return '<span class="badge badge-amber">Medium</span>';
  return '<span class="badge badge-gray">Low</span>';
}

function stsBadge(s) {
  if (s === 'on-duty')  return '<span class="badge badge-green">On duty</span>';
  if (s === 'off-duty') return '<span class="badge badge-gray">Off duty</span>';
  return '<span class="badge badge-amber">On leave</span>';
}

function incStsBadge(s) {
  return s === 'open'
    ? '<span class="badge badge-amber">Open</span>'
    : '<span class="badge badge-green">Resolved</span>';
}
