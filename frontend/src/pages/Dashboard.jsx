// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../api";
// import Charts from "../components/Charts";

// export default function Dashboard() {
//   const [transactions, setTransactions] = useState([]);
//   const [form, setForm] = useState({
//     type: "expense",
//     amount: "",
//     category: "",
//     payment_method: "",
//     note: "",
//     txn_date: "",
//   });
//   const [editingId, setEditingId] = useState(null);
//   const navigate = useNavigate();

//   const fetchTransactions = () => {
//     API.get("/transactions")
//       .then((res) => setTransactions(res.data))
//       .catch(() => navigate("/login"));
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, []);

//   const handleChange = (e) =>
//     setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       if (editingId) {
//         await API.put(`/transactions/${editingId}`, form);
//       } else {
//         await API.post("/transactions", form);
//       }
//       setForm({
//         type: "expense",
//         amount: "",
//         category: "",
//         payment_method: "",
//         note: "",
//         txn_date: "",
//       });
//       setEditingId(null);
//       fetchTransactions();
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleEdit = (txn) => {
//     setForm(txn);
//     setEditingId(txn.id);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("Delete this transaction?")) return;
//     await API.delete(`/transactions/${id}`);
//     fetchTransactions();
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     navigate("/login");
//   };

//   return (
//     <div className="p-6 space-y-6">
//       {/* Header */}
//       <div className="flex justify-between items-center">
//         <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
//         <button
//           onClick={handleLogout}
//           className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
//         >
//           Logout
//         </button>
//       </div>

//       {/* Transaction Form */}
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded-2xl shadow-md grid grid-cols-2 gap-4"
//       >
//         <select
//           name="type"
//           value={form.type}
//           onChange={handleChange}
//           className="border p-2 rounded"
//         >
//           <option value="income">Income</option>
//           <option value="expense">Expense</option>
//         </select>
//         <input
//           type="number"
//           step="0.01"
//           name="amount"
//           value={form.amount}
//           onChange={handleChange}
//           placeholder="Amount"
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           name="category"
//           value={form.category}
//           onChange={handleChange}
//           placeholder="Category"
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           name="payment_method"
//           value={form.payment_method}
//           onChange={handleChange}
//           placeholder="Payment Method"
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           name="note"
//           value={form.note}
//           onChange={handleChange}
//           placeholder="Note"
//           className="border p-2 rounded col-span-2"
//         />
//         <input
//           type="date"
//           name="txn_date"
//           value={form.txn_date}
//           onChange={handleChange}
//           className="border p-2 rounded"
//         />
//         <button
//           type="submit"
//           className="bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
//         >
//           {editingId ? "Update" : "Add Transaction"}
//         </button>
//       </form>

//       {/* Transactions Table */}
//       <table className="w-full border-collapse border border-gray-200">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="border px-2 py-1">Date</th>
//             <th className="border px-2 py-1">Type</th>
//             <th className="border px-2 py-1">Category</th>
//             <th className="border px-2 py-1">Amount</th>
//             <th className="border px-2 py-1">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {transactions.map((t) => (
//             <tr key={t.id}>
//               <td className="border px-2 py-1">{t.txn_date}</td>
//               <td className="border px-2 py-1">{t.type}</td>
//               <td className="border px-2 py-1">{t.category}</td>
//               <td className="border px-2 py-1">{t.amount}</td>
//               <td className="border px-2 py-1 space-x-2">
//                 <button
//                   onClick={() => handleEdit(t)}
//                   className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(t.id)}
//                   className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {/* Charts + Prediction */}
//       <Charts />
//     </div>
//   );
// }


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import API from "../api";
import Charts from "../components/Charts";

export default function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [user, setUser] = useState(null);
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

  const fetchTransactions = () => {
    API.get("/transactions")
      .then((res) => setTransactions(res.data))
      .catch(() => navigate("/login"));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch {
        navigate("/login");
      }
    } else {
      navigate("/login");
    }

    fetchTransactions();
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
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-8 text-white">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-wide drop-shadow-md">
          Welcome, {user?.name || user?.email || "User"} 👋
        </h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg shadow-lg transition duration-200 transform hover:scale-105 hover:shadow-red-500/50"
        >
          Logout
        </button>
      </div>
  
      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column - Form */}
        <div className="lg:col-span-1 bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-2xl shadow-2xl border border-gray-700 backdrop-blur-md">
          <h2 className="text-xl font-semibold mb-4 text-indigo-300 drop-shadow">
            {editingId ? "Edit Transaction" : "Add Transaction"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full border border-gray-600 bg-gray-900 text-white p-2 rounded focus:ring-2 focus:ring-indigo-500"
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
              className="w-full border border-gray-600 bg-gray-900 text-white p-2 rounded focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              placeholder="Category"
              className="w-full border border-gray-600 bg-gray-900 text-white p-2 rounded focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              name="payment_method"
              value={form.payment_method}
              onChange={handleChange}
              placeholder="Payment Method"
              className="w-full border border-gray-600 bg-gray-900 text-white p-2 rounded focus:ring-2 focus:ring-indigo-500"
            />
            <textarea
              name="note"
              value={form.note}
              onChange={handleChange}
              placeholder="Note"
              className="w-full border border-gray-600 bg-gray-900 text-white p-2 rounded focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="date"
              name="txn_date"
              value={form.txn_date}
              onChange={handleChange}
              className="w-full border border-gray-600 bg-gray-900 text-white p-2 rounded focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg shadow-lg hover:shadow-indigo-500/40 transition transform hover:scale-105"
            >
              {editingId ? "Update Transaction" : "Add Transaction"}
            </button>
          </form>
        </div>
  
        {/* Right Column - Transactions + Charts */}
        <div className="lg:col-span-2 space-y-8">
          {/* Transactions Table */}
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-2xl shadow-2xl border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-indigo-300">
              Recent Transactions
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-white">
                <thead>
                  <tr className="bg-gray-700 text-indigo-200">
                    <th className="p-2 text-left">Date</th>
                    <th className="p-2 text-left">Type</th>
                    <th className="p-2 text-left">Category</th>
                    <th className="p-2 text-left">Amount</th>
                    <th className="p-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length > 0 ? (
                    transactions.map((t) => (
                      <tr
                        key={t.id}
                        className="border-b border-gray-700 hover:bg-gray-800 transition"
                      >
                        <td className="p-2">{t.txn_date}</td>
                        <td
                          className={`p-2 font-semibold ${
                            t.type === "income"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {t.type}
                        </td>
                        <td className="p-2">{t.category}</td>
                        <td className="p-2">₹{t.amount}</td>
                        <td className="p-2 space-x-2">
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
          </div>
  
          {/* Charts */}
          <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-6 rounded-2xl shadow-2xl border border-gray-700">
            <Charts />
          </div>
        </div>
      </div>
    </div>
  );

  
  
}
