import { useState, useEffect } from "react";
import { saveWeekData, getWeekData, updateWeekData } from "./firebase";
import "./App.css";

const categories = ["food", "petrol", "things", "snacks"];

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

export default function App() {
  const today = new Date();
  const todayString = today.toLocaleDateString();
  const weekId = getWeekId(today);
  const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][today.getDay()];

  const [page, setPage] = useState("weekly");
  const [weekData, setWeekData] = useState({
    weekStartDate: getWeekStart(today).toISOString().split("T")[0],
    budgetHistory: [],
    groceries: { amount: 0, lastUpdated: null },
    expenses: {
      food: [],
      petrol: [],
      things: [],
      snacks: [],
    },
    allExpenses: [],
  });

  const [budgetInput, setBudgetInput] = useState("");
  const [expenseInputs, setExpenseInputs] = useState({
    food: "",
    petrol: "",
    things: "",
    snacks: "",
  });
  const [groceriesInput, setGroceriesInput] = useState("");
  const [editingExpense, setEditingExpense] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const result = await getWeekData(weekId);
      if (result.success && result.data) {
        setWeekData(result.data);
      } else {
        // Initialize new week
        const initialData = {
          weekStartDate: getWeekStart(today).toISOString().split("T")[0],
          budgetHistory: [],
          groceries: { amount: 0, lastUpdated: null },
          expenses: {
            food: [],
            petrol: [],
            things: [],
            snacks: [],
          },
          allExpenses: [],
        };
        setWeekData(initialData);
        await saveWeekData(weekId, initialData);
      }
      setLoading(false);
    };
    loadData();
  }, [weekId]);

  // Calculate totals
  const getTotalBudget = () => {
    return weekData.budgetHistory.reduce((sum, item) => sum + item.amount, 0);
  };

  const getTotalExpenses = () => {
    let total = 0;
    categories.forEach((cat) => {
      total += weekData.expenses[cat].reduce((sum, exp) => sum + exp.amount, 0);
    });
    total += weekData.groceries.amount;
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

  // Add budget amount
  const handleAddBudget = async () => {
    if (!budgetInput || isNaN(budgetInput)) return;
    const newHistory = [
      ...weekData.budgetHistory,
      { amount: Number(budgetInput), date: todayString, type: "add" },
    ];
    const updated = { ...weekData, budgetHistory: newHistory };
    setWeekData(updated);
    await updateWeekData(weekId, { budgetHistory: newHistory });
    setBudgetInput("");
  };

  // Add expense
  const handleAddExpense = async (category) => {
    if (!expenseInputs[category] || isNaN(expenseInputs[category])) return;
    const amount = Number(expenseInputs[category]);
    const newExpense = {
      id: Date.now(),
      amount,
      date: todayString,
      day: dayOfWeek,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const newExpenses = {
      ...weekData.expenses,
      [category]: [...weekData.expenses[category], newExpense],
    };
    const newAllExpenses = [...weekData.allExpenses, { ...newExpense, category }];
    const updated = { ...weekData, expenses: newExpenses, allExpenses: newAllExpenses };
    setWeekData(updated);
    await updateWeekData(weekId, { expenses: newExpenses, allExpenses: newAllExpenses });
    setExpenseInputs({ ...expenseInputs, [category]: "" });
  };

  // Add/Update groceries
  const handleAddGroceries = async () => {
    if (!groceriesInput || isNaN(groceriesInput)) return;
    const newAmount = weekData.groceries.amount + Number(groceriesInput);
    const newGroceries = { amount: newAmount, lastUpdated: todayString };
    const updated = { ...weekData, groceries: newGroceries };
    setWeekData(updated);
    await updateWeekData(weekId, { groceries: newGroceries });
    setGroceriesInput("");
  };

  // Edit expense
  const handleEditExpense = async (category, expenseId, newAmount) => {
    if (!newAmount || isNaN(newAmount)) return;
    const updatedExpenses = {
      ...weekData.expenses,
      [category]: weekData.expenses[category].map((exp) =>
        exp.id === expenseId ? { ...exp, amount: Number(newAmount) } : exp
      ),
    };
    const updatedAllExpenses = weekData.allExpenses.map((exp) =>
      exp.id === expenseId ? { ...exp, amount: Number(newAmount) } : exp
    );
    const updated = { ...weekData, expenses: updatedExpenses, allExpenses: updatedAllExpenses };
    setWeekData(updated);
    await updateWeekData(weekId, { expenses: updatedExpenses, allExpenses: updatedAllExpenses });
    setEditingExpense(null);
    setEditValue("");
  };

  // Delete expense
  const handleDeleteExpense = async (category, expenseId) => {
    const updatedExpenses = {
      ...weekData.expenses,
      [category]: weekData.expenses[category].filter((exp) => exp.id !== expenseId),
    };
    const updatedAllExpenses = weekData.allExpenses.filter((exp) => exp.id !== expenseId);
    const updated = { ...weekData, expenses: updatedExpenses, allExpenses: updatedAllExpenses };
    setWeekData(updated);
    await updateWeekData(weekId, { expenses: updatedExpenses, allExpenses: updatedAllExpenses });
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;

  return (
    <div className="container">
      <div className="date-box">
        <span>{todayString}</span>
        <span style={{ marginLeft: "10px" }}>{dayOfWeek}</span>
      </div>

      <h1>💰 Money Management</h1>

      {page === "weekly" && (
        <>
          {/* Weekly Budget Section */}
          <div className="section">
            <h3>Weekly Budget</h3>
            <div className="week-box">
              <h2 className={getStatusColor()}>₹ {getTotalBudget()}</h2>
            </div>
            <div className="add-input-group">
              <input
                type="number"
                placeholder="Add amount ₹"
                value={budgetInput}
                onChange={(e) => setBudgetInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddBudget()}
              />
              <button onClick={handleAddBudget}>Add</button>
            </div>
          </div>

          {/* Groceries Section */}
          <div className="section">
            <h3>Groceries (Constant All Week)</h3>
            <div className="week-box">
              <h2>₹ {weekData.groceries.amount}</h2>
              {weekData.groceries.lastUpdated && <p style={{ fontSize: "12px", opacity: 0.7 }}>Last updated: {weekData.groceries.lastUpdated}</p>}
            </div>
            <div className="add-input-group">
              <input
                type="number"
                placeholder="Add amount ₹"
                value={groceriesInput}
                onChange={(e) => setGroceriesInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAddGroceries()}
              />
              <button onClick={handleAddGroceries}>Add</button>
            </div>
          </div>

          {/* Daily Expenses Section */}
          <div className="section">
            <h3>Daily Expenses</h3>
            <div className="expense-grid">
              {categories.map((cat) => (
                <div key={cat} className="expense-box">
                  <h4>{cat}</h4>
                  <div className="add-input-group">
                    <input
                      type="number"
                      placeholder={`+₹`}
                      value={expenseInputs[cat]}
                      onChange={(e) => setExpenseInputs({ ...expenseInputs, [cat]: e.target.value })}
                      onKeyPress={(e) => e.key === "Enter" && handleAddExpense(cat)}
                    />
                    <button onClick={() => handleAddExpense(cat)}>Add</button>
                  </div>
                  <div className="expense-list">
                    {weekData.expenses[cat].map((exp) => (
                      <div key={exp.id} className="expense-item">
                        <div>
                          <span>{exp.time}</span>
                          <span className="expense-amount">₹{exp.amount}</span>
                        </div>
                        {exp.date === todayString && (
                          <div className="expense-actions">
                            <button
                              className="edit-btn"
                              onClick={() => {
                                setEditingExpense({ category: cat, id: exp.id });
                                setEditValue(exp.amount);
                              }}
                            >
                              ✎
                            </button>
                            <button
                              className="delete-btn"
                              onClick={() => handleDeleteExpense(cat, exp.id)}
                            >
                              ✕
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                    {editingExpense?.category === cat && (
                      <div className="edit-input-group">
                        <input
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyPress={(e) =>
                            e.key === "Enter" &&
                            handleEditExpense(cat, editingExpense.id, editValue)
                          }
                        />
                        <button onClick={() => handleEditExpense(cat, editingExpense.id, editValue)}>
                          Save
                        </button>
                        <button onClick={() => setEditingExpense(null)}>Cancel</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Section */}
          <div className="section summary-section">
            <h3>Weekly Summary</h3>
            <div className="summary">
              <p>Total Budget: ₹{getTotalBudget()}</p>
              <p>Total Expenses: ₹{getTotalExpenses()}</p>
              <p className={`balance ${getStatusColor()}`}>
                Balance: ₹{getBalance()}
              </p>
            </div>
            <button className="view-btn" onClick={() => setPage("monthly")}>
              📊 View All Data
            </button>
          </div>
        </>
      )}

      {page === "monthly" && (
        <>
          <div className="header-back">
            <button className="back-btn" onClick={() => setPage("weekly")}>
              ← Back
            </button>
            <h2>All Expenses</h2>
          </div>

          <div className="section">
            <div className="summary">
              <p>Total Budget: ₹{getTotalBudget()}</p>
              <p>Total Expenses: ₹{getTotalExpenses()}</p>
              <p className={`balance ${getStatusColor()}`}>
                Balance: ₹{getBalance()}
              </p>
            </div>
          </div>

          <div className="section">
            <h3>Expense Details</h3>
            <div className="expense-details">
              {weekData.allExpenses.length > 0 ? (
                weekData.allExpenses.map((exp) => (
                  <div key={exp.id} className="detail-row">
                    <span>{exp.day} - {exp.time}</span>
                    <span className="category-badge">{exp.category}</span>
                    <span>₹{exp.amount}</span>
                  </div>
                ))
              ) : (
                <p>No expenses recorded</p>
              )}
            </div>
          </div>

          <div className="section">
            <h3>Category Breakdown</h3>
            {categories.map((cat) => {
              const total = weekData.expenses[cat].reduce((sum, exp) => sum + exp.amount, 0);
              return (
                <div key={cat} className="category-row">
                  <span>{cat}</span>
                  <span>₹{total}</span>
                </div>
              );
            })}
            <div className="category-row groceries-row">
              <span>Groceries</span>
              <span>₹{weekData.groceries.amount}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
