import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Compass, Eye, EyeOff, Loader, AlertTriangle } from "lucide-react";
import API from "../api/axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [tokenValid, setTokenValid] = useState(null); // null=checking
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
    <div style={{ background: "var(--bg)", minHeight: "100vh" }} className="flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-up">
        <div className="flex items-center gap-2.5 justify-center mb-10">
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center">
            <Compass size={17} className="text-black" />
          </div>
          <span className="text-lg font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>PathShashtra</span>
        </div>

        <div className="card p-8">
          {tokenValid === null && (
            <div className="text-center py-8">
              <Loader size={24} className="animate-spin text-amber-500 mx-auto" />
              <p className="text-[#71717a] text-sm mt-3">Validating link...</p>
            </div>
          )}

          {tokenValid === false && (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/15 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={20} className="text-rose-500" />
              </div>
              <h2 className="text-lg font-bold text-white mb-2" style={{ fontFamily: "Space Grotesk" }}>Link expired or invalid</h2>
              <p className="text-[#71717a] text-sm mb-6">Reset links are valid for 30 minutes. Please request a new one.</p>
              <Link to="/forgot-password" className="btn-primary inline-flex items-center gap-2 text-sm">Request new link</Link>
            </div>
          )}

          {tokenValid === true && (
            <>
              <h1 className="text-2xl font-bold text-white mb-1.5" style={{ fontFamily: "Space Grotesk" }}>Set new password</h1>
              <p className="text-[#71717a] text-sm mb-7">Choose a strong password for your account</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#a1a1aa] mb-2">New password</label>
                  <div className="relative">
                    <input type={showPwd ? "text" : "password"} value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min. 8 characters" required className="input-dark pr-12" />
                    <button type="button" onClick={() => setShowPwd(!showPwd)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525b] hover:text-[#a1a1aa] transition-colors">
                      {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Confirm password</label>
                  <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                    placeholder="Repeat password" required className="input-dark" />
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                  {loading ? <Loader size={15} className="animate-spin" /> : "Update Password"}
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
