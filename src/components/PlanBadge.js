import { Crown } from "lucide-react";
import { Link } from "react-router-dom";

/**
 * Small PRO badge displayed next to the user's name in the Navbar.
 * Also acts as a link to the pricing page for Free users (showing "Upgrade").
 */
const PlanBadge = ({ plan }) => {
  if (plan === "PRO") {
    return (
      <span style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        background: "rgba(137,233,0,0.12)",
        border: "1px solid rgba(137,233,0,0.3)",
        color: "#89E900",
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: "0.06em",
        padding: "2px 7px",
        borderRadius: 20,
        textTransform: "uppercase",
        userSelect: "none",
      }}>
        <Crown size={9} />
        PRO
      </span>
    );
  }

  return (
    <Link to="/pricing" style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 3,
      background: "rgba(245,158,11,0.1)",
      border: "1px solid rgba(245,158,11,0.25)",
      color: "#f59e0b",
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: "0.06em",
      padding: "2px 7px",
      borderRadius: 20,
      textTransform: "uppercase",
      textDecoration: "none",
      transition: "border-color 0.15s, background 0.15s",
    }}
    onMouseEnter={e => {
      e.currentTarget.style.background = "rgba(245,158,11,0.18)";
      e.currentTarget.style.borderColor = "rgba(245,158,11,0.45)";
    }}
    onMouseLeave={e => {
      e.currentTarget.style.background = "rgba(245,158,11,0.1)";
      e.currentTarget.style.borderColor = "rgba(245,158,11,0.25)";
    }}>
      ⚡ Upgrade
    </Link>
  );
};

export default PlanBadge;
