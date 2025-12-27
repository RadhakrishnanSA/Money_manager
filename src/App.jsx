import { useState } from "react";
import "./App.css";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

function App() {
  const [budget, setBudget] = useState(0);
  const [week, setWeek] = useState(1);
  const [showSummary, setShowSummary] = useState(false);

  const [data, setData] = useState(
    days.map(() => ({
      food: 0,
      petrol: 0,
      things: 0,
      snacks: 0,
      saved: false,
    }))
  );

  const handleChange = (dayIndex, field, value) => {
    const updated = [...data];
    updated[dayIndex][field] = Number(value);
    setData(updated);
  };

  const saveDay = (index) => {
    const updated = [...data];
    updated[index].saved = true;
    setData(updated);
  };

  const dayTotal = (d) =>
    d.food + d.petrol + d.things + d.snacks;

  const weeklyExpense = data.reduce(
    (sum, d) => sum + dayTotal(d),
    0
  );

  const monthlyExpense = weeklyExpense * 4;
  const balance = budget - weeklyExpense;

  if (showSummary) {
    return (
      <div className="container">
        <h1>📊 Summary (Week {week})</h1>

        <div className="summary-box">
          <p>Weekly Budget: ₹{budget}</p>
          <p>Weekly Expense: ₹{weeklyExpense}</p>
          <p>Balance: ₹{balance}</p>
        </div>

        <div className="summary-box">
          <p>Monthly Expense: ₹{monthlyExpense}</p>
        </div>

        <button
          className="secondary"
          onClick={() => {
            setWeek(week + 1);
            setShowSummary(false);
            setData(
              days.map(() => ({
                food: 0,
                petrol: 0,
                things: 0,
                snacks: 0,
                saved: false,
              }))
            );
          }}
        >
          Next Week →
        </button>
      </div>
    );
  }

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

      {days.map((day, index) => (
        <div className="card" key={day}>
          <h3 className="day-title">{day}</h3>

          {["food", "petrol", "things", "snacks"].map((cat) => (
            <div className="row" key={cat}>
              <span>{cat}</span>
              <input
                type="number"
                disabled={data[index].saved}
                onChange={(e) =>
                  handleChange(index, cat, e.target.value)
                }
              />
            </div>
          ))}

          <button onClick={() => saveDay(index)}>
            {data[index].saved ? "Saved ✅" : "OK / Save Day"}
          </button>

          <p>Day Total: ₹{dayTotal(data[index])}</p>
        </div>
      ))}

      <button className="secondary" onClick={() => setShowSummary(true)}>
        Next → Summary
      </button>
    </div>
  );
}

export default App;
