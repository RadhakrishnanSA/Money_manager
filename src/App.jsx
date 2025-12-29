import { useState } from "react";
import "./App.css";

const categories = ["food", "petrol", "things", "snacks"];

function App() {
  const today = new Date().toLocaleDateString();

  const [budget, setBudget] = useState(0);
  const [showMonthly, setShowMonthly] = useState(false);

  const [expenses, setExpenses] = useState({
    food: 0,
    petrol: 0,
    things: 0,
    snacks: 0,
  });

  const handleChange = (cat, value) => {
    setExpenses({ ...expenses, [cat]: Number(value) });
  };

  const dailyExpense =
    expenses.food +
    expenses.petrol +
    expenses.things +
    expenses.snacks;

  const weeklyExpense = dailyExpense;
  const balance = budget - weeklyExpense;
  const monthlyExpense = weeklyExpense * 4;

  return (
    <div className="container">
      <div className="date-box">{today}</div>

      <h1>Money Manager</h1>

      <div className="card">
        <label>Weekly Budget (₹)</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
        />
      </div>

      <div className="card">
        {categories.map((cat) => (
          <div className="row" key={cat}>
            <span>{cat}</span>
            <input
              type="number"
              value={expenses[cat]}
              onChange={(e) => handleChange(cat, e.target.value)}
            />
          </div>
        ))}
      </div>

      <div className="card summary">
        <p>Daily Expense: ₹{dailyExpense}</p>
        <p>Weekly Expense: ₹{weeklyExpense}</p>
        <p>Balance: ₹{balance}</p>

        {!showMonthly && (
          <button onClick={() => setShowMonthly(true)}>
            View Monthly Expense
          </button>
        )}

        {showMonthly && <p>Monthly Expense: ₹{monthlyExpense}</p>}
      </div>
    </div>
  );
}

export default App;
