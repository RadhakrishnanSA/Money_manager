import { useState } from "react";
import "./App.css";

function App() {
  const [weeklyAmount, setWeeklyAmount] = useState(0);
  const [expenses, setExpenses] = useState({
    food: 0,
    petrol: 0,
    things: 0,
    snacks: 0,
  });

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setExpenses({ ...expenses, [name]: Number(value) });
  };

  const totalWeeklyExpense =
    expenses.food +
    expenses.petrol +
    expenses.things +
    expenses.snacks;

  const balance = weeklyAmount - totalWeeklyExpense;
  const monthlyExpense = totalWeeklyExpense * 4;

  return (
    <div className="container">
      <h1>Money Manager</h1>

      <div className="card">
        <label>Weekly Amount Given</label>
        <input
          type="number"
          placeholder="Enter weekly amount"
          onChange={(e) => setWeeklyAmount(Number(e.target.value))}
        />
      </div>

      <div className="card">
        <h2>Weekly Expenses</h2>

        <input
          type="number"
          name="food"
          placeholder="Food Expense"
          onChange={handleExpenseChange}
        />

        <input
          type="number"
          name="petrol"
          placeholder="Petrol Expense"
          onChange={handleExpenseChange}
        />

        <input
          type="number"
          name="things"
          placeholder="Things Expense"
          onChange={handleExpenseChange}
        />

        <input
          type="number"
          name="snacks"
          placeholder="Snacks Expense"
          onChange={handleExpenseChange}
        />
      </div>

      <div className="result">
        <p><strong>Total Weekly Expense:</strong> ₹{totalWeeklyExpense}</p>
        <p><strong>Weekly Balance:</strong> ₹{balance}</p>
        <p><strong>Monthly Expense:</strong> ₹{monthlyExpense}</p>
      </div>
    </div>
  );
}

export default App;

