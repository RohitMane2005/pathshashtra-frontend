import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

/**
 * HIGH-04 FIX: Dedicated 404 page.
 * Previously all unknown routes silently redirected to "/", causing:
 *   - Users to lose context about what went wrong
 *   - Search engines to index duplicate content at the root URL
 *   - No indication that a bookmarked/shared link was broken
 */
const NotFound = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 80,
          fontWeight: 800,
          color: "var(--green)",
          lineHeight: 1,
          marginBottom: 8,
        }}
      >
        404
      </div>
      <h1
        style={{
          fontSize: 24,
          fontWeight: 700,
          color: "var(--text)",
          marginBottom: 8,
        }}
      >
        Page not found
      </h1>
      <p
        style={{
          fontSize: 15,
          color: "var(--text-muted)",
          maxWidth: 400,
          marginBottom: 32,
          lineHeight: 1.6,
        }}
      >
        The page you're looking for doesn't exist or has been moved.
        Check the URL or head back to a familiar place.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button
          onClick={() => window.history.back()}
          className="btn-secondary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            textDecoration: "none",
            fontSize: 14,
            cursor: "pointer",
          }}
        >
          <ArrowLeft size={14} /> Go back
        </button>
        <Link
          to="/dashboard"
          className="btn-primary"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            textDecoration: "none",
            fontSize: 14,
          }}
        >
          <Home size={14} /> Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
