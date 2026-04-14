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
      // FIX: Trim and lowercase email client-side before sending
      const payload = {
        email: form.email.trim().toLowerCase(),
        password: form.password,
      };
      const res = await API.post("/auth/login", payload);
      const token = res.data.token;
      const userRes = await API.get("/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      login(token, userRes.data);
      toast.success(`Welcome back!`);
      navigate("/dashboard");
    } catch (err) {
      if (!err.handled) {
        toast.error(err.response?.data?.error || "Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }} className="flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex flex-col justify-between w-[45%] p-12 relative overflow-hidden"
        style={{ background: "var(--bg2)", borderRight: "1px solid var(--border)" }}>
        
        {/* Dot grid background */}
        <div className="absolute inset-0 dot-grid opacity-20" />
        
        {/* Subtle amber glow */}
        <div className="absolute top-1/3 left-1/3 w-64 h-64 rounded-full opacity-[0.04] blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #f59e0b, transparent)" }} />

        <div className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-lg bg-amber-500 flex items-center justify-center">
            <Compass size={17} className="text-black" />
          </div>
          <span className="text-lg font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>PathShashtra</span>
        </div>

        <div className="relative z-10 max-w-sm">
          <h2 className="text-4xl font-bold text-white leading-tight mb-4" style={{ fontFamily: "Space Grotesk" }}>
            Your career clarity
            <br />
            <span className="grad-warm">starts here.</span>
          </h2>
          <p className="text-[#71717a] text-base leading-relaxed">
            AI-powered career guidance, study planning, and coding practice — built for India's students.
          </p>

          <div className="flex items-center gap-4 mt-10">
            <div className="flex -space-x-2">
              {["R", "P", "A", "S"].map((l, i) => (
                <div key={i} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-semibold text-white"
                  style={{ borderColor: "var(--bg2)", background: "linear-gradient(135deg, #3f3f46, #52525b)" }}>{l}</div>
              ))}
            </div>
            <p className="text-[#71717a] text-sm"><span className="text-white font-medium">200+</span> students onboarded</p>
          </div>
        </div>

        <div className="flex gap-8 relative z-10">
          {[
            { label: "Career Quiz", desc: "AI-powered" },
            { label: "Study Planner", desc: "Adaptive" },
            { label: "Coding Tutor", desc: "Multi-lang" },
          ].map((f, i) => (
            <div key={i}>
              <p className="text-white text-sm font-medium">{f.label}</p>
              <p className="text-[#52525b] text-xs">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-sm animate-fade-up">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-10">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <Compass size={15} className="text-black" />
            </div>
            <span className="text-lg font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>PathShashtra</span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-1.5" style={{ fontFamily: "Space Grotesk" }}>Welcome back</h1>
          <p className="text-[#71717a] text-sm mb-8">Sign in to continue your journey</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@college.edu" required className="input-dark" autoComplete="email" />
            </div>

            <div>
              {/* FIX: Added "Forgot password?" link next to label for discoverability */}
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-[#a1a1aa]">Password</label>
                <Link to="/forgot-password" className="text-xs text-[#71717a] hover:text-amber-500 transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} name="password"
                  value={form.password} onChange={handleChange}
                  placeholder="••••••••" required className="input-dark pr-12"
                  autoComplete="current-password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#52525b] hover:text-[#a1a1aa] transition-colors">
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading
                ? <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                : <><span>Sign In</span><ArrowRight size={15} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-[#71717a] mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-amber-500 font-semibold hover:text-amber-400 transition-colors">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
