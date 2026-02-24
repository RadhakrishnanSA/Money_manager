import { saveWeekData, getWeekData, updateWeekData, subscribeToWeekData, getAllWeeksData } from "./firebase.js";

// --- Global Setup ---
window.onerror = function (msg, url, lineNo, columnNo, error) {
    const log = document.getElementById('debug-log');
    if (log) {
        log.style.display = 'block';
        log.innerHTML += `ERROR: ${msg}<br>`;
    }
    return false;
};

// --- Data & Helpers ---
const categories = ["groceries", "food", "snacks", "petrol", "things"];
let weekData = {
    weekStartDate: "",
    budgetHistory: [],
    expenses: { groceries: [], food: [], petrol: [], things: [], snacks: [] },
};

const today = new Date();
const todayString = today.toLocaleDateString();
const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const dayOfWeek = dayNames[today.getDay()];
const weekId = getWeekId(today);

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
}

function getWeekId(date) {
    return getWeekStart(date).toISOString().split("T")[0];
}

const saveToLocalStorage = (weekId, data) => {
    try { localStorage.setItem(`week_${weekId}`, JSON.stringify(data)); return { success: true }; }
    catch (e) { return { success: false }; }
};

const getFromLocalStorage = (weekId) => {
    try {
        const data = localStorage.getItem(`week_${weekId}`);
        return { success: true, data: data ? JSON.parse(data) : null };
    } catch (e) { return { success: true, data: null }; }
};

// --- Initialization ---

/* Helper to fix data structure (root-level categories -> expenses) */
function migrateAndSanitize(data) {
    if (!data) return data;

    // Ensure expenses object
    if (!data.expenses || typeof data.expenses !== 'object') {
        data.expenses = {};
    }

    // Migrate all categories from root to expenses
    // This handles 'groceries', 'petrol', etc. being at the top level
    categories.forEach(cat => {
        // If category exists at root (old data)
        if (data[cat] !== undefined) {
            const current = data.expenses[cat] || [];
            // Merge array (handle single item vs array)
            const toAdd = Array.isArray(data[cat]) ? data[cat] : [data[cat]];
            data.expenses[cat] = [...current, ...toAdd];

            // Remove from root to clean up
            delete data[cat];
        }

        // Ensure category array exists in expenses
        if (!data.expenses[cat]) data.expenses[cat] = [];
    });

    return data;
}

async function init() {
    // 1. Initial Defaults
    const initialData = {
        weekStartDate: getWeekStart(today).toISOString().split("T")[0],
        budgetHistory: [],
        expenses: { groceries: [], food: [], petrol: [], things: [], snacks: [] },
    };

    // 2. Load LocalStorage
    const local = getFromLocalStorage(weekId);
    if (local.success && local.data) {
        weekData = migrateAndSanitize(local.data);
    } else {
        weekData = initialData;
    }

    // 3. UI Updates
    const dateDisplay = document.getElementById("date-display");
    if (dateDisplay) dateDisplay.textContent = todayString;
    const dayDisplay = document.getElementById("day-display");
    if (dayDisplay) dayDisplay.textContent = dayOfWeek;

    render(); // Display what we have immediately

    // 4. Sync from Cloud (Real-time)
    subscribeToWeekData(weekId, (data) => {
        if (data) {
            // Fix data coming from cloud (e.g. friend's phone)
            weekData = migrateAndSanitize(data);
            render();
            // Update local storage to match cloud
            saveToLocalStorage(weekId, weekData);
        }
    });
}

async function persistData(data) {
    saveToLocalStorage(weekId, weekData);
    await updateWeekData(weekId, data);
}

// --- Logic functions ---

function getTotalBudget() {
    return (weekData.budgetHistory || []).reduce((sum, item) => sum + item.amount, 0);
}

function getTotalExpenses() {
    let total = 0;
    categories.forEach((cat) => {
        total += (weekData.expenses[cat] || []).reduce((sum, exp) => sum + exp.amount, 0);
    });
    return total;
}

function getBalance() {
    return getTotalBudget() - getTotalExpenses();
}

function getStatusColor() {
    const bal = getBalance();
    const bud = getTotalBudget();
    if (bud === 0) return "white";
    return bal < 0 ? "red" : bal < bud * 0.1 ? "gold" : "green";
}

// --- Render Logic ---

function render() {
    // 1. Budget & Summary
    const totalBudget = getTotalBudget();
    const statusColor = getStatusColor();

    document.getElementById("total-budget-display").textContent = `₹ ${totalBudget}`;
    document.getElementById("total-budget-display").className = statusColor;

    document.getElementById("summary-budget").textContent = `₹${totalBudget}`;
    document.getElementById("summary-expenses").textContent = `₹${getTotalExpenses()}`;
    const sumBal = document.getElementById("summary-balance");
    sumBal.textContent = `Balance: ₹${getBalance()}`;
    sumBal.className = `balance ${statusColor}`;

    // 2. Grid
    const gridEl = document.getElementById("expense-grid");
    gridEl.innerHTML = ""; // Clear existing

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
                <button onclick="handleAddExpense('${cat}')">Add</button>
            </div>
            <div id="list-${cat}" class="expense-list"></div>
        `;

        gridEl.appendChild(box);

        // List Render
        const listEl = box.querySelector(`#list-${cat}`);
        const recent = (weekData.expenses[cat] || []).slice().reverse().slice(0, 5);

        recent.forEach(exp => {
            const item = document.createElement("div");
            item.className = "expense-item";
            item.innerHTML = `
                <div>
                   <span style="font-size:11px; opacity:0.5; margin-right:5px;">${exp.time}</span>
                   <span class="expense-amount">₹${exp.amount}</span>
                </div>
                <button class="delete-btn" onclick="handleDeleteExpense('${cat}', ${exp.id})">✕</button>
            `;
            listEl.appendChild(item);
        });

        // Keypress Listener
        const inp = box.querySelector(`#input-${cat}`);
        inp.addEventListener("keypress", (e) => {
            if (e.key === "Enter") handleAddExpense(cat);
        });
    });
}

function renderTimeline() {
    const el = document.getElementById("timeline-container");
    el.innerHTML = "";

    let all = [];
    categories.forEach(c => (weekData.expenses[c] || []).forEach(e => all.push({ ...e, category: c })));
    all.sort((a, b) => b.id - a.id);

    if (all.length === 0) {
        el.innerHTML = "<p style='text-align:center; opacity:0.5'>No formatted history</p>";
        return;
    }

    let curDate = "";
    all.forEach(exp => {
        if (exp.date !== curDate) {
            curDate = exp.date;
            el.innerHTML += `<h4 style="margin-top:20px; border-bottom:1px solid #333">${curDate}</h4>`;
        }
        el.innerHTML += `
            <div class="expense-item">
                <div style="display:flex; gap:10px; align-items:center;">
                     <span class="category-badge">${exp.category}</span>
                     <span>₹${exp.amount}</span>
                </div>
                 <button class="delete-btn" onclick="handleDeleteExpense('${exp.category}', ${exp.id})">✕</button>
            </div>
        `;
    });
}

function renderCharts() {
    if (typeof Chart === 'undefined') return;

    // 1. Category Chart
    const cvsCat = document.getElementById('categoryChart');
    if (cvsCat) {
        // Simple rebuild
        const chartStatus = Chart.getChart("categoryChart");
        if (chartStatus != undefined) chartStatus.destroy();

        const catTotals = categories.map(cat => {
            return (weekData.expenses[cat] || []).reduce((sum, e) => sum + e.amount, 0);
        });

        new Chart(cvsCat, {
            type: 'doughnut',
            data: {
                labels: categories.map(c => c.charAt(0).toUpperCase() + c.slice(1)),
                datasets: [{
                    data: catTotals,
                    backgroundColor: ['#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#3b82f6'],
                    borderWidth: 0
                }]
            },
            options: { responsive: true, plugins: { legend: { position: 'bottom', labels: { color: 'white' } } } }
        });
    }

    // 2. Trend Chart
    const cvsTrend = document.getElementById('dailyTrendChart');
    if (cvsTrend) {
        const chartStatus = Chart.getChart("dailyTrendChart");
        if (chartStatus != undefined) chartStatus.destroy();

        const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const dailyTotals = days.map(d => {
            let sum = 0;
            categories.forEach(cat => {
                (weekData.expenses[cat] || []).forEach(exp => {
                    if (exp.day === d) sum += exp.amount;
                });
            });
            return sum;
        });

        new Chart(cvsTrend, {
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
                plugins: { legend: { display: false } }
            }
        });
    }
}


// --- Interactions (Exposed to Global) ---

window.handleAddBudget = async () => {
    const input = document.getElementById("budget-input");
    const val = input.value;
    if (!val || isNaN(val)) return;

    // Add logic
    const newHistory = [...weekData.budgetHistory, { amount: Number(val), date: todayString, type: "add" }];
    weekData.budgetHistory = newHistory;
    input.value = "";

    render();
    await persistData({ budgetHistory: newHistory });
};

window.handleSetBudget = async () => {
    const input = document.getElementById("budget-input");
    const val = input.value;
    if (!val || isNaN(val)) return;

    if (!confirm("This will overwrite the current weekly budget total. Continue?")) return;

    // Set logic: Replace history with a single 'set' entry
    const newHistory = [{ amount: Number(val), date: todayString, type: "set" }];
    weekData.budgetHistory = newHistory;
    input.value = "";

    render();
    await persistData({ budgetHistory: newHistory });
};

window.handleAddExpense = async (category) => {
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

    weekData.expenses[category] = [...(weekData.expenses[category] || []), newExpense];

    input.value = "";
    render();
    await persistData({ expenses: weekData.expenses });
};

window.handleDeleteExpense = async (category, id) => {
    if (!confirm("Delete this?")) return;
    weekData.expenses[category] = weekData.expenses[category].filter(e => e.id !== id);
    render();
    // Update timeline if open
    if (document.getElementById("timeline-view").style.display === "block") renderTimeline();

    await persistData({ expenses: weekData.expenses });
};


// View Switching
window.showView = (id) => {
    ["weekly-view", "timeline-view", "analytics-view", "monthly-view", "all-weeks-view"].forEach(v => {
        const el = document.getElementById(v);
        if (el) el.style.display = (v === id) ? "block" : "none";
    });
    window.scrollTo(0, 0);

    if (id === "timeline-view") renderTimeline();
    if (id === "analytics-view") renderCharts();
    if (id === "all-weeks-view") renderAllWeeks();
};

async function renderAllWeeks() {
    const container = document.getElementById("all-weeks-container");
    container.innerHTML = "<p style='text-align:center; opacity:0.5;'>Loading...</p>";

    const res = await getAllWeeksData();
    if (!res.success || !res.data) {
        container.innerHTML = "<p style='text-align:center; opacity:0.5;'>No data found</p>";
        return;
    }

    const weeksObj = res.data;
    const weekKeys = Object.keys(weeksObj).sort((a, b) => new Date(b) - new Date(a));

    if (weekKeys.length === 0) {
        container.innerHTML = "<p style='text-align:center; opacity:0.5;'>No weeks found</p>";
        return;
    }

    container.innerHTML = "";

    weekKeys.forEach(wkId => {
        const wd = weeksObj[wkId];

        // Ensure wd.expenses is formatted correctly (same as migrateAndSanitize)
        if (!wd.expenses || typeof wd.expenses !== 'object') wd.expenses = {};

        let localTotal = 0;
        let cHTML = "";

        categories.forEach(cat => {
            // Support old and new format for processing
            let catArr = wd.expenses[cat] || [];
            if (wd[cat] !== undefined) {
                const toAdd = Array.isArray(wd[cat]) ? wd[cat] : [wd[cat]];
                catArr = [...catArr, ...toAdd];
            }

            const catSum = catArr.reduce((sum, e) => sum + (e ? (e.amount || 0) : 0), 0);
            localTotal += catSum;

            if (catSum > 0) {
                cHTML += `
                    <div style="display:flex; justify-content:space-between; font-size: 14px; margin-bottom: 4px;">
                        <span style="color:#aaa; text-transform:capitalize;">${cat}</span>
                        <span>₹${catSum}</span>
                    </div>
                `;
            }
        });

        const bHistory = wd.budgetHistory || [];
        const wkBudget = bHistory.reduce((s, it) => s + (it ? (it.amount || 0) : 0), 0);

        // Date formatting, assuming wkId is "YYYY-MM-DD"
        const dObj = new Date(wkId);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        const dStr = isNaN(dObj) ? wkId : dObj.toLocaleDateString(undefined, options);

        container.innerHTML += `
            <div class="expense-box" style="margin-bottom: 20px;">
                <h3 style="margin-bottom: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 8px;">Week of ${dStr}</h3>
                <div style="display:flex; justify-content:space-between; margin-bottom: 10px;">
                    <span style="color:var(--success);">Budget: ₹${wkBudget}</span>
                    <span style="color:${localTotal > wkBudget && wkBudget > 0 ? 'var(--danger)' : 'white'};">Spent: ₹${localTotal}</span>
                </div>
                ${cHTML === "" ? "<p style='color:#666; font-size:12px;'>No expenses recorded</p>" : cHTML}
            </div>
        `;
    });
}


// Init
init();
