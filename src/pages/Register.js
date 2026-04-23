import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One number", test: (p) => /\d/.test(p) },
];

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const passwordValid = PASSWORD_RULES.every((r) => r.test(form.password));

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!passwordValid) { toast.error("Please meet all password requirements"); return; }
    const trimmedForm = { ...form, name: form.name.trim(), email: form.email.trim().toLowerCase() };
    if (!trimmedForm.name) { toast.error("Name cannot be blank"); return; }
    setLoading(true);
    try {
      const res = await API.post("/auth/register", trimmedForm);
      const token = res.data.token;
      const userRes = await API.get("/users/me", { headers: { Authorization: `Bearer ${token}` } });
      login(token, userRes.data);
      toast.success(`Welcome, ${userRes.data.name}!`);
      navigate("/dashboard");
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.error;
      if (status === 409) toast.error("Email already registered — sign in instead");
      else toast.error(msg || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-secondary)", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#2cbb5d", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 12 }}>P</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--text)", margin: "8px 0 4px" }}>Create your account</h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)" }}>Join students building their future</p>
        </div>

        <div className="lc-card" style={{ padding: 24 }}>
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Rahul Sharma" required className="lc-input" maxLength={100} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="rahul@college.edu" required className="lc-input" />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} name="password" value={form.password} onChange={handleChange}
                  placeholder="Min. 8 characters" required className="lc-input" style={{ paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", color: "var(--text-light)", padding: 4,
                }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {form.password.length > 0 && (
                <div style={{ marginTop: 8 }}>
                  {PASSWORD_RULES.map((rule, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, marginBottom: 2 }}>
                      {rule.test(form.password)
                        ? <Check size={12} style={{ color: "var(--green)" }} />
                        : <X size={12} style={{ color: "var(--text-light)" }} />}
                      <span style={{ color: rule.test(form.password) ? "var(--green)" : "var(--text-muted)" }}>{rule.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button type="submit" disabled={loading || !form.name.trim() || !form.email.trim() || !passwordValid}
              className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "10px 20px", opacity: (!passwordValid || !form.name.trim()) ? 0.4 : 1 }}>
              {loading ? <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> : "Create Account"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginTop: 20 }}>
            Already have an account? <Link to="/login" style={{ color: "var(--green)", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
