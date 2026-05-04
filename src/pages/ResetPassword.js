import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";
import API from "../api/axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [tokenValid, setTokenValid] = useState(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) { setTokenValid(false); return; }
    API.get(`/auth/reset-password/validate?token=${token}`)
      .then(res => setTokenValid(res.data.valid))
      .catch(() => setTokenValid(false));
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (!/[A-Z]/.test(password)) { toast.error("Password must contain at least one uppercase letter"); return; }
    if (!/[0-9]/.test(password)) { toast.error("Password must contain at least one digit"); return; }
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    setLoading(true);
    try {
      await API.post("/auth/reset-password", { token, password });
      toast.success("Password updated! Please sign in.");
      navigate("/login");
    } catch (err) {
      if (!err.handled) toast.error(err.response?.data?.error || "Failed to reset password");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-secondary)", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#89E900", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#111", fontWeight: 700, fontSize: 16, marginBottom: 12 }}>P</div>
        </div>

        <div className="lc-card" style={{ padding: 24 }}>
          {tokenValid === null && (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <div style={{ width: 24, height: 24, border: "3px solid #e5e5e5", borderTopColor: "var(--green)", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
              <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Validating link...</p>
            </div>
          )}

          {tokenValid === false && (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <AlertTriangle size={32} style={{ color: "var(--red)", marginBottom: 12 }} />
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>Link expired or invalid</h2>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20 }}>Reset links are valid for 30 minutes.</p>
              <Link to="/forgot-password" className="btn-primary" style={{ textDecoration: "none" }}>Request new link</Link>
            </div>
          )}

          {tokenValid === true && (
            <>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Set new password</h1>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20 }}>Choose a strong password</p>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>New password</label>
                  <div style={{ position: "relative" }}>
                    <input type={showPwd ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 8 characters" required className="lc-input" style={{ paddingRight: 40 }} />
                    <button type="button" onClick={() => setShowPwd(!showPwd)} style={{
                      position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer", color: "var(--text-light)", padding: 4,
                    }}>
                      {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div style={{ marginBottom: 20 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Confirm password</label>
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Repeat password" required className="lc-input" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "10px 20px" }}>
                  {loading ? <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> : "Update Password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
