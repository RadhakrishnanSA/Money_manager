// import './style.css'; 
import { saveWeekData, getWeekData, updateWeekData } from "./firebase.js";

// Global error handler for mobile debugging
window.onerror = function (msg, url, lineNo, columnNo, error) {
    const log = document.getElementById('debug-log');
    if (log) {
        log.style.display = 'block';
        log.innerHTML += `ERROR: ${msg} at ${lineNo}:${columnNo}<br>`;
    }
    return false;
};

// Inject CSS at runtime
const cssContent = `
:root { --bg-dark: #09090b; --glass-bg: rgba(255, 255, 255, 0.03); --glass-border: rgba(255, 255, 255, 0.08); --primary-gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%); --accent-color: #a78bfa; --text-primary: #ffffff; --text-secondary: #a1a1aa; --success: #10b981; --warning: #f59e0b; --danger: #ef4444; }
* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
body { margin: 0; background-color: var(--bg-dark); background-image: radial-gradient(at 0% 0%, rgba(118, 75, 162, 0.15) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(102, 126, 234, 0.15) 0px, transparent 50%); color: var(--text-primary); font-family: 'Inter', sans-serif; min-height: 100vh; padding: 20px 16px; padding-bottom: 80px; }
.container { max-width: 500px; margin: 0 auto; width: 100%; }
h1 { text-align: center; font-size: 24px; font-weight: 700; margin: 0 0 24px 0; letter-spacing: -0.5px; background: linear-gradient(to right, #fff, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
h2 { font-size: 32px; font-weight: 800; margin: 0; letter-spacing: -1px; }
h3 { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; color: var(--text-secondary); margin: 24px 0 12px 0; font-weight: 600; }
h4 { margin: 0 0 12px 0; font-size: 15px; font-weight: 500; text-transform: capitalize; display: flex; align-items: center; gap: 8px; }
.date-box { display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: var(--text-secondary); margin-bottom: 24px; padding: 0 4px; }
.section, .week-box, .expense-box, .summary { background: var(--glass-bg); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid var(--glass-border); border-radius: 20px; padding: 20px; margin-bottom: 20px; box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2); }
.week-box { text-align: center; padding: 32px 20px; background: linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%); }
input { width: 100%; padding: 12px 16px; background: rgba(0, 0, 0, 0.3); border: 1px solid var(--glass-border); border-radius: 12px; color: white; font-size: 16px; font-family: inherit; transition: all 0.2s ease; outline: none; }
input:focus { border-color: var(--accent-color); background: rgba(0, 0, 0, 0.5); }
button { padding: 12px 20px; border-radius: 12px; border: none; font-weight: 600; font-size: 14px; cursor: pointer; transition: transform 0.1s ease, box-shadow 0.2s ease; font-family: inherit; }
button:active { transform: scale(0.96); }
.add-input-group button, .view-btn, .back-btn { background: var(--primary-gradient); color: white; box-shadow: 0 4px 15px rgba(118, 75, 162, 0.4); }
.add-input-group { display: flex; gap: 8px; margin-top: 16px; }
.add-input-group input { flex: 1; }
.add-input-group button { white-space: nowrap; }
.view-btn { width: 100%; display: flex; justify-content: center; align-items: center; gap: 8px; margin-top: 0; font-size: 15px; padding: 16px; }
.expense-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }
@media (min-width: 600px) { .expense-grid { grid-template-columns: 1fr 1fr; } }
.expense-box { padding: 16px; }
.expense-list { margin-top: 16px; max-height: 200px; overflow-y: auto; padding-right: 4px; scrollbar-width: thin; scrollbar-color: var(--glass-border) transparent; }
.expense-list::-webkit-scrollbar { width: 4px; }
.expense-list::-webkit-scrollbar-thumb { background: var(--glass-border); border-radius: 4px; }
.expense-item { background: rgba(255, 255, 255, 0.03); padding: 12px; border-radius: 12px; margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center; border: 1px solid transparent; }
.expense-item:hover { border-color: var(--glass-border); }
.expense-amount { color: var(--text-primary); font-weight: 600; font-size: 15px; }
.expense-actions { display: flex; gap: 8px; }
.edit-btn, .delete-btn { padding: 6px 10px; background: rgba(255, 255, 255, 0.1); color: var(--text-secondary); border-radius: 8px; font-size: 12px; box-shadow: none; }
.delete-btn { background: rgba(239, 68, 68, 0.15); color: #fca5a5; }
.summary p { display: flex; justify-content: space-between; margin: 12px 0; font-size: 15px; color: var(--text-secondary); }
.summary p span { color: var(--text-primary); font-weight: 500; }
.summary .balance { margin-top: 20px; padding-top: 20px; border-top: 1px solid var(--glass-border); font-size: 18px; font-weight: 700; color: var(--text-primary); }
.green { color: var(--success) !important; }
.gold { color: var(--warning) !important; }
.red { color: var(--danger) !important; }
.white { color: var(--text-primary) !important; }
.edit-input-group { display: flex; gap: 6px; width: 100%; }
.edit-input-group input { padding: 8px; }
.edit-input-group button { padding: 8px 12px; background: rgba(255, 255, 255, 0.1); }
.header-back { display: flex; align-items: center; gap: 16px; margin-bottom: 24px; }
.back-btn { width: auto; padding: 8px 16px; font-size: 14px; }
.detail-row { display: flex; justify-content: space-between; padding: 16px; background: rgba(255, 255, 255, 0.02); border-bottom: 1px solid var(--glass-border); align-items: center; }
.detail-row:first-child { border-top-left-radius: 12px; border-top-right-radius: 12px; }
.detail-row:last-child { border-bottom-left-radius: 12px; border-bottom-right-radius: 12px; border-bottom: none; }
.category-badge { background: rgba(167, 139, 250, 0.15); color: #c4b5fd; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
.category-row { padding: 16px; display: flex; justify-content: space-between; border-bottom: 1px solid var(--glass-border); }
.category-row:last-child { border-bottom: none; }
.groceries-row { margin-top: 16px; background: rgba(16, 185, 129, 0.05); border-radius: 12px; border: 1px solid rgba(16, 185, 129, 0.1); color: #6ee7b7; }
#categoryChart, #dailyTrendChart { max-height: 300px; width: 100%; }
`;

const style = document.createElement('style');
style.textContent = cssContent;
document.head.appendChild(style);

// Config
const categories = ["groceries", "food", "snacks", "petrol", "things"];
let weekData = {
    weekStartDate: "",
    budgetHistory: [],
    expenses: { groceries: [], food: [], petrol: [], things: [], snacks: [] },
};

// Date Helpers
const today = new Date();
const todayString = today.toLocaleDateString();
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayOfWeek = dayNames[today.getDay()];
const weekId = getWeekId(today);

// Helpers
function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function getWeekId(date) {
    const weekStart = getWeekStart(date);
    return weekStart.toISOString().split("T")[0];
}

const saveToLocalStorage = (weekId, data) => {
    try { localStorage.setItem(`week_${weekId}`, JSON.stringify(data)); return { success: true }; }
    catch (e) { console.error(e); return { success: false }; }
};

const getFromLocalStorage = (weekId) => {
    try {
        const data = localStorage.getItem(`week_${weekId}`);
        return { success: true, data: data ? JSON.parse(data) : null };
    } catch (e) {
        console.error(e);
        return { success: true, data: null };
    }
};

// Initial Render Logic (Immediate)
function initializeDefaults() {
    const initialData = {
        weekStartDate: getWeekStart(today).toISOString().split("T")[0],
        budgetHistory: [],
        expenses: { groceries: [], food: [], petrol: [], things: [], snacks: [] },
    };

    // Try local storage first
    const local = getFromLocalStorage(weekId);
    if (local.success && local.data) {
        // Migration check
        if (local.data.groceries && !Array.isArray(local.data.groceries)) {
            local.data.expenses.groceries = [];
            delete local.data.groceries;
        }
        weekData = local.data;
    } else {
        weekData = initialData;
        saveToLocalStorage(weekId, initialData);
    }

    // Fix Categories
    categories.forEach(cat => {
        if (!weekData.expenses[cat]) weekData.expenses[cat] = [];
    });

    const dateDisplay = document.getElementById("date-display");
    if (dateDisplay) dateDisplay.textContent = todayString;
    const dayDisplay = document.getElementById("day-display");
    if (dayDisplay) dayDisplay.textContent = dayOfWeek;

    render(); // Initial Render
}

async function init() {
    initializeDefaults(); // Render defaults/local first

    // Then try sync with Firebase
    try {
        const result = await getWeekData(weekId);
        if (result.success && result.data) {
            weekData = result.data;
            // Ensure schema
            categories.forEach(cat => {
                if (!weekData.expenses[cat]) weekData.expenses[cat] = [];
            });
            if (weekData.groceries && !Array.isArray(weekData.groceries)) {
                weekData.expenses.groceries = [];
                delete weekData.groceries;
            }
            render(); // Re-render with cloud data
        }
    } catch (e) {
        console.warn("Firebase sync failed:", e);
    }
}

// Persist
async function persistData(data) {
    // Save to LocalStorage immediately
    saveToLocalStorage(weekId, weekData);

    // Try Cloud
    try {
        await updateWeekData(weekId, data);
    } catch (e) {
        console.warn("Cloud save failed:", e);
    }
}

// Calculations
const getTotalBudget = () => (weekData.budgetHistory || []).reduce((sum, item) => sum + item.amount, 0);
const getTotalExpenses = () => {
    let total = 0;
    categories.forEach((cat) => {
        total += (weekData.expenses[cat] || []).reduce((sum, exp) => sum + exp.amount, 0);
    });
    return total;
};
const getBalance = () => getTotalBudget() - getTotalExpenses();
const getStatusColor = () => {
    const bal = getBalance();
    const bud = getTotalBudget();
    if (bud === 0) return "white";
    return bal < 0 ? "red" : bal < bud * 0.1 ? "gold" : "green";
};

// Render
function render() {
    try {
        const totalBudget = getTotalBudget();
        const statusColor = getStatusColor();

        // Summary Header
        const budgetEl = document.getElementById("total-budget-display");
        if (budgetEl) {
            budgetEl.textContent = `₹ ${totalBudget}`;
            budgetEl.className = statusColor;
        }

        // Summary Section
        const sumBudget = document.getElementById("summary-budget");
        if (sumBudget) sumBudget.textContent = `₹${totalBudget}`;
        const sumExp = document.getElementById("summary-expenses");
        if (sumExp) sumExp.textContent = `₹${getTotalExpenses()}`;
        const sumBal = document.getElementById("summary-balance");
        if (sumBal) {
            sumBal.textContent = `Balance: ₹${getBalance()}`;
            sumBal.className = `balance ${statusColor}`;
        }

        // Expense Grid
        const gridEl = document.getElementById("expense-grid");
        if (gridEl) {
            gridEl.innerHTML = "";
            categories.forEach(cat => {
                const box = document.createElement("div");
                box.className = "expense-box";
                const catTotal = (weekData.expenses[cat] || []).reduce((sum, e) => sum + e.amount, 0);

                box.innerHTML = `
                    <div style="display:flex; justify-content:space-between; align-items:center;">
                        <h4>${cat}</h4>
                        <span style="font-size:12px; opacity:0.7;">₹${catTotal}</span>
                    </div>
                    <div class="add-input-group">
                        <input type="number" placeholder="+₹" id="input-${cat}">
                        <button class="add-btn-dynamic" data-cat="${cat}">Add</button>
                    </div>
                    <div class="expense-list" id="list-${cat}"></div>
                `;
                gridEl.appendChild(box);

                // List
                const listEl = box.querySelector(`#list-${cat}`);
                const recentItems = (weekData.expenses[cat] || []).slice().reverse().slice(0, 5);

                recentItems.forEach(exp => {
                    const item = document.createElement("div");
                    item.className = "expense-item";
                    item.innerHTML = `
                        <div>
                           <span style="font-size:11px; color:#aaa; margin-right:5px;">${exp.day.substring(0, 3)}</span>
                           <span>${exp.time}</span>
                           <span class="expense-amount">₹${exp.amount}</span>
                         </div>
                         <div class="expense-actions">
                           <button class="delete-btn" data-id="${exp.id}" data-cat="${cat}">✕</button>
                         </div>
                    `;
                    listEl.appendChild(item);
                });
            });

            // Bind Events (Delegation)
            gridEl.onclick = (e) => {
                const addBtn = e.target.closest('.add-btn-dynamic');
                if (addBtn) {
                    const cat = addBtn.dataset.cat;
                    handleAddExpense(cat);
                }
                const delBtn = e.target.closest('.delete-btn');
                if (delBtn) {
                    const cat = delBtn.dataset.cat;
                    const id = Number(delBtn.dataset.id);
                    if (confirm("Delete?")) handleDeleteExpense(cat, id);
                }
            };

            // Keypress via direct attachment
            categories.forEach(cat => {
                const inp = document.getElementById(`input-${cat}`);
                if (inp) inp.onkeypress = (e) => {
                    if (e.key === 'Enter') handleAddExpense(cat);
                }
            });
        }
    } catch (err) {
        console.error("Render Error:", err);
    }
}

// Handlers
async function handleAddBudget() {
    const input = document.getElementById("budget-input");
    const val = input.value;
    if (!val || isNaN(val)) return;
    const newHistory = [...weekData.budgetHistory, { amount: Number(val), date: todayString, type: "add" }];
    weekData.budgetHistory = newHistory;
    input.value = "";
    render();
    await persistData({ budgetHistory: newHistory });
}

async function handleAddExpense(category) {
    const input = document.getElementById(`input-${category}`);
    const val = input.value;
    if (!val || isNaN(val)) return;

    const newExpense = {
        id: Date.now(),
        amount: Number(val),
        date: todayString,
        day: dayOfWeek,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    // Update State
    weekData.expenses[category] = [...(weekData.expenses[category] || []), newExpense];

    input.value = "";
    render();
    await persistData({ expenses: weekData.expenses });
}

async function handleDeleteExpense(category, id) {
    weekData.expenses[category] = weekData.expenses[category].filter(e => e.id !== id);
    render();
    await persistData({ expenses: weekData.expenses });
}

// Nav
const showView = (id) => {
    ["weekly-view", "timeline-view", "analytics-view"].forEach(v => {
        const el = document.getElementById(v);
        if (el) el.style.display = (v === id) ? "block" : "none";
    });
};

// Expose to window for HTML access
window.handleAddBudget = handleAddBudget;
window.handleAddExpense = handleAddExpense;
window.handleDeleteExpense = handleDeleteExpense;
window.delT = (c, i) => { if (confirm("Delete?")) handleDeleteExpense(c, i); };
window.showView = showView;
window.renderTimeline = renderTimeline;
window.renderCharts = renderCharts;

// Global Click Listener for Debugging
document.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (btn) {
        console.log("Clicked:", btn);
        const log = document.getElementById('debug-log');
        if (log) log.innerHTML += `Clicked ${btn.innerText || btn.className}<br>`;
    }
});

// Bind Static Buttons just in case
const bindBtn = (id, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', fn);
};

bindBtn("add-budget-btn", handleAddBudget);
bindBtn("go-to-timeline-btn", () => { showView("timeline-view"); renderTimeline(); });
bindBtn("go-to-analytics-btn", () => { showView("analytics-view"); renderCharts(); });
bindBtn("back-from-timeline", () => showView("weekly-view"));
bindBtn("back-from-analytics", () => showView("weekly-view"));
bindBtn("back-to-weekly-btn", () => showView("weekly-view"));

// Keyboard support
const budgetInp = document.getElementById("budget-input");
if (budgetInp) budgetInp.onkeypress = (e) => { if (e.key === 'Enter') handleAddBudget(); };

// Start
init();
