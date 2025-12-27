import { useState, useEffect } from "react";
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

  const [budget, setBudget] = useState(0);
  const [dateTime, setDateTime] = useState("");
  const [expenses, setExpenses] = useState({
    food: 0,
    petrol: 0,
    things: 0,
    snacks: 0,
  });

  // Live Date & Time
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      setDateTime(`${date} | ${time}`);
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (field, value) => {
    setExpenses({
      ...expenses,
      [field]: Number(value),
    });
  };

  const dailyTotal =
    expenses.food +
    expenses.petrol +
    expenses.things +
    expenses.snacks;

  const weeklyExpense = dailyTotal;
  const balance = budget - weeklyExpense;
  const monthlyExpense = weeklyExpense * 4;

  return (
    <div className="container">
      <div className="datetime-box">{dateTime}</div>

      <h1>💰 Money Manager</h1>

      <div className="card">
        <label className="budget-label">Weekly Budget (₹)</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
        />
      </div>

      <div className="card">
        <h2 className="day-title">{todayName}</h2>

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

        <p><b>Today Total:</b> ₹{dailyTotal}</p>
      </div>

      <div className="summary">
        <p>Weekly Expense: ₹{weeklyExpense}</p>
        <p>Balance: ₹{balance}</p>
        <p>Monthly Expense: ₹{monthlyExpense}</p>
      </div>
    </div>
  );
}

export default App;
