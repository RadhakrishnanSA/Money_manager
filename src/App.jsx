import { useState } from "react";
import { supabase } from "./supabase";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./App.css";

const categories = ["food", "petrol", "things", "snacks"];

export default function App() {
  const today = new Date();
  const date = today.toLocaleDateString();

  const [page, setPage] = useState("weekly");
  const [budget, setBudget] = useState(0);
  const [expenses, setExpenses] = useState({
    food: 0,
    petrol: 0,
    things: 0,
    snacks: 0,
  });

  const handleChange = (cat, val) =>
    setExpenses({ ...expenses, [cat]: Number(val) });

  const dailyExpense =
    expenses.food + expenses.petrol + expenses.things + expenses.snacks;

  const weeklyExpense = dailyExpense;
  const balance = budget - weeklyExpense;

  const statusColor =
    weeklyExpense > budget
      ? "red"
      : balance > 0
      ? "gold"
      : "green";

  const saveData = async () => {
    const { error } = await supabase.from("daily_expenses").insert([
      {
        date,
        ...expenses,
        daily_expense: dailyExpense,
        weekly_expense: weeklyExpense,
        balance,
      },
    ]);
    if (error) alert("Error saving data");
    else alert("Saved ✅");
  };

  const exportExcel = async () => {
    const { data } = await supabase.from("daily_expenses").select("*");
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    saveAs(new Blob([excelBuffer]), "Expenses.xlsx");
  };

  return (
    <div className="container">
      <div className="date-box">{date}</div>

      <h1>Money Management</h1>

      {page === "weekly" && (
        <>
          <div className="week-box">
            <span>Weekly Expense</span>
            <h2 className={statusColor}>₹ {weeklyExpense}</h2>
          </div>

          <input
            type="number"
            placeholder="Weekly Budget ₹"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
          />

          <div className="expense-grid">
            {categories.map((cat) => (
              <div key={cat} className="expense-box">
                <input
                  type="number"
                  placeholder={cat}
                  onChange={(e) => handleChange(cat, e.target.value)}
                />
              </div>
            ))}
          </div>

          <div className="summary">
            <p>Daily Expense: ₹{dailyExpense}</p>
            <p>Balance: ₹{balance}</p>
          </div>

          <div className="bottom-buttons">
            <button onClick={saveData}>Save</button>
            <button onClick={() => setPage("monthly")}>View</button>
          </div>
        </>
      )}

      {page === "monthly" && (
        <>
          <div className="week-box">
            <span>Monthly Expense</span>
            <h2>₹ {weeklyExpense * 4}</h2>
          </div>

          <div className="bottom-buttons">
            <button onClick={() => setPage("weekly")}>Back</button>
            <button onClick={exportExcel}>Download Excel</button>
          </div>
        </>
      )}
    </div>
  );
}
