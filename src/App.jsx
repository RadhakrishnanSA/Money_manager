import { useEffect, useState } from "react";
import "./App.css";

const categories = ["Food", "Petrol", "Things", "Snacks"];

function App() {
  const [time, setTime] = useState("");
  const [budget, setBudget] = useState("");
  const [expenses, setExpenses] = useState({
    Food: "",
    Petrol: "",
    Things: "",
    Snacks: "",
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleChange = (cat, value) => {
    setExpenses({ ...expenses, [cat]: value });
  };

  const dailyExpense = Object.values(expenses).reduce(
    (a, b) => a + Number(b || 0),
    0
  );

  const balance = budget - dailyExpense;
  const weeklyExpense = dailyExpense * 7;

  const saveData = () => {
    const data = {
      date: new Date().toLocaleDateString(),
      time,
      budget,
      expenses,
      dailyExpense,
      weeklyExpense,
      balance,
    };

    localStorage.setItem("money_manager_data", JSON.stringify(data));
    alert("✅ Data Saved Successfully");
  };

  return (
    <div className="container">
      <div className="header">
        <h2>💰 Money Manager</h2>
        <div className="time-box">{time}</div>
      </div>

      <div className="budget-box">
        <label>Weekly Budget (₹)</label>
        <input
          type="number"
          placeholder="Enter budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
      </div>

      {categories.map((cat) => (
        <div className="card" key={cat}>
          <h3>{cat}</h3>
          <div className="row">
            <span>Amount</span>
            <input
              type="number"
              placeholder="₹"
              value={expenses[cat]}
              onChange={(e) => handleChange(cat, e.target.value)}
            />
          </div>
        </div>
      ))}

      <div className="summary">
        <p>Daily Expense: ₹{dailyExpense}</p>
        <p>Weekly Expense: ₹{weeklyExpense}</p>
        <p>Balance: ₹{balance}</p>
      </div>

      <button className="save-btn" onClick={saveData}>
        Save to Database
      </button>
    </div>
  );
}

export default App;
