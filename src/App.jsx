import { useState } from "react";
import "./App.css";

const categories = ["food", "petrol", "things", "snacks"];
const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

function App() {
  const today = new Date();
  const todayName = dayNames[today.getDay()];
  const todayDate = today.toLocaleDateString();

  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState({
    food: 0,
    petrol: 0,
    things: 0,
    snacks: 0,
  });

  const handleChange = (field, value) => {
    setExpenses({
      ...expenses,
      [field]: Number(value),
    });
  };

  const clearData = () => {
    setExpenses({
      food: 0,
      petrol: 0,
      things: 0,
      snacks: 0,
    });
    setBudget(0);
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
      <div className="date-box">{todayDate}</div>

      <div className="header">
        <h1>Money Manager</h1>
      </div>

      <div className="grid">
        {/* LEFT */}
        <div>
          <div className="card">
            <label>Weekly Budget (₹)</label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
            />
          </div>

          <div className="card" style={{ marginTop: "15px" }}>
            <div className="day-title">{todayName}</div>

            {categories.map((cat) => (
              <div className="row" key={cat}>
                <span>{cat}</span>
                <input
                  type="number"
                  value={expenses[cat]}
                  onChange={(e) =>
                    handleChange(cat, e.target.value)
                  }
                />
              </div>
            ))}

            <div className="actions">
              <button className="clear" onClick={clearData}>
                Clear
              </button>
              <button className="submit">
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="card summary">
          <label>Output</label>
          <p>Daily Expense: ₹{dailyExpense}</p>
          <p>Weekly Expense: ₹{weeklyExpense}</p>
          <p>Balance: ₹{balance}</p>
          <p>Monthly Expense: ₹{monthlyExpense}</p>
        </div>
      </div>
    </div>
  );
}

export default App;
