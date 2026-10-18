import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { login } from "../services/authService";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    if (busy) return;
    setError("");
    setBusy(true);
    try {
      const user = await login(email, password, role);
      const requestedPath = location.state?.from?.pathname;
      navigate(requestedPath || user.route, { replace: true });
    } catch (err) {
      setError(err.message || "Unable to sign in.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleLogin}>
        <button type="button" onClick={() => navigate("/")} className="back-btn">
          ← Back to Home
        </button>
        <h1>Placement Management System</h1>
        <p>Sign in to continue</p>
        {new URLSearchParams(location.search).has("session") && (
          <p role="status" style={{ color: "#b45309", fontSize: 14 }}>
            Your session expired. Please sign in again.
          </p>
        )}
        <label htmlFor="login-role">Account type</label>
        <select id="login-role" value={role} onChange={(e) => { setRole(e.target.value); setError(""); }}>
          <option>Admin</option>
          <option>Student</option>
          <option>Company</option>
        </select>
        <label htmlFor="login-email">Email</label>
        <input id="login-email" type="email" autoComplete="username" required placeholder="you@example.com" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} />
        <label htmlFor="login-password">Password</label>
        <input id="login-password" type="password" autoComplete="current-password" required placeholder="Enter your password" value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} />
        {error && <p role="alert" style={{ color: "#ef4444", fontSize: 14, margin: 0 }}>{error}</p>}
        <button type="submit" className="login-btn" disabled={busy}>
          {busy ? "Signing in…" : "Login"}
        </button>
      </form>
    </div>
  );
}

export default Login;
