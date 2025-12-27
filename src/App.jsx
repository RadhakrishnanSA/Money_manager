import { useState } from "react";
import "./App.css";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function App() {
  const [budget, setBudget] = useState(0);

  const [weekData, setWeekData] = useState(
    days.map(() => ({
      food: 0,
      petrol: 0,
      things: 0,
      snacks: 0,
      saved: false,
    }))
  );

  const handleChange = (dayIndex, field, value) => {
    const updated = [...weekData];
    updated[dayIndex][field] = Number(value);
    setWeekData(updated);
  };

  const saveDay = (dayIndex) => {
    const updated = [...weekData];
    updated[dayIndex].saved = true;
    setWeekData(updated);
  };

  const dayTotal = (day) =>
    day.food + day.petrol + day.things + day.snacks;

  const weeklyExpense = weekData.reduce(
    (sum, day) => sum + dayTotal(day),
    0
  );

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

      {days.map((day, index) => (
        <div className="card" key={day}>
          <h2>{day}</h2>

          <div className="row">
            <span>Food</span>
            <input
              type="number"
              disabled={weekData[index].saved}
              onChange={(e) =>
                handleChange(index, "food", e.target.value)
              }
            />
          </div>

          <div className="row">
            <span>Petrol</span>
            <input
              type="number"
              disabled={weekData[index].saved}
              onChange={(e) =>
                handleChange(index, "petrol", e.target.value)
              }
            />
          </div>

          <div className="row">
            <span>Things</span>
            <input
              type="number"
              disabled={weekData[index].saved}
              onChange={(e) =>
                handleChange(index, "things", e.target.value)
              }
            />
          </div>

          <div className="row">
            <span>Snacks</span>
            <input
              type="number"
              disabled={weekData[index].saved}
              onChange={(e) =>
                handleChange(index, "snacks", e.target.value)
              }
            />
          </div>

          <button onClick={() => saveDay(index)}>
            {weekData[index].saved ? "Saved ✅" : "OK / Save"}
          </button>

          <p className="total">
            Day Total: ₹{dayTotal(weekData[index])}
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
