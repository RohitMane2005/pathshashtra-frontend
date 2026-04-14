import { useState } from "react";
import { Link } from "react-router-dom";
import { Compass, ArrowRight, Loader, Mail } from "lucide-react";
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
        <div className="flex items-center gap-2.5 justify-center mb-10">
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center">
            <Compass size={17} className="text-black" />
          </div>
          <span className="text-lg font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>PathShashtra</span>
        </div>

        <div className="card p-8">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center mx-auto mb-4">
                <Mail size={20} className="text-emerald-500" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "Space Grotesk" }}>Check your inbox</h2>
              <p className="text-[#71717a] text-sm mb-6">
                If an account with <span className="text-white font-medium">{email}</span> exists, we've sent a reset link valid for 30 minutes.
              </p>
              <Link to="/login" className="text-amber-500 font-medium hover:text-amber-400 text-sm transition-colors">← Back to sign in</Link>
            </div>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white mb-1.5" style={{ fontFamily: "Space Grotesk" }}>Forgot password?</h1>
              <p className="text-[#71717a] text-sm mb-7">Enter your email and we'll send a reset link</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Email</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@college.edu" required className="input-dark" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                  {loading ? <Loader size={15} className="animate-spin" /> : <><span>Send Reset Link</span><ArrowRight size={15} /></>}
                </button>
              </form>

              <p className="text-center text-sm text-[#71717a] mt-7">
                Remembered it? <Link to="/login" className="text-amber-500 font-semibold hover:text-amber-400 transition-colors">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
