/* WeGuard Pro — demo-data.js */

const DEMO_USERS = {
  'admin@weguard.com':  { password:'admin123', role:'admin',  name:'Admin User',    av:'AU' },
  'guard@weguard.com':  { password:'guard123', role:'guard',  name:'Rajiv Sharma',  av:'RS' },
  'client@weguard.com': { password:'client123',role:'client', name:'Omaxe Ltd',     av:'OM' },
};

const DEMO = {
  guards: [
    { id:'G001', name:'Rajiv Sharma',  site:'Mall Complex',  status:'on-duty',  shift:'Day',   phone:'+91 98765 00001', joinDate:'2023-01-15', docs:['ID','Certificate'] },
    { id:'G002', name:'Priya Kaur',    site:'Tech Park',     status:'on-duty',  shift:'Night', phone:'+91 98765 00002', joinDate:'2023-03-22', docs:['ID'] },
    { id:'G003', name:'Amit Singh',    site:'Hospital Wing', status:'off-duty', shift:'Day',   phone:'+91 98765 00003', joinDate:'2022-11-10', docs:['ID','Certificate','Medical'] },
    { id:'G004', name:'Deepa Nair',    site:'Residential A', status:'on-leave', shift:'Day',   phone:'+91 98765 00004', joinDate:'2023-06-01', docs:['ID'] },
    { id:'G005', name:'Suresh Kumar',  site:'Mall Complex',  status:'on-duty',  shift:'Night', phone:'+91 98765 00005', joinDate:'2022-08-20', docs:['ID','Certificate'] },
    { id:'G006', name:'Arjun Mehta',   site:'Tech Park',     status:'on-duty',  shift:'Day',   phone:'+91 98765 00006', joinDate:'2024-01-05', docs:['ID'] },
  ],
  sites: [
    { id:'S001', name:'Mall Complex',  address:'GT Road, Ludhiana',       client:'Omaxe Ltd',      guards:2, monthly:45000, checkpoints:6 },
    { id:'S002', name:'Tech Park',     address:'Focal Point, Ludhiana',   client:'Infosys Pvt Ltd', guards:2, monthly:38000, checkpoints:4 },
    { id:'S003', name:'Hospital Wing', address:'Civil Lines, Ludhiana',   client:'DMC Hospital',   guards:1, monthly:28000, checkpoints:5 },
    { id:'S004', name:'Residential A', address:'Sarabha Nagar, Ludhiana', client:'DLF Homes',      guards:1, monthly:22000, checkpoints:3 },
  ],
  incidents: [
    { id:'INC-041', type:'Trespassing',        site:'Mall Complex',  guard:'Rajiv Sharma', severity:'medium', time:'Today, 09:14',    status:'open',     desc:'Unknown individual in restricted parking zone.' },
    { id:'INC-040', type:'Theft Attempt',       site:'Residential A', guard:'Deepa Nair',  severity:'high',   time:'Yesterday, 22:30',status:'resolved', desc:'Attempted break-in at Block C main gate.' },
    { id:'INC-039', type:'Equipment Fault',     site:'Tech Park',     guard:'Priya Kaur',  severity:'low',    time:'Yesterday, 14:00',status:'resolved', desc:'CCTV camera 3 offline, reported to maintenance.' },
    { id:'INC-038', type:'Suspicious Activity', site:'Mall Complex',  guard:'Suresh Kumar',severity:'medium', time:'2 days ago',      status:'resolved', desc:'Unidentified vehicle parked overnight.' },
    { id:'INC-037', type:'Medical Emergency',   site:'Hospital Wing', guard:'Amit Singh',  severity:'high',   time:'3 days ago',      status:'resolved', desc:'Visitor collapsed near reception.' },
  ],
  attendance: [
    { id:'A001', guard:'Rajiv Sharma', date:'2026-03-30', checkIn:'07:58', checkOut:null,    status:'present', site:'Mall Complex' },
    { id:'A002', guard:'Priya Kaur',   date:'2026-03-30', checkIn:'19:55', checkOut:null,    status:'present', site:'Tech Park' },
    { id:'A003', guard:'Amit Singh',   date:'2026-03-30', checkIn:null,    checkOut:null,    status:'absent',  site:'Hospital Wing' },
    { id:'A004', guard:'Suresh Kumar', date:'2026-03-30', checkIn:'19:50', checkOut:null,    status:'present', site:'Mall Complex' },
    { id:'A005', guard:'Arjun Mehta',  date:'2026-03-30', checkIn:'07:52', checkOut:null,    status:'present', site:'Tech Park' },
    { id:'A006', guard:'Deepa Nair',   date:'2026-03-30', checkIn:null,    checkOut:null,    status:'leave',   site:'Residential A' },
  ],
  checkpoints: [
    { id:'CP1', site:'Mall Complex', name:'Main Gate',      lat:30.901, lng:75.857, lastScan:'09:30', guard:'Rajiv Sharma', done:true },
    { id:'CP2', site:'Mall Complex', name:'Parking Zone A', lat:30.902, lng:75.858, lastScan:'09:45', guard:'Rajiv Sharma', done:true },
    { id:'CP3', site:'Mall Complex', name:'East Wing',      lat:30.900, lng:75.860, lastScan:null,    guard:null,           done:false },
    { id:'CP4', site:'Mall Complex', name:'Food Court',     lat:30.903, lng:75.856, lastScan:null,    guard:null,           done:false },
    { id:'CP5', site:'Tech Park',    name:'Server Room',    lat:30.910, lng:75.870, lastScan:'20:10', guard:'Priya Kaur',   done:true },
    { id:'CP6', site:'Tech Park',    name:'Reception',      lat:30.911, lng:75.869, lastScan:null,    guard:null,           done:false },
  ],
  invoices: [
    { id:'INV-024', client:'Omaxe Ltd',      site:'Mall Complex',  amount:45000, month:'March 2026',    status:'paid',    due:'2026-03-31' },
    { id:'INV-023', client:'Infosys Pvt Ltd', site:'Tech Park',    amount:38000, month:'March 2026',    status:'pending', due:'2026-04-05' },
    { id:'INV-022', client:'DMC Hospital',   site:'Hospital Wing', amount:28000, month:'March 2026',    status:'pending', due:'2026-04-05' },
    { id:'INV-021', client:'DLF Homes',      site:'Residential A', amount:22000, month:'March 2026',    status:'overdue', due:'2026-03-28' },
    { id:'INV-020', client:'Omaxe Ltd',      site:'Mall Complex',  amount:45000, month:'February 2026', status:'paid',    due:'2026-02-28' },
    { id:'INV-019', client:'Infosys Pvt Ltd', site:'Tech Park',    amount:38000, month:'February 2026', status:'paid',    due:'2026-02-28' },
  ],
  shifts: {
    'Rajiv Sharma': ['Day','Day','Day','Off','Day','Day','Off'],
    'Priya Kaur':   ['Night','Night','Off','Night','Night','Off','Night'],
    'Amit Singh':   ['Day','Off','Day','Day','Off','Day','Day'],
    'Deepa Nair':   ['Leave','Leave','Leave','Leave','Leave','Leave','Leave'],
    'Suresh Kumar': ['Night','Off','Night','Night','Night','Off','Night'],
    'Arjun Mehta':  ['Day','Day','Off','Day','Day','Day','Off'],
  },
  notifications: [
    { id:'N1', title:'SOS Alert Cleared', sub:'Rajiv Sharma — Mall Complex', time:'10 min ago', type:'danger' },
    { id:'N2', title:'Guard checked in', sub:'Arjun Mehta — Tech Park, 07:52', time:'2h ago', type:'info' },
    { id:'N3', title:'Invoice overdue', sub:'DLF Homes — ₹22,000 pending', time:'1d ago', type:'warning' },
    { id:'N4', title:'Checkpoint missed', sub:'East Wing — Mall Complex', time:'2h ago', type:'warning' },
  ],
  guardLocations: [
    { guard:'Rajiv Sharma',  site:'Mall Complex',  lat:62, lng:28, status:'on-duty' },
    { guard:'Priya Kaur',    site:'Tech Park',     lat:38, lng:65, status:'on-duty' },
    { guard:'Suresh Kumar',  site:'Mall Complex',  lat:58, lng:35, status:'on-duty' },
    { guard:'Arjun Mehta',   site:'Tech Park',     lat:32, lng:72, status:'on-duty' },
  ],
};

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const AVATAR_COLORS = [
  ['#EAF3EE','#1B4332'],['#EAF3DE','#3B6D11'],['#E6F1FB','#185FA5'],
  ['#EEEDFE','#534AB7'],['#FAEEDA','#854F0B'],['#FAECE7','#993C1D'],
];
