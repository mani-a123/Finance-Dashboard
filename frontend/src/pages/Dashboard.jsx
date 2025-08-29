


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import Charts from "../components/Charts";
import { jwtDecode } from "jwt-decode";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [prediction, setPrediction] = useState(null); // 🔮 prediction state
  const [user, setUser] = useState(null); // to show user name
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    payment_method: "",
    note: "",
    txn_date: "",
  });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      setTransactions(res.data);
    } catch {
      navigate("/login");
    }
  };

  const fetchPrediction = async () => {
    try {
      const res = await API.get("/prediction"); // 👈 backend route
      setPrediction(res.data.prediction);
    } catch (err) {
      console.error("Prediction fetch failed", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded); // will contain { id, email, name }
      } catch (err) {
        console.error("Invalid token", err);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }

    fetchTransactions();
    fetchPrediction();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await API.put(`/transactions/${editingId}`, form);
      } else {
        await API.post("/transactions", form);
      }
      setForm({
        type: "expense",
        amount: "",
        category: "",
        payment_method: "",
        note: "",
        txn_date: "",
      });
      setEditingId(null);
      fetchTransactions();
      fetchPrediction(); // 🔄 update prediction after new txn
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (txn) => {
    setForm(txn);
    setEditingId(txn.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    await API.delete(`/transactions/${id}`);
    fetchTransactions();
    fetchPrediction();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black min-h-screen text-white">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-white tracking-wide drop-shadow-md">
          Welcome, {user?.name || "User"} 👋
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg shadow-lg transition duration-200 transform hover:scale-105 hover:shadow-red-500/50"
        >
          Logout
        </button>
      </div>
  
      {/* Prediction Box */}
      {prediction && (
        <div className="bg-purple-900 p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-purple-300">
            🔮 Predicted Next Month Expenses:
          </h2>
          <p className="text-2xl font-bold text-purple-100">₹ {prediction}</p>
        </div>
      )}
  
      {/* Transaction Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-2xl shadow-lg grid grid-cols-2 gap-4"
      >
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border border-gray-600 bg-gray-900 text-white p-2 rounded focus:ring-2 focus:ring-indigo-500"
        >
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <input
          type="number"
          step="0.01"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          placeholder="Amount"
          className="border border-gray-600 bg-gray-900 text-white p-2 rounded focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          className="border border-gray-600 bg-gray-900 text-white p-2 rounded focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          name="payment_method"
          value={form.payment_method}
          onChange={handleChange}
          placeholder="Payment Method"
          className="border border-gray-600 bg-gray-900 text-white p-2 rounded focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          name="note"
          value={form.note}
          onChange={handleChange}
          placeholder="Note"
          className="border border-gray-600 bg-gray-900 text-white p-2 rounded col-span-2 focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="date"
          name="txn_date"
          value={form.txn_date}
          onChange={handleChange}
          className="border border-gray-600 bg-gray-900 text-white p-2 rounded focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg shadow-lg hover:shadow-indigo-500/40 transition transform hover:scale-105"
        >
          {editingId ? "Update" : "Add Transaction"}
        </button>
      </form>
  
      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-white border border-gray-700 bg-gray-900 rounded-lg shadow-lg">
          <thead>
            <tr className="bg-gray-700 text-indigo-200">
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Type</th>
              <th className="border px-2 py-1">Category</th>
              <th className="border px-2 py-1">Amount</th>
              <th className="border px-2 py-1">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="border px-2 py-1">{t.txn_date}</td>
                  <td
                    className={`border px-2 py-1 font-semibold ${
                      t.type === "income" ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {t.type}
                  </td>
                  <td className="border px-2 py-1">{t.category}</td>
                  <td className="border px-2 py-1">₹{t.amount}</td>
                  <td className="border px-2 py-1 space-x-2">
                    <button
                      onClick={() => handleEdit(t)}
                      className="bg-yellow-500 hover:bg-yellow-600 px-3 py-1 rounded text-black font-semibold transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-400">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
  
      {/* Charts + Prediction */}
      <Charts />
    </div>
  );
  
}
