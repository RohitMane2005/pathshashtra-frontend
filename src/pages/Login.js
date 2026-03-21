import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Compass, ArrowRight } from "lucide-react";
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
      const res = await API.post("/auth/login", form);
      const token = res.data.token;
      const userRes = await API.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      login(token, userRes.data);
      toast.success(`Welcome back! 👋`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }} className="flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 relative overflow-hidden"
        style={{ background: "var(--bg2)", borderRight: "1px solid var(--border)" }}>
        {/* Background orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #FF6B00, transparent)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #9B6DFF, transparent)" }} />

        {/* Logo */}
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF9A3C] flex items-center justify-center">
            <Compass size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white" style={{ fontFamily: "Bricolage Grotesque" }}>PathShashtra</span>
        </div>

        {/* Main quote */}
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4" style={{ fontFamily: "Bricolage Grotesque" }}>
            Your career clarity<br />
            <span style={{ background: "linear-gradient(135deg, #FF6B00, #9B6DFF)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              starts here.
            </span>
          </h2>
          <p className="text-[#7A7890] text-base leading-relaxed">
            AI-powered career guidance, smart study planning, and personalized coding practice — built for India's college students.
          </p>

          {/* Social proof */}
          <div className="flex items-center gap-4 mt-8">
            <div className="flex -space-x-2">
              {["🧑‍💻","👩‍🎓","🧑‍🔬","👨‍💼"].map((e, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0A0A0F] bg-[#1A1A24] flex items-center justify-center text-sm">
                  {e}
                </div>
              ))}
            </div>
            <p className="text-[#7A7890] text-sm"><span className="text-white font-semibold">200+</span> students onboarded</p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 relative z-10">
          {[
            { icon: "🧠", label: "AI Career Quiz" },
            { icon: "📚", label: "Study Planner" },
            { icon: "💻", label: "Coding Tutor" },
          ].map((f, i) => (
            <div key={i} className="glass p-3 text-center">
              <p className="text-xl mb-1">{f.icon}</p>
              <p className="text-[#7A7890] text-xs">{f.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm animate-fade-up">
          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#FF9A3C] flex items-center justify-center">
              <Compass size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white" style={{ fontFamily: "Bricolage Grotesque" }}>PathShashtra</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: "Bricolage Grotesque" }}>Welcome back</h1>
          <p className="text-[#7A7890] text-sm mb-8">Sign in to continue your journey</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#7A7890] mb-2">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@college.edu" required className="input-dark" />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#7A7890] mb-2">Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password"
                  value={form.password} onChange={handleChange}
                  placeholder="••••••••" required className="input-dark pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3D3B52] hover:text-[#7A7890] transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading
                ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><span>Sign In</span><ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-[#7A7890] mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#FF8C38] font-semibold hover:underline">Create one free</Link>
          </p>

          <p className="text-center text-xs text-[#3D3B52] mt-8">Career · Study · Code — Powered by Intelligence</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
