import { useState } from "react";
import "./App.css";

const categories = ["food", "petrol", "things", "snacks"];

export default function App() {
  const [budget, setBudget] = useState("");
  const [showView, setShowView] = useState(false);
  const [showMonthly, setShowMonthly] = useState(false);

  const [expenses, setExpenses] = useState({
    food: "",
    petrol: "",
    things: "",
    snacks: "",
  });

  const handleChange = (cat, val) => {
    setExpenses({ ...expenses, [cat]: val });
  };

  const dailyExpense =
    Number(expenses.food || 0) +
    Number(expenses.petrol || 0) +
    Number(expenses.things || 0) +
    Number(expenses.snacks || 0);

  const weeklyExpense = dailyExpense;
  const balance = Number(budget || 0) - weeklyExpense;
  const monthlyExpense = weeklyExpense * 4;

  return (
    <div className="container">
      {/* Top bar */}
      <div className="top-bar">
        <h2>Expense Manager</h2>

        <div className="view-menu" onClick={() => setShowView(!showView)}>
          View ⌄
          {showView && (
            <div className="view-box">
              <p onClick={() => setShowMonthly(!showMonthly)}>
                Monthly Expense
              </p>
              <p>Download Excel</p>
            </div>
          )}
        </div>
      </div>

      {/* Weekly Budget */}
      <div className="card budget-box">
        <label>Weekly Budget</label>
        <div style={{ display: "flex", alignItems: "center" }}>
          <span>₹</span>
          <input
            type="number"
            placeholder="Enter amount"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
          />
        </div>
      </div>

      {/* Categories */}
      <div className="card">
        {categories.map((cat) => (
          <div className="category-row" key={cat}>
            <span>{cat}</span>
            <input
              type="number"
              placeholder="₹"
              value={expenses[cat]}
              onChange={(e) => handleChange(cat, e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="card summary">
        <p>Daily Expense: ₹{dailyExpense}</p>
        <p>Weekly Expense: ₹{weeklyExpense}</p>
        <p>Balance: ₹{balance}</p>

        {showMonthly && <p>Monthly Expense: ₹{monthlyExpense}</p>}
      </div>
    </div>
  );
}
