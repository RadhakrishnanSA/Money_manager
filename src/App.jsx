import { useState, useEffect } from "react";
import "./App.css";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function App() {
  const [budget, setBudget] = useState(0);
  const [dateTime, setDateTime] = useState("");

  const [data, setData] = useState(
    days.map(() => ({
      food: 0,
      petrol: 0,
      things: 0,
      snacks: 0,
    }))
  );

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const date = now.toLocaleDateString();
      const time = now.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      });
      setDateTime(`${date} | ${time}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (dayIndex, field, value) => {
    const updated = [...data];
    updated[dayIndex][field] = Number(value);
    setData(updated);
  };

  const dayTotal = (d) =>
    d.food + d.petrol + d.things + d.snacks;

  const weeklyExpense = data.reduce(
    (sum, d) => sum + dayTotal(d),
    0
  );

  const balance = budget - weeklyExpense;
  const monthlyExpense = weeklyExpense * 4;

  return (
    <div className="container">
      <h1>💰 Money Manager</h1>
      <div className="datetime">{dateTime}</div>

      <div className="card">
        <label className="budget-label">Weekly Budget (₹)</label>
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(Number(e.target.value))}
        />
      </div>

      {days.map((day, index) => (
        <div className="card" key={day}>
          <h3 className="day-title">{day}</h3>

          {["food", "petrol", "things", "snacks"].map((cat) => (
            <div className="row" key={cat}>
              <span>{cat}</span>
              <input
                type="number"
                onChange={(e) =>
                  handleChange(index, cat, e.target.value)
                }
              />
            </div>
          ))}

          <p className="total">
            Day Total: ₹{dayTotal(data[index])}
          </p>
        </div>
      ))}

      <div className="summary">
        <p>Weekly Expense: ₹{weeklyExpense}</p>
        <p>Balance: ₹{balance}</p>
        <p>Monthly Expense: ₹{monthlyExpense}</p>
      </div>
    </div>
  );
}

export default App;
