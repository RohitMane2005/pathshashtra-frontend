import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Compass, Mail, ShieldCheck, ArrowRight, Loader } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";

const Register = () => {
  const [step, setStep] = useState("form");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    setLoading(true);
    try {
      await API.post("/auth/send-otp", { email: form.email });
      toast.success("OTP sent! Check inbox or backend console 📧");
      setStep("otp");
      setOtpVerified(false);
      setOtp("");
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.error;
      if (status === 409) toast.error("Email already registered — login instead");
      else if (status === 429) toast.error(msg || "Too many OTP requests. Please wait and try again.");
      else toast.error(msg || "Failed to send OTP");
    } finally { setLoading(false); }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) { toast.error("Enter the 6-digit OTP"); return; }
    setLoading(true);
    try {
      // Only call verify-otp if not already verified (prevents double call on retry)
      if (!otpVerified) {
        await API.post("/auth/verify-otp", { email: form.email, otp });
        setOtpVerified(true);
      }
      // register returns JWT directly — no separate login call needed
      const regRes = await API.post("/auth/register", form);
      const token = regRes.data.token;
      const userRes = await API.get("/users/me", { headers: { Authorization: `Bearer ${token}` } });
      login(token, userRes.data);
      toast.success(`Welcome, ${userRes.data.name}! 🎉`);
      navigate("/dashboard");
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.error;
      if (status === 429) {
        toast.error("Too many attempts. Please request a new OTP.");
        setOtpVerified(false); setOtp("");
      } else if (status === 403) {
        toast.error("OTP session expired. Please request a new one.");
        setOtpVerified(false); setOtp(""); setStep("form");
      } else if (status === 409) {
        toast.error("Email already registered."); navigate("/login");
      } else {
        toast.error(msg || "Verification failed");
      }
    } finally { setLoading(false); }
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }} className="flex items-center justify-center p-6">
      {/* Background orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #FF6B00, transparent)" }} />
      <div className="fixed bottom-1/4 right-1/4 w-72 h-72 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #9B6DFF, transparent)" }} />

      <div className="w-full max-w-md animate-fade-up relative z-10">
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF9A3C] flex items-center justify-center">
            <Compass size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white" style={{ fontFamily: "Bricolage Grotesque" }}>PathShashtra</span>
        </div>

        <div className="glass-bright p-8">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {["Details", "Verify"].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  (i === 0 && step === "form") || (i === 1 && step === "otp")
                    ? "bg-[#FF6B00] text-white"
                    : i === 0 && step === "otp"
                    ? "bg-[#34D399] text-white"
                    : "bg-white/10 text-[#7A7890]"
                }`}>
                  {i === 0 && step === "otp" ? "✓" : i + 1}
                </div>
                <span className={`text-xs ${i === (step === "form" ? 0 : 1) ? "text-white" : "text-[#3D3B52]"}`}>{s}</span>
                {i === 0 && <div className="w-8 h-px bg-white/10" />}
              </div>
            ))}
          </div>

          {step === "form" && (
            <>
              <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Bricolage Grotesque" }}>Create account</h1>
              <p className="text-[#7A7890] text-sm mb-6">Join students building their future 🎯</p>

              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#7A7890] mb-2">Full Name</label>
                  <input type="text" name="name" value={form.name} onChange={handleChange}
                    placeholder="Rahul Sharma" required className="input-dark" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#7A7890] mb-2">Email</label>
                  <input type="email" name="email" value={form.email} onChange={handleChange}
                    placeholder="rahul@college.edu" required className="input-dark" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#7A7890] mb-2">Password</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} name="password"
                      value={form.password} onChange={handleChange}
                      placeholder="Min. 6 characters" required className="input-dark pr-12" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3D3B52] hover:text-[#7A7890] transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading ? <Loader size={16} className="animate-spin" /> : <><Mail size={16} /> Send OTP</>}
                </button>
              </form>

              <p className="text-center text-sm text-[#7A7890] mt-6">
                Already have an account?{" "}
                <Link to="/login" className="text-[#FF8C38] font-semibold hover:underline">Sign in</Link>
              </p>
            </>
          )}

          {step === "otp" && (
            <>
              <div className="text-center mb-6">
                <div className="w-14 h-14 rounded-2xl bg-[#FF6B00]/15 border border-[#FF6B00]/20 flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck size={26} className="text-[#FF8C38]" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "Bricolage Grotesque" }}>Check your inbox</h2>
                <p className="text-[#7A7890] text-sm">OTP sent to <span className="text-white font-medium">{form.email}</span></p>
                <p className="text-[#FF8C38] text-xs mt-1">💡 Dev mode: OTP is in IntelliJ console</p>
              </div>

              <form onSubmit={handleVerifyAndRegister} className="space-y-4">
                <input
                  type="text" value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  placeholder="000000" maxLength={6} required
                  className="input-dark text-3xl text-center tracking-[1em] font-bold py-5"
                  style={{ letterSpacing: "0.5em" }} />
                <p className="text-[#3D3B52] text-xs text-center">Valid for 10 minutes</p>
                <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary w-full flex items-center justify-center gap-2">
                  {loading ? <Loader size={16} className="animate-spin" /> : <><ShieldCheck size={16} /> Verify & Create Account</>}
                </button>
              </form>

              <div className="flex justify-between mt-4">
                <button onClick={() => { setStep("form"); setOtp(""); }} className="text-sm text-[#7A7890] hover:text-white transition-colors">← Change email</button>
                <button onClick={async () => {
                  try {
                    await API.post("/auth/send-otp", { email: form.email });
                    toast.success("New OTP sent!");
                    setOtp(""); setOtpVerified(false);
                  } catch (err) {
                    const status = err.response?.status;
                    const msg = err.response?.data?.error;
                    if (status === 429) toast.error(msg || "Please wait before requesting another OTP.");
                    else toast.error(msg || "Failed to resend OTP");
                  }
                }} className="text-sm text-[#FF8C38] font-semibold hover:underline">Resend OTP</button>
              </div>
            </>
          )}
        </div>
        <p className="text-center text-xs text-[#3D3B52] mt-4">Career · Study · Code — Powered by Intelligence</p>
      </div>
    </div>
  );
};

export default Register;
