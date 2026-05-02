import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import toast from "react-hot-toast";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // FIX: Show OAuth error messages from ?error= param or location.state
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlError = params.get("error");
    const stateError = location.state?.error;
    const errorMsg = urlError || stateError;
    if (errorMsg) {
      toast.error(errorMsg);
      // Clean the URL to prevent showing the error on refresh
      if (urlError) {
        window.history.replaceState({}, "", "/login");
      }
    }
  }, [location]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { email: form.email.trim().toLowerCase(), password: form.password };
      const res = await API.post("/auth/login", payload);
      const token = res.data.token;
      const userRes = await API.get("/users/me", { headers: { Authorization: `Bearer ${token}` } });
      login(token, userRes.data);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      if (!err.handled) toast.error(err.response?.data?.error || "Invalid email or password");
    } finally { setLoading(false); }
  };

  const handleSocialLogin = (provider) => {
    const backendUrl = API.defaults.baseURL ? API.defaults.baseURL.replace('/api', '') : 'http://localhost:8080';
    if (provider === "Google") {
      window.location.href = `${backendUrl}/oauth2/authorization/google`;
    } else if (provider === "GitHub") {
      window.location.href = `${backendUrl}/oauth2/authorization/github`;
    } else {
      toast(`${provider} login coming soon!`, { icon: "🚀" });
    }
  };

  return (
    <div className="auth-page">
      {/* Left branding panel */}
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <Link to="/" style={{ textDecoration: "none" }}>
            <div className="auth-logo">
              <div className="auth-logo-icon">P</div>
              <span className="auth-logo-text">PathShashtra</span>
            </div>
          </Link>
          <div className="auth-brand-hero">
            <h2>Welcome back,<br />explorer.</h2>
            <p>Pick up right where you left off — your personalized learning path awaits.</p>
          </div>
          <div className="auth-brand-features">
            {[
              { emoji: "🎯", text: "AI-powered career matching" },
              { emoji: "📚", text: "Smart study planning" },
              { emoji: "💻", text: "Coding practice & review" },
            ].map((f, i) => (
              <div key={i} className="auth-feature-item">
                <span className="auth-feature-emoji">{f.emoji}</span>
                <span>{f.text}</span>
              </div>
            ))}
          </div>
          <div className="auth-brand-footer">
            <span>Trusted by 200+ students across India</span>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-form-panel">
        <div className="auth-form-wrapper">
          {/* Mobile logo */}
          <Link to="/" className="auth-mobile-logo" style={{ textDecoration: "none" }}>
            <div className="auth-logo-icon">P</div>
            <span className="auth-logo-text">PathShashtra</span>
          </Link>

          <div className="auth-form-header">
            <h1>Sign in</h1>
            <p>Enter your credentials to continue</p>
          </div>

          {/* Social buttons */}
          <div className="auth-social-buttons">
            <button type="button" className="auth-social-btn" onClick={() => handleSocialLogin("Google")} id="google-login-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>
            <button type="button" className="auth-social-btn" onClick={() => handleSocialLogin("GitHub")} id="github-login-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
              </svg>
              Continue with GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="auth-divider">
            <div className="auth-divider-line" />
            <span className="auth-divider-text">or sign in with email</span>
            <div className="auth-divider-line" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-field">
              <label htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="lc-input"
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <div className="auth-field-header">
                <label htmlFor="login-password">Password</label>
                <Link to="/forgot-password" className="auth-forgot-link">Forgot password?</Link>
              </div>
              <div className="auth-password-wrap">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                  className="lc-input"
                  style={{ paddingRight: 44 }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="auth-submit-btn" id="login-submit-btn">
              {loading ? (
                <div className="auth-spinner" />
              ) : (
                <>Sign in <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          <p className="auth-switch-text">
            Don't have an account?{" "}
            <Link to="/register" className="auth-switch-link">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
