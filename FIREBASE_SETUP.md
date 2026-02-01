# Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add Project" and enter your project name
3. Enable Google Analytics (optional)
4. Create the project

## Step 2: Get Firebase Config

1. In Firebase Console, click the Settings icon (⚙️) → Project Settings
2. Scroll down to "Your apps" section
3. Click "Web" icon to add a web app
4. Register app with a nickname (e.g., "Money Manager")
5. Copy the Firebase config object

## Step 3: Update firebase.js

Replace the config in `src/firebase.js` with your actual credentials:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC4iNdPw5yaSiq3JQCkS-cawuCxRA39qvY",
  authDomain: "moneymanager-5pg.firebaseapp.com",
  projectId: "moneymanager-5pg",
  storageBucket: "moneymanager-5pg.firebasestorage.app",
  messagingSenderId: "992053363688",
  appId: "1:992053363688:web:6f65046b771508b8bf1a5d",
  measurementId: "G-4Z8H3CK9WP",
};
```

> Note: I updated `src/firebase.js` with this config and initialized Analytics. No other Firebase config files were found in the repository.

## Step 4: Enable Realtime Database

1. In Firebase Console, go to "Realtime Database"
2. Click "Create Database"
3. Start in **Test Mode** (for development)
4. Choose database location
5. Click "Enable"

## Step 5: Set Database Rules

Go to "Rules" tab and set:

```json
{
  "rules": {
    "weeks": {
      ".read": true,
      ".write": true
    }
  }
}
```

## Step 6: Install Dependencies

```bash
npm install
```

## Done!

Your Money Manager app is now connected to Firebase!

---

## Features Implemented:

✅ **Weekly Budget** - Add multiple amounts throughout the week
✅ **Groceries** - Constant amount across all days, addable
✅ **Daily Expenses** - Add multiple entries (morning, evening, etc.)
✅ **Edit Today's Expenses** - Edit only today's entries
✅ **Delete Expenses** - Remove wrong entries
✅ **View All Data** - See all expenses with category breakdown
✅ **Auto-calculate** - Budget, Total Expenses, and Balance update automatically
✅ **Status Colors** - Red (over budget), Gold (warning), Green (safe)
✅ **Responsive Design** - Works on mobile and desktop

---

## Data Structure (Firebase Realtime Database):

```
weeks/
  {weekId}/
    weekStartDate: "2026-01-27"
    budgetHistory: [
      { amount: 1500, date: "1/28/2026", type: "add" },
      { amount: 500, date: "1/29/2026", type: "add" }
    ]
    groceries: { amount: 600, lastUpdated: "1/28/2026" }
    expenses:
      food: [
        { id: 1234567890, amount: 250, date: "1/28/2026", day: "Tuesday", time: "12:30 PM" }
      ]
      petrol: [...]
      things: [...]
      snacks: [...]
    allExpenses: [...] // Flat list of all expenses
```
