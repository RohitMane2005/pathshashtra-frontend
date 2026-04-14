import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Compass, Brain, BookOpen, Code2, Map, ArrowRight,
  ChevronDown, Zap, Star, Users, TrendingUp, CheckCircle,
  Sparkles, Target, Shield, Clock, ArrowUpRight
} from "lucide-react";

/* ── tiny hook: element is in viewport ── */
const useVisible = (threshold = 0.15) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
};

/* ── animated counter ── */
const Counter = ({ to, suffix = "", duration = 1800 }) => {
  const [val, setVal] = useState(0);
  const [ref, visible] = useVisible(0.3);
  useEffect(() => {
    if (!visible) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.floor(p * to));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [visible, to, duration]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
};

/* ── section that fades up on scroll ── */
const FadeUp = ({ children, delay = 0, className = "" }) => {
  const [ref, visible] = useVisible();
  return (
    <div ref={ref} className={className} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "translateY(0)" : "translateY(16px)",
      transition: `opacity 0.5s cubic-bezier(0.23,1,0.32,1) ${delay}s, transform 0.5s cubic-bezier(0.23,1,0.32,1) ${delay}s`,
    }}>
      {children}
    </div>
  );
};

/* ── feature card ── */
const FeatureCard = ({ icon, title, desc, color, num, delay }) => (
  <FadeUp delay={delay} className="group relative">
    <div className="card p-6 h-full hover:border-white/12 transition-all duration-300">
      <div className="flex items-start justify-between mb-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${color}12`, color }}>
          {icon}
        </div>
        <span className="text-[#27272a] text-xs font-mono font-semibold">0{num}</span>
      </div>
      <h3 className="text-white font-semibold text-base mb-2" style={{ fontFamily: "Space Grotesk" }}>{title}</h3>
      <p className="text-[#71717a] text-sm leading-relaxed">{desc}</p>
    </div>
  </FadeUp>
);

/* ── step ── */
const Step = ({ num, title, desc, delay }) => (
  <FadeUp delay={delay} className="flex gap-5">
    <div className="flex flex-col items-center flex-shrink-0">
      <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border"
        style={{ borderColor: "var(--border-hover)", color: "var(--text-secondary)", background: "var(--bg3)" }}>{num}</div>
      {num < 4 && <div className="w-px flex-1 mt-3 bg-white/5" />}
    </div>
    <div className="pb-8">
      <h4 className="text-white font-semibold mb-1.5" style={{ fontFamily: "Space Grotesk" }}>{title}</h4>
      <p className="text-[#71717a] text-sm leading-relaxed">{desc}</p>
    </div>
  </FadeUp>
);

/* ── testimonial ── */
const Testimonial = ({ quote, name, role, initials, delay }) => (
  <FadeUp delay={delay}>
    <div className="card p-5 h-full flex flex-col">
      <div className="flex gap-1 mb-4">
        {[1,2,3,4,5].map(i => <Star key={i} size={12} className="text-amber-500 fill-amber-500" />)}
      </div>
      <p className="text-[#a1a1aa] text-sm leading-relaxed flex-1 mb-5">"{quote}"</p>
      <div className="flex items-center gap-3 pt-4 border-t border-white/5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-white text-sm font-medium">{name}</p>
          <p className="text-[#52525b] text-xs">{role}</p>
        </div>
      </div>
    </div>
  </FadeUp>
);

export default function Landing() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── Navbar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(9,9,11,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(16px) saturate(180%)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
        }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center">
              <Compass size={15} className="text-black" />
            </div>
            <span className="text-base font-bold text-white" style={{ fontFamily: "Space Grotesk" }}>PathShashtra</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-[#71717a]">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Students</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm text-[#a1a1aa] hover:text-white transition-colors font-medium px-3 py-2">Sign in</Link>
            <Link to="/register" className="btn-primary text-sm px-5 py-2.5 flex items-center gap-1.5">
              Get started <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">

        {/* Subtle grid background */}
        <div className="absolute inset-0 dot-grid opacity-30" />

        {/* Soft ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-[0.04] blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(ellipse, #f59e0b, transparent)" }} />

        {/* Badge */}
        <div className="animate-fade-up relative z-10 mb-8">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
            style={{ background: "var(--bg3)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> AI-Powered Career Platform for India
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up stagger-1 text-5xl md:text-7xl font-bold leading-[1.1] mb-6 max-w-3xl relative z-10"
          style={{ fontFamily: "Space Grotesk" }}>
          <span className="text-white">Find your path.</span>
          <br />
          <span className="grad-warm">Build your future.</span>
        </h1>

        {/* Subheading */}
        <p className="animate-fade-up stagger-2 text-[#71717a] text-lg md:text-xl leading-relaxed mb-10 max-w-xl relative z-10">
          Career assessments, study planning, and coding practice — powered by AI, built for India's college students.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up stagger-3 flex flex-wrap items-center justify-center gap-4 mb-16 relative z-10">
          <Link to="/register"
            className="btn-primary text-base px-8 py-3.5 flex items-center gap-2">
            Start for free <ArrowRight size={16} />
          </Link>
          <Link to="/login"
            className="btn-ghost text-base px-8 py-3.5">
            Sign in
          </Link>
        </div>

        {/* Trust signals */}
        <div className="animate-fade-up stagger-4 flex flex-wrap items-center justify-center gap-8 text-sm text-[#52525b] relative z-10">
          {[
            { icon: <Users size={14} />, text: "200+ students" },
            { icon: <Zap size={14} />, text: "Free to use" },
            { icon: <Shield size={14} />, text: "No credit card" },
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="text-[#71717a]">{item.icon}</span>
              {item.text}
            </span>
          ))}
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown size={18} className="text-[#27272a] animate-bounce" />
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.03] rounded-2xl overflow-hidden border border-white/[0.04]">
            {[
              { value: 200, suffix: "+", label: "Students", color: "#fafafa" },
              { value: 4, suffix: " modules", label: "AI-powered tools", color: "#fafafa" },
              { value: 38, suffix: "M", label: "Students in India", color: "#fafafa" },
              { value: 100, suffix: "%", label: "Free to start", color: "#fafafa" },
            ].map((s, i) => (
              <div key={i} className="p-8 text-center bg-[#0f0f12]">
                <p className="text-3xl md:text-4xl font-bold mb-1"
                  style={{ fontFamily: "Space Grotesk", color: s.color }}>
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="text-[#52525b] text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="mb-14">
            <p className="text-amber-500 text-sm font-semibold uppercase tracking-wider mb-3">What we offer</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight" style={{ fontFamily: "Space Grotesk" }}>
              Four tools. One platform.
            </h2>
            <p className="text-[#71717a] mt-4 max-w-lg text-lg">
              Each built around the real problems Indian students face.
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-4">
            <FeatureCard num={1} delay={0}
              icon={<Brain size={20} />} title="AI Career Quiz" color="#f59e0b"
              desc="10 psychometric questions → top career matches, skill gaps, salary projections, and a 4-phase personalized roadmap. Under 5 minutes."
            />
            <FeatureCard num={2} delay={0.06}
              icon={<BookOpen size={20} />} title="Smart Study Planner" color="#10b981"
              desc="Enter your exam date and subjects. AI builds a week-by-week schedule, tracks daily topics, flags weak areas, and adapts as you progress."
            />
            <FeatureCard num={3} delay={0.12}
              icon={<Code2 size={20} />} title="DSA Coding Tutor" color="#8b5cf6"
              desc="Generate problems by topic and difficulty in any language. Get progressive hints, submit your solution, receive a detailed AI code review."
            />
            <FeatureCard num={4} delay={0.18}
              icon={<Map size={20} />} title="Career Roadmap" color="#38bdf8"
              desc="Tell us your goal — Full Stack, ML, DevOps. Get a phase-by-phase roadmap with curated free resources, projects, and milestones."
            />
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="mb-14">
            <p className="text-emerald-500 text-sm font-semibold uppercase tracking-wider mb-3">Getting started</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight" style={{ fontFamily: "Space Grotesk" }}>
              Up and running in 3 minutes.
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div>
              <Step num={1} delay={0}
                title="Create your free account"
                desc="Name, email, password. No card, no phone, no OTP — you're in immediately."
              />
              <Step num={2} delay={0.06}
                title="Complete your profile"
                desc="Education, career goal, and current skills. More context means better AI recommendations."
              />
              <Step num={3} delay={0.12}
                title="Take the career quiz"
                desc="10 questions in 5 minutes. Get your career report — matches, gaps, salary outlook, and a full roadmap."
              />
              <Step num={4} delay={0.18}
                title="Start building"
                desc="Study planner for exams, daily DSA practice, and generate learning roadmaps for any goal."
              />
            </div>

            {/* Preview card */}
            <FadeUp delay={0.1} className="sticky top-24">
              <div className="card p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 flex items-center justify-center text-white text-sm font-semibold">R</div>
                  <div>
                    <p className="text-white font-medium text-sm">Rahul Sharma</p>
                    <p className="text-[#52525b] text-xs">B.Tech CSE · 3rd Year</p>
                  </div>
                  <span className="ml-auto badge badge-green text-[10px]">Active</span>
                </div>

                {[
                  { label: "Top Career Match", value: "Software Engineer", pct: 87, color: "#f59e0b" },
                  { label: "Study Progress", value: "34/60 topics", pct: 57, color: "#10b981" },
                  { label: "Problems Solved", value: "12 DSA problems", pct: 40, color: "#8b5cf6" },
                ].map((item, i) => (
                  <div key={i} className="mb-4">
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-[#71717a]">{item.label}</span>
                      <span className="text-white font-medium">{item.value}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${item.pct}%`, background: item.color }} />
                    </div>
                  </div>
                ))}

                <div className="mt-5 p-3.5 rounded-xl text-xs text-[#71717a] border border-white/5"
                  style={{ background: "var(--bg3)" }}>
                  <span className="text-amber-500 font-semibold">AI insight: </span>
                  Focus on your 3 weak topics today — you're 10 days from your GATE exam.
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="mb-14">
            <p className="text-violet-400 text-sm font-semibold uppercase tracking-wider mb-3">Student stories</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight" style={{ fontFamily: "Space Grotesk" }}>
              What students say.
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-4">
            <Testimonial delay={0}
              quote="I had no idea what career to pick after engineering. PathShashtra's quiz pointed me to Product Management with an 89% match — I've been preparing ever since."
              name="Priya Menon" role="B.Tech IT, Pune" initials="PM"
            />
            <Testimonial delay={0.06}
              quote="The study planner is incredible. I entered my GATE exam date and subjects, and it built a 4-week schedule automatically. Followed it strictly and cleared GATE 2025."
              name="Arjun Reddy" role="M.Tech, Hyderabad" initials="AR"
            />
            <Testimonial delay={0.12}
              quote="The roadmap generator gave me exactly what to learn and in what order. The DSA tutor is better than most paid platforms. And it's free."
              name="Sneha Joshi" role="Final year, BIT Mesra" initials="SJ"
            />
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <FadeUp>
            <div className="card p-10 md:p-14 text-center relative overflow-hidden">
              {/* Ambient glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-32 rounded-full opacity-[0.06] blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(ellipse, #f59e0b, transparent)" }} />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-amber-500 flex items-center justify-center mx-auto mb-6">
                  <Compass size={22} className="text-black" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-3" style={{ fontFamily: "Space Grotesk" }}>
                  Ready to find your path?
                </h2>
                <p className="text-[#71717a] mb-8 max-w-md mx-auto text-base">
                  Join students building their careers with AI guidance. Free forever. No credit card.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link to="/register" className="btn-primary flex items-center gap-2 text-base px-8 py-3.5">
                    <Sparkles size={16} /> Create free account
                  </Link>
                  <Link to="/login" className="btn-ghost flex items-center gap-2 text-base px-8 py-3.5">
                    Sign in <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-6 border-t" style={{ borderColor: "var(--border)" }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-amber-500 flex items-center justify-center">
              <Compass size={12} className="text-black" />
            </div>
            <span className="text-white font-semibold text-sm" style={{ fontFamily: "Space Grotesk" }}>PathShashtra</span>
          </div>
          <p className="text-[#52525b] text-xs text-center">
            Career · Study · Code — Built for India's students
          </p>
          <div className="flex gap-6 text-xs text-[#52525b]">
            <Link to="/login" className="hover:text-[#a1a1aa] transition-colors">Sign in</Link>
            <Link to="/register" className="hover:text-[#a1a1aa] transition-colors">Register</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
