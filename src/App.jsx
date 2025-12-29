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
  const [viewMonthly, setViewMonthly] = useState(false);

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

  const dailyExpense =
    expenses.food +
    expenses.petrol +
    expenses.things +
    expenses.snacks;

  const weeklyExpense = dailyExpense; // single day entry
  const balance = budget - weeklyExpense;
  const monthlyExpense = weeklyExpense * 4;

  /* MONTHLY VIEW */
  if (viewMonthly) {
    return (
      <div className="container">
        <div className="date-box">{todayDate}</div>

        <h1>📅 Monthly Expense</h1>

        <div className="card summary">
          <p>Monthly Expense: ₹{monthlyExpense}</p>
        </div>

        <button onClick={() => setViewMonthly(false)}>
          ⬅ Back
        </button>
      </div>
    );
  }

  /* DAILY VIEW */
  return (
    <div className="container">
      <div className="date-box">{todayDate}</div>

      <h1>💰 Money Manager</h1>

      <div className="card">
        <label style={{ fontWeight: "bold" }}>
          Weekly Budget (₹)
        </label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
        />
      </div>

      <div className="card">
        <h2>{todayName}</h2>

        {categories.map((cat) => (
          <div className="row" key={cat}>
            <span>{cat}</span>
            <input
              type="number"
              onChange={(e) =>
                handleChange(cat, e.target.value)
              }
            />
          </div>
        ))}
      </div>

      <div className="card summary">
        <p>Daily Expense: ₹{dailyExpense}</p>
        <p>Weekly Expense: ₹{weeklyExpense}</p>
        <p>Balance: ₹{balance}</p>
      </div>

      <button onClick={() => setViewMonthly(true)}>
        View Monthly Expense
      </button>
    </div>
  );
}

export default App;
