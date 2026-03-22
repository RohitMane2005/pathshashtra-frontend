import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Compass, Brain, BookOpen, Code2, Map, ArrowRight,
  ChevronDown, Zap, Star, Users, TrendingUp, CheckCircle,
  Sparkles, Target, Shield, Clock
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
      transform: visible ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
    }}>
      {children}
    </div>
  );
};

/* ── feature card ── */
const FeatureCard = ({ icon, title, desc, color, badge, delay }) => (
  <FadeUp delay={delay} className="glass p-6 group hover:border-white/15 transition-all duration-300 relative overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-px"
      style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)`, opacity: 0.6 }} />
    <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 flex-shrink-0"
      style={{ background: `${color}18`, color }}>
      {icon}
    </div>
    {badge && (
      <span className="absolute top-4 right-4 badge text-[10px]"
        style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>{badge}</span>
    )}
    <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "Bricolage Grotesque" }}>{title}</h3>
    <p className="text-[#7A7890] text-sm leading-relaxed">{desc}</p>
  </FadeUp>
);

/* ── step ── */
const Step = ({ num, title, desc, color, delay }) => (
  <FadeUp delay={delay} className="flex gap-4">
    <div className="flex flex-col items-center flex-shrink-0">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-sm font-bold"
        style={{ background: `linear-gradient(135deg, ${color}, ${color}99)` }}>{num}</div>
      {num < 4 && <div className="w-px flex-1 mt-3" style={{ background: `${color}30` }} />}
    </div>
    <div className="pb-8">
      <h4 className="text-white font-bold mb-1" style={{ fontFamily: "Bricolage Grotesque" }}>{title}</h4>
      <p className="text-[#7A7890] text-sm leading-relaxed">{desc}</p>
    </div>
  </FadeUp>
);

/* ── testimonial ── */
const Testimonial = ({ quote, name, role, avatar, delay }) => (
  <FadeUp delay={delay} className="glass p-5">
    <p className="text-[#B0AEC8] text-sm leading-relaxed mb-4">"{quote}"</p>
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#9B6DFF] flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
        {avatar}
      </div>
      <div>
        <p className="text-white text-sm font-semibold">{name}</p>
        <p className="text-[#3D3B52] text-xs">{role}</p>
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
          background: scrolled ? "rgba(10,10,15,0.92)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
        }}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#FF9A3C] flex items-center justify-center">
              <Compass size={16} className="text-white" />
            </div>
            <span className="text-lg font-bold text-white" style={{ fontFamily: "Bricolage Grotesque" }}>PathShashtra</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-[#7A7890]">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#how" className="hover:text-white transition-colors">How it works</a>
            <a href="#testimonials" className="hover:text-white transition-colors">Students</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="btn-ghost text-sm px-4 py-2">Sign in</Link>
            <Link to="/register" className="btn-primary text-sm px-4 py-2 flex items-center gap-1.5">
              Get started <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 pt-20">

        {/* Background orbs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{ background: "radial-gradient(circle, #FF6B00, transparent)" }} />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full opacity-8 blur-3xl"
            style={{ background: "radial-gradient(circle, #9B6DFF, transparent)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl"
            style={{ background: "radial-gradient(circle, #00D4C8, transparent)" }} />
        </div>

        {/* Badge */}
        <div className="animate-fade-up mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold"
            style={{ background: "rgba(255,107,0,0.1)", color: "#FF8C38", border: "1px solid rgba(255,107,0,0.2)" }}>
            <Sparkles size={12} /> AI-Powered Career Guidance for India
          </span>
        </div>

        {/* Headline */}
        <h1 className="animate-fade-up stagger-1 text-5xl md:text-7xl font-bold text-white leading-tight mb-6 max-w-4xl"
          style={{ fontFamily: "Bricolage Grotesque" }}>
          Your career clarity
          <br />
          <span style={{
            background: "linear-gradient(135deg, #FF6B00 0%, #9B6DFF 50%, #00D4C8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
          }}>starts here.</span>
        </h1>

        {/* Subheading */}
        <p className="animate-fade-up stagger-2 text-[#7A7890] text-lg md:text-xl leading-relaxed mb-10 max-w-2xl">
          PathShashtra combines AI career assessments, smart study planning, and
          personalized coding practice — built specifically for India's 38M college students.
        </p>

        {/* CTAs */}
        <div className="animate-fade-up stagger-3 flex flex-wrap items-center justify-center gap-4 mb-16">
          <Link to="/register"
            className="btn-primary text-base px-8 py-4 flex items-center gap-2">
            Start for free <ArrowRight size={16} />
          </Link>
          <Link to="/login"
            className="btn-ghost text-base px-8 py-4 flex items-center gap-2">
            Sign in
          </Link>
        </div>

        {/* Social proof strip */}
        <div className="animate-fade-up stagger-4 flex flex-wrap items-center justify-center gap-6 text-sm text-[#3D3B52]">
          {[
            { icon: <Users size={14} />, text: "200+ students" },
            { icon: <Star size={14} />, text: "Free to use" },
            { icon: <Shield size={14} />, text: "No credit card" },
            { icon: <Zap size={14} />, text: "Instant results" },
          ].map((item, i) => (
            <span key={i} className="flex items-center gap-1.5">
              <span className="text-[#FF6B00]">{item.icon}</span>
              {item.text}
            </span>
          ))}
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown size={20} className="text-[#3D3B52]" />
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="glass-bright p-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: 200, suffix: "+", label: "Students", color: "#FF6B00" },
              { value: 4, suffix: " modules", label: "AI features", color: "#9B6DFF" },
              { value: 38, suffix: "M", label: "Students we're built for", color: "#00D4C8" },
              { value: 100, suffix: "%", label: "Free to start", color: "#34D399" },
            ].map((s, i) => (
              <div key={i}>
                <p className="text-3xl md:text-4xl font-bold mb-1"
                  style={{ fontFamily: "Bricolage Grotesque", color: s.color }}>
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="text-[#7A7890] text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-14">
            <span className="badge badge-purple mb-4 inline-flex">4 AI modules</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "Bricolage Grotesque" }}>
              Everything you need,<br />
              <span className="grad-orange">nothing you don't.</span>
            </h2>
            <p className="text-[#7A7890] mt-4 max-w-xl mx-auto">
              Each feature is built around the real problems Indian students face — from career confusion to placement prep.
            </p>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-5">
            <FeatureCard
              delay={0}
              icon={<Brain size={24} />}
              title="AI Career Quiz"
              badge="Psychometric"
              color="#FF6B00"
              desc="Answer 10 targeted questions. Get your top career matches, skill gaps, salary projections, and a full 4-phase personalized roadmap — all in under 5 minutes."
            />
            <FeatureCard
              delay={0.1}
              icon={<BookOpen size={24} />}
              title="Smart Study Planner"
              badge="Exam-Ready"
              color="#00D4C8"
              desc="Enter your exam date and subjects. AI builds a week-by-week study schedule, tracks daily topics, flags weak areas, and adapts as you progress."
            />
            <FeatureCard
              delay={0.2}
              icon={<Code2 size={24} />}
              title="DSA Coding Tutor"
              badge="Placement Prep"
              color="#9B6DFF"
              desc="Generate DSA problems by topic and difficulty in any language. Get progressive hints, submit your solution, and receive a detailed AI code review with complexity analysis."
            />
            <FeatureCard
              delay={0.3}
              icon={<Map size={24} />}
              title="Career Roadmap Generator"
              badge="Step-by-step"
              color="#34D399"
              desc="Tell PathShashtra your goal — Full Stack Dev, ML Engineer, DevOps. Get a phase-by-phase roadmap with curated free resources, projects to build, and milestones."
            />
          </div>

          {/* Feature highlights row */}
          <FadeUp delay={0.1} className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: <CheckCircle size={14} />, text: "Works without a profile" },
              { icon: <Clock size={14} />, text: "Results in minutes" },
              { icon: <Target size={14} />, text: "India-specific advice" },
              { icon: <TrendingUp size={14} />, text: "Tracks your progress" },
            ].map((item, i) => (
              <div key={i} className="glass px-4 py-3 flex items-center gap-2 text-sm text-[#7A7890]">
                <span className="text-[#FF6B00] flex-shrink-0">{item.icon}</span>
                {item.text}
              </div>
            ))}
          </FadeUp>
        </div>
      </section>

      {/* ── How it works ── */}
      <section id="how" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-14">
            <span className="badge badge-teal mb-4 inline-flex">Simple process</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "Bricolage Grotesque" }}>
              Up and running in<br />
              <span className="grad-teal">under 3 minutes.</span>
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <Step num={1} color="#FF6B00" delay={0}
                title="Create your free account"
                desc="Sign up with just your name, email, and password. No credit card, no phone number, no OTP — you're in immediately."
              />
              <Step num={2} color="#9B6DFF" delay={0.1}
                title="Complete your profile"
                desc="Tell us your education, career goal, and current skills. The more you share, the more personalised your AI results become."
              />
              <Step num={3} color="#00D4C8" delay={0.2}
                title="Take the career quiz"
                desc="10 psychometric questions in 5 minutes. Get your career report — top matches, skill gaps, salary outlook, and a full roadmap instantly."
              />
              <Step num={4} color="#34D399" delay={0.3}
                title="Start building your future"
                desc="Use your study planner for exams, practice DSA problems daily, and generate learning roadmaps for any career goal."
              />
            </div>

            {/* Mock card */}
            <FadeUp delay={0.2} className="sticky top-24">
              <div className="glass-bright p-6 rounded-2xl">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF6B00] to-[#9B6DFF] flex items-center justify-center text-white text-sm font-bold">R</div>
                  <div>
                    <p className="text-white font-semibold text-sm">Rahul Sharma</p>
                    <p className="text-[#3D3B52] text-xs">B.Tech CSE, 3rd Year</p>
                  </div>
                  <span className="ml-auto badge badge-green text-[10px]">Active</span>
                </div>

                {[
                  { label: "Top Career Match", value: "Software Engineer", pct: 87, color: "#FF6B00" },
                  { label: "Study Progress", value: "34/60 topics", pct: 57, color: "#00D4C8" },
                  { label: "Problems Solved", value: "12 DSA problems", pct: 40, color: "#9B6DFF" },
                ].map((item, i) => (
                  <div key={i} className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-[#7A7890]">{item.label}</span>
                      <span className="text-white">{item.value}</span>
                    </div>
                    <div className="progress-bar">
                      <div className="h-full rounded-full transition-all duration-1000"
                        style={{ width: `${item.pct}%`, background: item.color }} />
                    </div>
                  </div>
                ))}

                <div className="mt-5 p-3 rounded-xl text-xs text-[#7A7890] border border-white/5"
                  style={{ background: "rgba(255,107,0,0.05)" }}>
                  <span className="text-[#FF8C38] font-semibold">AI insight: </span>
                  Focus on your 3 weak topics today — you're 10 days from your GATE exam. 🎯
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials" className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeUp className="text-center mb-14">
            <span className="badge badge-orange mb-4 inline-flex">Student stories</span>
            <h2 className="text-4xl md:text-5xl font-bold text-white" style={{ fontFamily: "Bricolage Grotesque" }}>
              Built for students<br />
              <span className="grad-purple">like you.</span>
            </h2>
          </FadeUp>

          <div className="grid md:grid-cols-3 gap-4">
            <Testimonial delay={0}
              quote="I had no idea what career to pick after engineering. PathShashtra's quiz pointed me to Product Management with an 89% match — I've been preparing for it ever since."
              name="Priya Menon" role="B.Tech IT, Pune" avatar="P"
            />
            <Testimonial delay={0.1}
              quote="The study planner is insane. I just entered my GATE exam date and subjects, and it built a 4-week schedule automatically. Followed it strictly and cleared GATE 2025."
              name="Arjun Reddy" role="M.Tech student, Hyderabad" avatar="A"
            />
            <Testimonial delay={0.2}
              quote="Getting placed in a startup was my goal. The roadmap generator gave me exactly what to learn and in what order. The DSA tutor is better than most paid platforms."
              name="Sneha Joshi" role="Final year, BIT Mesra" avatar="S"
            />
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <FadeUp>
            <div className="relative overflow-hidden rounded-3xl p-10 md:p-14 text-center border border-[#FF6B00]/20"
              style={{ background: "linear-gradient(135deg, rgba(255,107,0,0.08) 0%, rgba(155,109,255,0.06) 50%, rgba(0,212,200,0.05) 100%)" }}>
              {/* Orbs inside banner */}
              <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-20 blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, #FF6B00, transparent)", transform: "translate(20px,-20px)" }} />
              <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full opacity-15 blur-3xl pointer-events-none"
                style={{ background: "radial-gradient(circle, #9B6DFF, transparent)", transform: "translate(-20px,20px)" }} />

              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6B00] to-[#9B6DFF] flex items-center justify-center mx-auto mb-5">
                  <Compass size={28} className="text-white" />
                </div>
                <h2 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "Bricolage Grotesque" }}>
                  Ready to find your path?
                </h2>
                <p className="text-[#7A7890] mb-8 max-w-md mx-auto">
                  Join thousands of Indian students who are using AI to make smarter career decisions.
                  It's free. No card needed.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link to="/register" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
                    <Sparkles size={16} /> Create free account
                  </Link>
                  <Link to="/login" className="btn-ghost flex items-center gap-2 text-base px-8 py-4">
                    Already have an account
                  </Link>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-10 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#FF6B00] to-[#FF9A3C] flex items-center justify-center">
              <Compass size={13} className="text-white" />
            </div>
            <span className="text-white font-bold text-sm" style={{ fontFamily: "Bricolage Grotesque" }}>PathShashtra</span>
          </div>
          <p className="text-[#3D3B52] text-xs text-center">
            Career · Study · Code — Powered by Intelligence<br />
            Built for India's 38M college students 🇮🇳
          </p>
          <div className="flex gap-5 text-xs text-[#3D3B52]">
            <Link to="/login" className="hover:text-[#7A7890] transition-colors">Sign in</Link>
            <Link to="/register" className="hover:text-[#7A7890] transition-colors">Register</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
