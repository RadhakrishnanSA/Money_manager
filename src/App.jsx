import { useState } from "react";
import "./App.css";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function App() {
  const [budget, setBudget] = useState(0);

  const [expenses, setExpenses] = useState({
    food: Array(7).fill(0),
    petrol: Array(7).fill(0),
    things: Array(7).fill(0),
    snacks: Array(7).fill(0),
  });

  const handleChange = (category, index, value) => {
    const updated = [...expenses[category]];
    updated[index] = Number(value);

    setExpenses({
      ...expenses,
      [category]: updated,
    });
  };

  const categoryTotal = (category) =>
    expenses[category].reduce((a, b) => a + b, 0);

  const weeklyExpense =
    categoryTotal("food") +
    categoryTotal("petrol") +
    categoryTotal("things") +
    categoryTotal("snacks");

  const balance = budget - weeklyExpense;
  const monthlyExpense = weeklyExpense * 4;

  return (
    <div className="container">
      <h1>💰 Money Manager</h1>

      <div className="card">
        <label>Weekly Budget (₹)</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
        />
      </div>

      {["food", "petrol", "things", "snacks"].map((cat) => (
        <div className="card" key={cat}>
          <h2>{cat.toUpperCase()}</h2>
          {days.map((day, index) => (
            <div className="row" key={day}>
              <span>{day}</span>
              <input
                type="number"
                onChange={(e) =>
                  handleChange(cat, index, e.target.value)
                }
              />
            </div>
          ))}
          <p className="total">
            {cat} Total: ₹{categoryTotal(cat)}
          </p>
        </div>
      ))}

      <div className="summary">
        <h2>Summary</h2>
        <p>Weekly Expense: ₹{weeklyExpense}</p>
        <p>Balance: ₹{balance}</p>
        <p>Monthly Expense: ₹{monthlyExpense}</p>
      </div>
    </div>
  );
}

export default App;
