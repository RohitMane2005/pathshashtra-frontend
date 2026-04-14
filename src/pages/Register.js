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
      <Check size={11} className="text-emerald-500 flex-shrink-0" />
    ) : (
      <X size={11} className="text-[#27272a] flex-shrink-0" />
    )}
    <span className={met ? "text-emerald-500" : "text-[#52525b]"}>{label}</span>
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
      toast.success(`Welcome, ${userRes.data.name}!`);
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
      {/* Subtle ambient glow */}
      <div className="fixed top-1/4 left-1/3 w-96 h-96 rounded-full opacity-[0.03] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }} />

      <div className="w-full max-w-md animate-fade-up relative z-10">
        <div className="flex items-center gap-2.5 justify-center mb-10">
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center">
            <Compass size={17} className="text-black" />
          </div>
          <span className="text-lg font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>PathShashtra</span>
        </div>

        <div className="card p-8">
          <h1 className="text-2xl font-bold text-white mb-1.5" style={{ fontFamily: "Space Grotesk" }}>
            Create account
          </h1>
          <p className="text-[#71717a] text-sm mb-7">Join students building their future</p>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Full Name</label>
              <input type="text" name="name" value={form.name}
                onChange={handleChange} placeholder="Rahul Sharma"
                required className="input-dark" maxLength={100} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Email</label>
              <input type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="rahul@college.edu"
                required className="input-dark" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password"
                  value={form.password} onChange={handleChange}
                  placeholder="Min. 8 characters" required className="input-dark pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525b] hover:text-[#a1a1aa] transition-colors">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {/* FIX: Inline password strength rules shown as user types */}
              {form.password.length > 0 && (
                <div className="mt-3 space-y-1.5 px-1">
                  {PASSWORD_RULES.map((rule, i) => (
                    <PasswordRule key={i} label={rule.label} met={rule.test(form.password)} />
                  ))}
                </div>
              )}
            </div>

            <button type="submit"
              disabled={loading || !form.name.trim() || !form.email.trim() || !passwordValid}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-40">
              {loading
                ? <Loader size={16} className="animate-spin" />
                : <><span>Create Account</span><ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-[#71717a] mt-7">
            Already have an account?{" "}
            <Link to="/login" className="text-amber-500 font-semibold hover:text-amber-400 transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
