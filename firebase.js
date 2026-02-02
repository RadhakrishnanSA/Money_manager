import { initializeApp } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-analytics.js";
import { getDatabase, ref, set, get, update, onValue } from "https://www.gstatic.com/firebasejs/11.2.0/firebase-database.js";

// New Firebase config provided by the user
// SECURITY NOTE: This API key is visible to the client. 
// You must set up "HTTP Referrer" restrictions in the Google Cloud Console 
// to only allow requests from 'localhost' and your specific domain (e.g., github.io).
const firebaseConfig = {
    apiKey: "AIzaSyC4iNdPw5yaSiq3JQCkS-cawuCxRA39qvY",
    authDomain: "moneymanager-5pg.firebaseapp.com",
    projectId: "moneymanager-5pg",
    storageBucket: "moneymanager-5pg.firebasestorage.app",
    messagingSenderId: "992053363688",
    appId: "1:992053363688:web:6f65046b771508b8bf1a5d",
    measurementId: "G-4Z8H3CK9WP"
};

const app = initializeApp(firebaseConfig);
// Initialize Analytics if available in the environment
let analytics;
try {
    analytics = getAnalytics(app);
} catch (e) {
    // Analytics may fail in non-browser or restricted environments
    // keep silent and continue with DB functionality
}

export const db = getDatabase(app);

// Helper functions for database operations
export const saveWeekData = async (weekId, data) => {
    try {
        await set(ref(db, `weeks/${weekId}`), data);
        return { success: true };
    } catch (error) {
        console.error("Error saving week data:", error);
        return { success: false, error };
    }
};

export const getWeekData = async (weekId) => {
    try {
        const snapshot = await get(ref(db, `weeks/${weekId}`));
        if (snapshot.exists()) {
            return { success: true, data: snapshot.val() };
        }
        return { success: true, data: null };
    } catch (error) {
        console.error("Error getting week data:", error);
        return { success: false, error };
    }
};

export const subscribeToWeekData = (weekId, onData) => {
    const dataRef = ref(db, `weeks/${weekId}`);
    return onValue(dataRef, (snapshot) => {
        const data = snapshot.val();
        onData(data);
    });
};

export const updateWeekData = async (weekId, updates) => {
    try {
        await update(ref(db, `weeks/${weekId}`), updates);
        return { success: true };
    } catch (error) {
        console.error("Error updating week data:", error);
        return { success: false, error };
    }
};

export default { app, analytics, db };
