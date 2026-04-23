import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import API from "../api/axios";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/auth/forgot-password", { email });
      setSent(true);
    } catch (err) {
      if (!err.handled) toast.error(err.response?.data?.error || "Something went wrong");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-secondary)", padding: 20 }}>
      <div style={{ width: "100%", maxWidth: 400 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: 8, background: "#2cbb5d", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 16, marginBottom: 12 }}>P</div>
        </div>

        <div className="lc-card" style={{ padding: 24 }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "16px 0" }}>
              <Mail size={32} style={{ color: "var(--green)", marginBottom: 12 }} />
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 8 }}>Check your inbox</h2>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20 }}>
                If an account with <strong style={{ color: "var(--text)" }}>{email}</strong> exists, we've sent a reset link valid for 30 minutes.
              </p>
              <Link to="/login" style={{ color: "var(--blue)", fontSize: 14, textDecoration: "none" }}>← Back to sign in</Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--text)", marginBottom: 4 }}>Forgot password?</h1>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20 }}>Enter your email and we'll send a reset link</p>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--text-secondary)", marginBottom: 6 }}>Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@college.edu" required className="lc-input" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "10px 20px" }}>
                  {loading ? <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> : "Send Reset Link"}
                </button>
              </form>
              <p style={{ textAlign: "center", fontSize: 13, color: "var(--text-muted)", marginTop: 20 }}>
                Remembered it? <Link to="/login" style={{ color: "var(--green)", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
