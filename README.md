# WeGuard Pro — Setup Guide

## Project Structure

```
weguard-pro/
├── index.html              ← App shell + Firebase SDK import
├── css/
│   └── style.css           ← All styles (DM Sans font, green theme)
├── js/
│   ├── demo-data.js        ← All demo data + constants
│   ├── state.js            ← Global app state (S object)
│   ├── helpers.js          ← Utility functions, badges, formatters
│   ├── icons.js            ← SVG icon library (ICO object)
│   ├── nav.js              ← Sidebar navigation + role config
│   ├── modal.js            ← Modal open/close helpers
│   ├── notifications.js    ← Notification panel + SOS overlay
│   └── app.js              ← Login, routing, Firebase boot
└── pages/
    ├── dashboard.js        ← Admin dashboard with stats
    ├── guards.js           ← Guard management + add/view/remove
    ├── attendance.js       ← Check-in/out + monthly summary
    ├── patrol.js           ← Checkpoint tracking + QR scan
    ├── incidents.js        ← Incident log + report + resolve
    ├── sites.js            ← Site cards + billing + reports + docs + map + shifts
    └── (other stubs)
```

---

## Running Locally (No Firebase needed)

1. Open VS Code → Open Folder → `weguard-pro/`
2. Install the **Live Server** extension
3. Right-click `index.html` → **Open with Live Server**
4. Log in with demo accounts:
   - **Admin:** admin@weguard.com / admin123
   - **Guard:** guard@weguard.com / guard123
   - **Client:** client@weguard.com / client123

---

## Firebase Setup (for real data persistence)

### Step 1: Create Firebase Project
1. Go to [https://console.firebase.google.com](https://console.firebase.google.com)
2. Click **"Add project"** → name it `weguard-pro`
3. Disable Google Analytics (optional) → Create project

### Step 2: Enable Authentication
1. Firebase Console → **Authentication** → Get started
2. Enable **Email/Password** provider
3. Add users manually:
   - admin@weguard.com
   - guard@weguard.com
   - client@weguard.com

### Step 3: Create Firestore Database
1. Firebase Console → **Firestore Database** → Create database
2. Start in **test mode** (for development)
3. Choose a region close to you (e.g. `asia-south1` for India)

### Step 4: Enable Storage
1. Firebase Console → **Storage** → Get started
2. Accept default security rules for now

### Step 5: Get Your Config
1. Firebase Console → Project Settings (gear icon) → Your apps
2. Click **"</>  Web"** → Register app as `weguard-web`
3. Copy the `firebaseConfig` object

### Step 6: Paste Config into index.html
Open `index.html` and replace this section (~line 70):

```javascript
const firebaseConfig = {
  apiKey:            "YOUR_API_KEY",         // ← replace
  authDomain:        "YOUR_PROJECT.firebaseapp.com",
  projectId:         "YOUR_PROJECT_ID",
  storageBucket:     "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId:             "YOUR_APP_ID"
};
```

---

## Firestore Collections Structure

```
/guards/{guardId}
  name, site, status, shift, phone, joinDate, docs[]

/incidents/{incidentId}
  type, site, guard, severity, status, desc, createdAt, createdBy

/attendance/{guardId_date}
  guardId, date, checkIn (timestamp), checkOut (timestamp)

/locations/{guardEmail}
  lat, lng, name, updatedAt (for live map)

/alerts/{alertId}
  type: "sos", guardName, site, active, createdAt

/invoices/{invoiceId}
  client, site, amount, month, status, due

/users/{uid}
  name, role, email
```

---

## Firestore Security Rules (paste in Firebase Console → Firestore → Rules)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    function isGuard() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'guard';
    }

    match /guards/{id} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
    match /incidents/{id} {
      allow read: if request.auth != null;
      allow create: if isAdmin() || isGuard();
      allow update: if isAdmin();
    }
    match /attendance/{id} {
      allow read: if request.auth != null;
      allow write: if isAdmin() || isGuard();
    }
    match /locations/{id} {
      allow read: if request.auth != null;
      allow write: if isGuard() || isAdmin();
    }
    match /alerts/{id} {
      allow read: if request.auth != null;
      allow write: if isGuard() || isAdmin();
    }
    match /invoices/{id} {
      allow read: if request.auth != null;
      allow write: if isAdmin();
    }
    match /users/{id} {
      allow read: if request.auth != null;
      allow write: if isAdmin() || request.auth.uid == id;
    }
  }
}
```

---

## Google Maps Integration (for Live Map page)

1. Get a Google Maps API key from [https://console.cloud.google.com](https://console.cloud.google.com)
2. Enable **Maps JavaScript API**
3. Add to `index.html` before closing `</body>`:
```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY"></script>
```
4. In `pages/sites.js` → `pgMap()`, replace the placeholder div with:
```javascript
const map = new google.maps.Map(document.getElementById('map-container'), {
  center: { lat: 30.9, lng: 75.85 },  // Ludhiana coordinates
  zoom: 13
});
// Add marker for each guard location from Firestore
```

---

## Hosting on Firebase (free)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting   # select your project, public dir = .
firebase deploy
```

Your app will be live at: `https://YOUR_PROJECT.web.app`

---

## Key Files to Customize

| File | What to change |
|------|---------------|
| `js/demo-data.js` | Replace demo guards, sites, clients with real data |
| `css/style.css` | Change `--accent` color to your brand color |
| `index.html` | Add your Firebase config |
| `js/nav.js` | Add/remove pages per role |
| `pages/billing.js` | Adjust invoice fields for your pricing model |

---

## Feature Checklist

- [x] Multi-role login (Admin / Guard / Client)
- [x] Guard profiles & management
- [x] Attendance check-in / check-out
- [x] Patrol checkpoint tracking
- [x] Incident logging & resolution
- [x] Site management
- [x] Weekly shift schedule
- [x] Document upload (ID, certificates)
- [x] Client billing & invoices
- [x] Performance reports
- [x] Live guard map (placeholder → plug in Google Maps)
- [x] SOS emergency alert system
- [x] Real-time notifications
- [x] Firebase Auth integration
- [x] Firestore real-time listeners
- [x] CSV export (attendance, shifts)
- [x] Responsive mobile layout
- [ ] Push notifications (add Firebase Cloud Messaging)
- [ ] PDF invoice generation (add jsPDF)
- [ ] WhatsApp shift reminders (add Twilio)
- [ ] Biometric check-in (add device fingerprint API)
