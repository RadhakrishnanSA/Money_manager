import { useEffect, useState } from "react";
import "./App.css";

const categories = ["Food", "Petrol", "Things", "Snacks"];

export default function App() {
  const [expenses, setExpenses] = useState({
    Food: "",
    Petrol: "",
    Things: "",
    Snacks: "",
  });

  const [savedData, setSavedData] = useState(
    JSON.parse(localStorage.getItem("expenses")) || []
  );

  const [showView, setShowView] = useState(false);
  const [time, setTime] = useState("");

  // Live Time
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

  const totalToday = Object.values(expenses).reduce(
    (a, b) => a + Number(b || 0),
    0
  );

  const monthlyExpense = savedData.reduce(
    (sum, item) => sum + item.total,
    0
  );

  const saveData = () => {
    const entry = {
      date: new Date().toLocaleDateString(),
      time,
      ...expenses,
      total: totalToday,
    };

    const updated = [...savedData, entry];
    setSavedData(updated);
    localStorage.setItem("expenses", JSON.stringify(updated));

    setExpenses({ Food: "", Petrol: "", Things: "", Snacks: "" });
    alert("Saved Successfully ✅");
  };

  const downloadExcel = () => {
    let csv =
      "Date,Time,Food,Petrol,Things,Snacks,Total\n";

    savedData.forEach((d) => {
      csv += `${d.date},${d.time},${d.Food},${d.Petrol},${d.Things},${d.Snacks},${d.total}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Monthly_Expense.csv";
    a.click();
  };

  return (
    <div className="app">
      <div className="time-box">{time}</div>

      <h1>Expense Tracker</h1>

      <div className="card">
        {categories.map((cat) => (
          <div key={cat} className="row">
            <label>{cat}</label>
            <input
              type="number"
              value={expenses[cat]}
              onChange={(e) =>
                setExpenses({ ...expenses, [cat]: e.target.value })
              }
              placeholder="₹"
            />
          </div>
        ))}
      </div>

      <p className="total">Today Expense: ₹{totalToday}</p>

      <button className="btn" onClick={saveData}>
        Save
      </button>

      <button className="btn view" onClick={() => setShowView(!showView)}>
        View
      </button>

      {showView && (
        <div className="view-box">
          <p>Monthly Expense: ₹{monthlyExpense}</p>
          <button className="btn" onClick={downloadExcel}>
            Download Excel
          </button>
        </div>
      )}
    </div>
  );
}
