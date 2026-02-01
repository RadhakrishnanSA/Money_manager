// import './style.css'; // Disabled due to build error
import { saveWeekData, getWeekData, updateWeekData } from "./firebase.js";
// Chart.js loaded via CDN

// Inject CSS at runtime to avoid build pipeline issues
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
    expenses: {
        groceries: [],
        food: [],
        petrol: [],
        things: [],
        snacks: [],
    },
};

// Global Chart Instances
let categoryChartInstance = null;
let trendChartInstance = null;

// Date Helpers
const today = new Date();
const todayString = today.toLocaleDateString();
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayOfWeek = dayNames[today.getDay()];
const weekId = getWeekId(today);

// --- Helper Functions ---

function getWeekStart(date = new Date()) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function getWeekId(date = new Date()) {
    const weekStart = getWeekStart(date);
    return weekStart.toISOString().split("T")[0];
}

const saveToLocalStorage = (weekId, data) => {
    try {
        localStorage.setItem(`week_${weekId}`, JSON.stringify(data));
        return { success: true };
    } catch (e) {
        console.error("Error saving to local storage:", e);
        return { success: false };
    }
};

const getFromLocalStorage = (weekId) => {
    try {
        const data = localStorage.getItem(`week_${weekId}`);
        return { success: true, data: data ? JSON.parse(data) : null };
    } catch (e) {
        console.error("Error reading from local storage:", e);
        return { success: true, data: null };
    }
};

// --- Data Logic ---

async function init() {
    // Show Date
    const dateDisplay = document.getElementById("date-display");
    if (dateDisplay) dateDisplay.textContent = todayString;

    const dayDisplay = document.getElementById("day-display");
    if (dayDisplay) dayDisplay.textContent = dayOfWeek;

    // Load Data
    let result = { success: true, data: null };
    try {
        result = await getWeekData(weekId);
    } catch (e) {
        console.log("Firebase failed, using local storage");
    }

    if (!result.success || !result.data) {
        result = getFromLocalStorage(weekId);
    }

    if (result.success && result.data) {
        weekData = result.data;
        // Ensure all categories exist
        categories.forEach(cat => {
            if (!weekData.expenses[cat]) weekData.expenses[cat] = [];
        });
        if (weekData.groceries && !Array.isArray(weekData.groceries)) {
            // Migration fix: wipe old object groceries if present
            weekData.expenses.groceries = [];
            delete weekData.groceries;
        }
    } else {
        // Initialize new week
        const initialData = {
            weekStartDate: getWeekStart(today).toISOString().split("T")[0],
            budgetHistory: [],
            expenses: {
                groceries: [],
                food: [],
                petrol: [],
                things: [],
                snacks: [],
            },
        };
        weekData = initialData;
        persistData(initialData, true);
    }

    render();
}

async function persistData(data, forceSave = false) {
    try {
        await updateWeekData(weekId, data);
    } catch (e) {
        saveToLocalStorage(weekId, data);
    }
}

// --- Calculations ---

const getTotalBudget = () => {
    return (weekData.budgetHistory || []).reduce((sum, item) => sum + item.amount, 0);
};

const getTotalExpenses = () => {
    let total = 0;
    categories.forEach((cat) => {
        total += (weekData.expenses[cat] || []).reduce((sum, exp) => sum + exp.amount, 0);
    });
    return total;
};

const getBalance = () => {
    return getTotalBudget() - getTotalExpenses();
};

const getStatusColor = () => {
    const balance = getBalance();
    const budget = getTotalBudget();
    if (budget === 0) return "white";
    return balance < 0 ? "red" : balance < budget * 0.1 ? "gold" : "green";
};

// --- Rendering ---

function render() {
    renderWeeklyView();
    // Re-render charts/timeline if visible? 
    if (document.getElementById("timeline-view").style.display === "block") renderTimeline();
    if (document.getElementById("analytics-view").style.display === "block") renderCharts();
}

function renderWeeklyView() {
    // Budget
    const totalBudget = getTotalBudget();
    const statusColor = getStatusColor();
    const budgetEl = document.getElementById("total-budget-display");
    if (budgetEl) {
        budgetEl.textContent = `₹ ${totalBudget}`;
        budgetEl.className = statusColor;
    }

    // Expenses Grid
    const gridEl = document.getElementById("expense-grid");
    if (gridEl) {
        gridEl.innerHTML = "";
        categories.forEach(cat => {
            const box = document.createElement("div");
            box.className = "expense-box";

            // Calculate total for this category
            const catTotal = (weekData.expenses[cat] || []).reduce((sum, e) => sum + e.amount, 0);

            // Header & Input
            box.innerHTML = `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <h4>${cat}</h4>
                    <span style="font-size:12px; opacity:0.7;">₹${catTotal}</span>
                </div>
                <div class="add-input-group">
                    <input type="number" placeholder="+₹" id="input-${cat}">
                    <button id="btn-add-${cat}">Add</button>
                </div>
                <div class="expense-list" id="list-${cat}"></div>
            `;

            gridEl.appendChild(box);

            // Add Event Listener
            const btn = box.querySelector(`#btn-add-${cat}`);
            if (btn) btn.addEventListener("click", () => handleAddExpense(cat));

            const inp = box.querySelector(`#input-${cat}`);
            if (inp) inp.addEventListener("keypress", (e) => {
                if (e.key === "Enter") handleAddExpense(cat);
            });

            // List Items (Recent 5)
            const listEl = box.querySelector(`#list-${cat}`);
            const recentItems = (weekData.expenses[cat] || []).slice().reverse().slice(0, 5);

            recentItems.forEach(exp => {
                const item = document.createElement("div");

                // Check if it's being edited
                if (window.editingExpense && window.editingExpense.id === exp.id && window.editingExpense.category === cat) {
                    item.className = "expense-item";
                    item.innerHTML = `
                        <div class="edit-input-group">
                            <input type="number" value="${window.editValue}" id="edit-val-${exp.id}">
                            <button id="save-${exp.id}">Save</button>
                            <button id="cancel-${exp.id}">Cancel</button>
                        </div>
                    `;
                    listEl.appendChild(item);

                    document.getElementById(`save-${exp.id}`).addEventListener('click', () => handleSaveEdit(cat, exp.id));
                    document.getElementById(`cancel-${exp.id}`).addEventListener('click', () => {
                        window.editingExpense = null;
                        render();
                    });
                    document.getElementById(`edit-val-${exp.id}`).addEventListener('input', (e) => {
                        window.editValue = e.target.value;
                    });

                } else {
                    item.className = "expense-item";
                    item.innerHTML = `
                        <div>
                          <span style="font-size:11px; color:#aaa; margin-right:5px;">${exp.day.substring(0, 3)}</span>
                          <span>${exp.time}</span>
                          <span class="expense-amount">₹${exp.amount}</span>
                        </div>
                        <div class="expense-actions">
                          <button class="edit-btn" data-id="${exp.id}" data-cat="${cat}">✎</button>
                          <button class="delete-btn" data-id="${exp.id}" data-cat="${cat}">✕</button>
                        </div>
                    `;
                    listEl.appendChild(item);
                }
            });
        });

        // Add global event delegation for dynamic buttons if preferred, but adding per-loop works too.
        // Re-attaching listeners for buttons inside grid
        gridEl.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Ensure target is the button
                const target = e.target.closest('.edit-btn');
                const id = Number(target.getAttribute('data-id'));
                const cat = target.getAttribute('data-cat');
                const exp = weekData.expenses[cat].find(x => x.id === id);
                if (exp) {
                    window.editingExpense = { id, category: cat };
                    window.editValue = exp.amount;
                    render();
                }
            });
        });

        gridEl.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target.closest('.delete-btn');
                const id = Number(target.getAttribute('data-id'));
                const cat = target.getAttribute('data-cat');
                if (confirm("Delete this expense?")) {
                    handleDeleteExpense(cat, id);
                }
            });
        });
    }

    // Summary
    const summaryBudget = document.getElementById("summary-budget");
    const summaryExpenses = document.getElementById("summary-expenses");
    const summaryBalance = document.getElementById("summary-balance");
    if (summaryBudget) {
        summaryBudget.textContent = `₹${totalBudget}`;
        summaryExpenses.textContent = `₹${getTotalExpenses()}`;
        summaryBalance.textContent = `Balance: ₹${getBalance()}`;
        summaryBalance.className = `balance ${statusColor}`;
    }
}

function renderTimeline() {
    const listEl = document.getElementById("timeline-container");
    if (!listEl) return;
    listEl.innerHTML = "";

    // Collect all expenses
    let allExpenses = [];
    categories.forEach(cat => {
        if (weekData.expenses[cat]) {
            weekData.expenses[cat].forEach(exp => {
                allExpenses.push({ ...exp, category: cat });
            });
        }
    });

    // Sort by timestamp (id is timestamp) => Descending
    allExpenses.sort((a, b) => b.id - a.id);

    if (allExpenses.length === 0) {
        listEl.innerHTML = "<p style='text-align:center; opacity:0.5'>No history yet.</p>";
        return;
    }

    // Group by Date
    let currentDate = "";

    allExpenses.forEach(exp => {
        if (exp.date !== currentDate) {
            currentDate = exp.date;
            const dateHeader = document.createElement("h4");
            dateHeader.textContent = currentDate === todayString ? "Today" : currentDate;
            dateHeader.style.marginTop = "20px";
            dateHeader.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
            listEl.appendChild(dateHeader);
        }

        const div = document.createElement("div");
        div.className = "expense-item";
        div.innerHTML = `
            <div style="flex-direction:column; align-items:flex-start; gap:2px;">
                <div style="display:flex; align-items:center; gap:8px;">
                     <span class="category-badge">${exp.category}</span>
                     <span class="expense-amount">₹${exp.amount}</span>
                </div>
                <span style="font-size:11px; opacity:0.5;">${exp.time}</span>
            </div>
             <div class="expense-actions">
                <button class="delete-btn" id="del-t-${exp.id}">✕</button>
            </div>
        `;
        listEl.appendChild(div);

        div.querySelector(`#del-t-${exp.id}`).addEventListener("click", () => {
            if (confirm("Delete this?")) handleDeleteExpense(exp.category, exp.id);
        });
    });
}


function renderCharts() {
    if (typeof Chart === 'undefined') return;

    // 1. Category Chart
    const cvsCat = document.getElementById('categoryChart');
    if (!cvsCat) return;

    // Destroy previous instance
    if (categoryChartInstance) {
        categoryChartInstance.destroy();
    }

    const catTotals = categories.map(cat => {
        return (weekData.expenses[cat] || []).reduce((sum, e) => sum + e.amount, 0);
    });

    categoryChartInstance = new Chart(cvsCat.getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
            datasets: [{
                data: catTotals,
                backgroundColor: [
                    '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#3b82f6'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'bottom', labels: { color: 'white' } }
            }
        }
    });

    // 2. Daily Trend Chart
    const cvsTrend = document.getElementById('dailyTrendChart');
    if (!cvsTrend) return;
    if (trendChartInstance) trendChartInstance.destroy();

    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const dailyTotals = days.map(day => {
        let sum = 0;
        categories.forEach(cat => {
            (weekData.expenses[cat] || []).forEach(exp => {
                if (exp.day === day) sum += exp.amount;
            });
        });
        return sum;
    });

    trendChartInstance = new Chart(cvsTrend.getContext('2d'), {
        type: 'bar',
        data: {
            labels: days.map(d => d.substring(0, 3)),
            datasets: [{
                label: 'Spending',
                data: dailyTotals,
                backgroundColor: '#a78bfa',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.1)' }, ticks: { color: '#aaa' } },
                x: { grid: { display: false }, ticks: { color: '#aaa' } }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// --- Actions ---

async function handleAddBudget() {
    const input = document.getElementById("budget-input");
    const val = input.value;
    if (!val || isNaN(val)) return;

    const newHistory = [
        ...weekData.budgetHistory,
        { amount: Number(val), date: todayString, type: "add" },
    ];

    // Optimistic Update
    weekData.budgetHistory = newHistory;
    input.value = "";
    render();

    // Save
    await persistData({ budgetHistory: newHistory });
}

async function handleAddExpense(category) {
    const input = document.getElementById(`input-${category}`);
    const val = input.value;
    if (!val || isNaN(val)) return;

    const amount = Number(val);
    const newExpense = {
        id: Date.now(),
        amount,
        date: todayString,
        day: dayOfWeek,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const newCatExpenses = [...(weekData.expenses[category] || []), newExpense];

    // Update local state
    weekData.expenses = {
        ...weekData.expenses,
        [category]: newCatExpenses
    };

    input.value = "";
    render();

    // Persist
    await persistData({ expenses: weekData.expenses });
}

async function handleSaveEdit(category, expenseId) {
    const newAmount = window.editValue;
    if (!newAmount || isNaN(newAmount)) return;

    const updatedList = weekData.expenses[category].map((exp) =>
        exp.id === expenseId ? { ...exp, amount: Number(newAmount) } : exp
    );

    weekData.expenses = {
        ...weekData.expenses,
        [category]: updatedList
    };
    window.editingExpense = null;

    render();
    await persistData({ expenses: weekData.expenses });
}

async function handleDeleteExpense(category, expenseId) {
    const updatedList = weekData.expenses[category].filter((exp) => exp.id !== expenseId);

    weekData.expenses = {
        ...weekData.expenses,
        [category]: updatedList
    };

    render();
    await persistData({ expenses: weekData.expenses });
}

// --- Setup Global Listeners ---

const btnBudget = document.getElementById("add-budget-btn");
if (btnBudget) {
    btnBudget.addEventListener("click", handleAddBudget);
}
const inpBudget = document.getElementById("budget-input");
if (inpBudget) {
    inpBudget.addEventListener("keypress", (e) => {
        if (e.key === 'Enter') handleAddBudget();
    });
}

// View Switching
const views = ["weekly-view", "timeline-view", "analytics-view", "monthly-view"];
const showView = (viewId) => {
    views.forEach(v => {
        const el = document.getElementById(v);
        if (el) el.style.display = (v === viewId) ? "block" : "none";
    });
    window.scrollTo(0, 0);
};

// Bind nav buttons
const bindNav = (id, view) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", () => {
        showView(view);
        if (view === 'timeline-view') renderTimeline();
        if (view === 'analytics-view') renderCharts();
    });
};

bindNav("go-to-timeline-btn", "timeline-view");
bindNav("go-to-analytics-btn", "analytics-view");
bindNav("go-to-monthly-btn", "monthly-view"); // Fallback view

bindNav("back-from-timeline", "weekly-view");
bindNav("back-from-analytics", "weekly-view");
bindNav("back-to-weekly-btn", "weekly-view");

// Start
init();
