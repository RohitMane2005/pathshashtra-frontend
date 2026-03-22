import { useState } from "react";
import { Link } from "react-router-dom";
import { Compass, ArrowRight, Loader } from "lucide-react";
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
    <div style={{ background: "var(--bg)", minHeight: "100vh" }} className="flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-up relative z-10">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF9A3C] flex items-center justify-center">
            <Compass size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white" style={{ fontFamily: "Bricolage Grotesque" }}>PathShashtra</span>
        </div>

        <div className="glass-bright p-8">
          {sent ? (
            <div className="text-center py-4">
              <p className="text-4xl mb-4">📧</p>
              <h2 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "Bricolage Grotesque" }}>Check your inbox</h2>
              <p className="text-[#7A7890] text-sm mb-6">
                If an account with <span className="text-white">{email}</span> exists, we've sent a reset link valid for 30 minutes.
              </p>
              <Link to="/login" className="text-[#FF8C38] font-semibold hover:underline text-sm">← Back to sign in</Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Bricolage Grotesque" }}>Forgot password?</h1>
              <p className="text-[#7A7890] text-sm mb-6">Enter your email and we'll send a reset link</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#7A7890] mb-2">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@college.edu" required className="input-dark" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading ? <Loader size={16} className="animate-spin" /> : <><span>Send Reset Link</span><ArrowRight size={16} /></>}
                </button>
              </form>

              <p className="text-center text-sm text-[#7A7890] mt-6">
                Remembered it? <Link to="/login" className="text-[#FF8C38] font-semibold hover:underline">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
