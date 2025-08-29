import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login"/>} />
      </Routes>
    </Router>
  );
}

export default App;
// export default function App() {
//   return (
//     <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600">
//       <h1 className="text-5xl font-bold text-white">🚀 Tailwind Works!</h1>
//     </div>
//   );
// }
