import { useState } from "react";
import { supabase } from "./supabase";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "./App.css";

const categories = ["food", "petrol", "things", "snacks"];

export default function App() {
  const today = new Date();
  const date = today.toLocaleDateString();
  const time = today.toLocaleTimeString("en-US", { hour12: true });

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

  // 🔹 SAVE TO SUPABASE
  const saveData = async () => {
    const { error } = await supabase.from("daily_expenses").insert([
      {
        date,
        time,
        ...expenses,
        daily_expense: dailyExpense,
        weekly_expense: weeklyExpense,
        balance,
      },
    ]);

    if (error) {
      alert("Error saving data");
      console.error(error);
    } else {
      alert("Data saved successfully ✅");
    }
  };

  // 🔹 EXPORT TO EXCEL
  const exportExcel = async () => {
    const { data } = await supabase.from("daily_expenses").select("*");

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const file = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(file, "Daily_Expenses.xlsx");
  };

  return (
    <div className="container">
      <div className="date-box">{date}</div>

      <h1>Money Manager</h1>

      <input
        type="number"
        placeholder="Weekly Budget"
        value={budget}
        onChange={(e) => setBudget(Number(e.target.value))}
      />

      {categories.map((cat) => (
        <input
          key={cat}
          type="number"
          placeholder={cat}
          onChange={(e) => handleChange(cat, e.target.value)}
        />
      ))}

      <p>Daily Expense: ₹{dailyExpense}</p>
      <p>Weekly Expense: ₹{weeklyExpense}</p>
      <p>Balance: ₹{balance}</p>

      <button onClick={saveData}>Save to Database</button>
      <button onClick={exportExcel}>Download Excel</button>
    </div>
  );
}
