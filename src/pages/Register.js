import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Compass, ArrowRight, Loader, Check, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";

const PASSWORD_RULES = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One number", test: (p) => /\d/.test(p) },
];

const PasswordRule = ({ label, met }) => (
  <div className="flex items-center gap-1.5 text-xs">
    {met ? (
      <Check size={11} className="text-[#34D399] flex-shrink-0" />
    ) : (
      <X size={11} className="text-[#3D3B52] flex-shrink-0" />
    )}
    <span className={met ? "text-[#34D399]" : "text-[#3D3B52]"}>{label}</span>
  </div>
);

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
    if (!passwordValid) {
      toast.error("Please meet all password requirements");
      return;
    }
    const trimmedForm = {
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
    };
    if (!trimmedForm.name) {
      toast.error("Name cannot be blank");
      return;
    }
    setLoading(true);
    try {
      const res = await API.post("/auth/register", trimmedForm);
      const token = res.data.token;
      const userRes = await API.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      login(token, userRes.data);
      toast.success(`Welcome, ${userRes.data.name}! 🎉`);
      navigate("/dashboard");
    } catch (err) {
      const status = err.response?.status;
      const msg = err.response?.data?.error;
      if (status === 409) toast.error("Email already registered — sign in instead");
      else toast.error(msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }} className="flex items-center justify-center p-6">
      <div className="fixed top-1/4 left-1/4 w-96 h-96 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #FF6B00, transparent)" }} />
      <div className="fixed bottom-1/4 right-1/4 w-72 h-72 rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #9B6DFF, transparent)" }} />

      <div className="w-full max-w-md animate-fade-up relative z-10">
        <div className="flex items-center gap-2.5 justify-center mb-8">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF9A3C] flex items-center justify-center">
            <Compass size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white" style={{ fontFamily: "Bricolage Grotesque" }}>PathShashtra</span>
        </div>

        <div className="glass-bright p-8">
          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Bricolage Grotesque" }}>
            Create account
          </h1>
          <p className="text-[#7A7890] text-sm mb-6">Join students building their future 🎯</p>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#7A7890] mb-2">Full Name</label>
              <input type="text" name="name" value={form.name}
                onChange={handleChange} placeholder="Rahul Sharma"
                required className="input-dark" maxLength={100} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#7A7890] mb-2">Email</label>
              <input type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="rahul@college.edu"
                required className="input-dark" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#7A7890] mb-2">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password"
                  value={form.password} onChange={handleChange}
                  placeholder="Min. 8 characters" required className="input-dark pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3D3B52] hover:text-[#7A7890] transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {/* FIX: Inline password strength rules shown as user types */}
              {form.password.length > 0 && (
                <div className="mt-2 space-y-1 px-1">
                  {PASSWORD_RULES.map((rule, i) => (
                    <PasswordRule key={i} label={rule.label} met={rule.test(form.password)} />
                  ))}
                </div>
              )}
            </div>

            <button type="submit"
              disabled={loading || !form.name.trim() || !form.email.trim() || !passwordValid}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {loading
                ? <Loader size={16} className="animate-spin" />
                : <><span>Create Account</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-[#7A7890] mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#FF8C38] font-semibold hover:underline">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-xs text-[#3D3B52] mt-4">
          Career · Study · Code — Powered by Intelligence
        </p>
      </div>
    </div>
  );
};

export default Register;
