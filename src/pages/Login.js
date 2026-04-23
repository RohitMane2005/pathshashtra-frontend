import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { email: form.email.trim().toLowerCase(), password: form.password };
      const res = await API.post("/auth/login", payload);
      const token = res.data.token;
      const userRes = await API.get("/users/me", { headers: { Authorization: `Bearer ${token}` } });
      login(token, userRes.data);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      if (!err.handled) toast.error(err.response?.data?.error || "Invalid email or password");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-secondary)", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#2cbb5d", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 12 }}>P</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", margin: "8px 0 4px" }}>Sign in to PathShashtra</h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Continue your learning journey</p>
        </div>

        <div className="lc-card" style={{ padding: 24 }}>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@college.edu" required className="lc-input" autoComplete="email" />
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>Password</label>
                <Link to="/forgot-password" style={{ fontSize: 12, color: "var(--blue)", textDecoration: "none" }}>Forgot?</Link>
              </div>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                  placeholder="••••••••" required className="lc-input" style={{ paddingRight: 40 }} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "var(--text-light)", padding: 4,
                }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "10px 20px" }}>
              {loading ? <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> : "Sign In"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginTop: 20 }}>
            Don't have an account? <Link to="/register" style={{ color: "var(--green)", fontWeight: 600, textDecoration: "none" }}>Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
