import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import API from "../api/axios";
import toast from "react-hot-toast";
import { Check, Zap, Crown, ArrowRight } from "lucide-react";

const FREE_FEATURES = [
  "15 AI Chat messages / day",
  "3 Roadmap generations / day",
  "3 Quiz sessions / day",
  "3 Study plan generations / day",
  "20 Coding problems / day",
  "Discussion forum access",
  "Leaderboard & achievements",
];

const PRO_FEATURES = [
  "Unlimited AI Chat messages",
  "Unlimited Roadmap generations",
  "Unlimited Quiz sessions",
  "Unlimited Study plan generations",
  "Unlimited Coding problems",
  "Discussion forum access",
  "Leaderboard & achievements",
  "Priority support",
  "Pro badge on profile",
];

const Pricing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const isPro = user?.plan === "PRO";

  const handleSubscribe = async () => {
    if (!user) { navigate("/login"); return; }
    if (isPro) { toast("You're already on Pro! 🎉"); return; }
    setLoading(true);
    try {
      const { data } = await API.post("/subscription/create-order");

      // Load Razorpay checkout script dynamically
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        const options = {
          key:         data.keyId,
          amount:      data.amount,
          currency:    data.currency,
          name:        "PathShashtra",
          description: "Pro Plan — Monthly",
          order_id:    data.orderId,
          prefill: {
            name:  data.userName,
            email: data.userEmail,
          },
          theme: { color: "#89E900" },
          handler: async (response) => {
            try {
              const verifyRes = await API.post("/subscription/verify", {
                orderId:   response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              });
              if (verifyRes.data.success) {
                toast.success("🎉 Welcome to PathShashtra Pro!");
                // Reload page so AuthContext refreshes user.plan
                setTimeout(() => window.location.href = "/dashboard", 1200);
              }
            } catch {
              toast.error("Payment verification failed. Contact support.");
            }
          },
          modal: { ondismiss: () => setLoading(false) },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to start checkout");
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Navbar />
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-8px); }
        }
        .plan-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 20px;
          padding: 36px 32px;
          flex: 1;
          max-width: 380px;
          display: flex;
          flex-direction: column;
          gap: 0;
          transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
        }
        .plan-card:hover { transform: translateY(-4px); }
        .plan-card.pro {
          border-color: rgba(137,233,0,0.35);
          background: linear-gradient(135deg, rgba(137,233,0,0.05) 0%, rgba(0,0,0,0) 60%);
          box-shadow: 0 0 40px rgba(137,233,0,0.08);
        }
        .plan-card.pro:hover {
          border-color: rgba(137,233,0,0.6);
          box-shadow: 0 0 60px rgba(137,233,0,0.15);
        }
        .subscribe-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          font-size: 15px;
          font-weight: 600;
          font-family: inherit;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
          margin-top: auto;
        }
        .subscribe-btn.pro-btn {
          background: #89E900;
          color: #06080c;
        }
        .subscribe-btn.pro-btn:hover:not(:disabled) {
          background: #9ef01a;
          transform: scale(1.02);
          box-shadow: 0 6px 24px rgba(137,233,0,0.3);
        }
        .subscribe-btn.pro-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .subscribe-btn.free-btn {
          background: rgba(255,255,255,0.06);
          color: var(--text-muted);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .feature-row {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          padding: 7px 0;
          font-size: 14px;
          color: var(--text-secondary);
          line-height: 1.4;
        }
        .feature-icon-yes { color: #89E900; flex-shrink: 0; margin-top: 2px; }
        .feature-icon-no  { color: #64748b; flex-shrink: 0; margin-top: 2px; }
        .badge-pro {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(137,233,0,0.12);
          border: 1px solid rgba(137,233,0,0.35);
          color: #89E900;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.06em;
          padding: 3px 10px;
          border-radius: 20px;
          text-transform: uppercase;
        }
      `}</style>

      <div className="page-content" style={{ paddingTop: 80 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "rgba(137,233,0,0.1)", border: "1px solid rgba(137,233,0,0.25)",
            borderRadius: 20, padding: "6px 16px", marginBottom: 20,
          }}>
            <Zap size={14} style={{ color: "#89E900" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#89E900", letterSpacing: "0.06em" }}>
              SIMPLE PRICING
            </span>
          </div>
          <h1 style={{ fontSize: 42, fontWeight: 800, color: "#f8fafc", marginBottom: 16, lineHeight: 1.2 }}>
            Unlock your full potential
          </h1>
          <p style={{ fontSize: 16, color: "var(--text-muted)", maxWidth: 460, margin: "0 auto", lineHeight: 1.7 }}>
            Start free. Upgrade when you're ready. Cancel anytime.
          </p>
        </div>

        {/* Plan cards */}
        <div style={{
          display: "flex", gap: 24, justifyContent: "center",
          flexWrap: "wrap", maxWidth: 820, margin: "0 auto 80px",
        }}>
          {/* Free */}
          <div className="plan-card">
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Free</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
              <span style={{ fontSize: 44, fontWeight: 800, color: "#f8fafc" }}>₹0</span>
              <span style={{ fontSize: 14, color: "var(--text-muted)" }}>/month</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-light)", marginBottom: 28, lineHeight: 1.5 }}>
              Everything you need to get started with AI-powered learning.
            </p>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 20, marginBottom: 28 }}>
              {FREE_FEATURES.map(f => (
                <div className="feature-row" key={f}>
                  <Check size={14} className="feature-icon-yes" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
            <button className="subscribe-btn free-btn" onClick={() => navigate("/dashboard")}>
              {isPro ? "Current free features" : "Get started free"}
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Pro */}
          <div className="plan-card pro" style={{ position: "relative" }}>
            {/* Popular badge */}
            <div style={{ position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)" }}>
              <span className="badge-pro">
                <Crown size={11} /> Most Popular
              </span>
            </div>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#89E900", textTransform: "uppercase", letterSpacing: "0.06em" }}>Pro</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
              <span style={{ fontSize: 44, fontWeight: 800, color: "#f8fafc" }}>₹299</span>
              <span style={{ fontSize: 14, color: "var(--text-muted)" }}>/month</span>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-light)", marginBottom: 28, lineHeight: 1.5 }}>
              Unlimited AI access for serious placement and competitive programming prep.
            </p>
            <div style={{ borderTop: "1px solid rgba(137,233,0,0.12)", paddingTop: 20, marginBottom: 28 }}>
              {PRO_FEATURES.map(f => (
                <div className="feature-row" key={f}>
                  <Check size={14} className="feature-icon-yes" />
                  <span style={{ color: "#cbd5e1" }}>{f}</span>
                </div>
              ))}
            </div>
            {isPro ? (
              <button className="subscribe-btn pro-btn" disabled style={{ background: "rgba(137,233,0,0.3)" }}>
                <Crown size={15} /> You're on Pro!
              </button>
            ) : (
              <button className="subscribe-btn pro-btn" onClick={handleSubscribe} disabled={loading}>
                {loading ? "Loading…" : <><Zap size={15} /> Upgrade to Pro</>}
              </button>
            )}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: 640, margin: "0 auto 80px", textAlign: "center" }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#f8fafc", marginBottom: 32 }}>Frequently asked</h2>
          {[
            ["Is there a free trial?", "Yes — the Free plan has no time limit. You can use PathShashtra forever for free with daily quotas."],
            ["Can I cancel anytime?", "Absolutely. Cancel from your profile or contact us and we'll refund any unused time."],
            ["What payment methods are accepted?", "UPI, cards (Visa/Mastercard), net banking, and wallets via Razorpay — India's most trusted payment gateway."],
            ["Do unused messages roll over?", "No — quotas reset every day at midnight IST. Pro users don't need to worry about this."],
          ].map(([q, a]) => (
            <div key={q} style={{
              textAlign: "left", padding: "20px 0",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
            }}>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#f0f4f8", marginBottom: 8 }}>{q}</p>
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>{a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing;
