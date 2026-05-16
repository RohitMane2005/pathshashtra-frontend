import { Component } from "react";

/**
 * FE-04 FIX: React Error Boundary.
 *
 * Without this, any uncaught JavaScript error in the component tree
 * crashes the entire app to a blank white screen.
 *
 * Wrap at the route level to catch page-specific errors without taking
 * down the entire app.
 *
 * Usage:
 *   <ErrorBoundary fallback={<h2>Something went wrong.</h2>}>
 *     <SomePage />
 *   </ErrorBoundary>
 *
 *   Or use the default fallback UI by just wrapping with <ErrorBoundary>.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary] Caught error:", error, info);
    // TODO: send to error tracking service (Sentry, etc.)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div style={{
          minHeight: "60vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "2rem",
          gap: "1rem",
        }}>
          <div style={{ fontSize: 48 }}>⚠️</div>
          <h2 style={{ color: "var(--text-primary)", margin: 0 }}>
            Something went wrong
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: 400 }}>
            An unexpected error occurred. Please try again or refresh the page.
          </p>
          {process.env.NODE_ENV === "development" && this.state.error && (
            <pre style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "1rem",
              fontSize: 12,
              maxWidth: 600,
              overflow: "auto",
              textAlign: "left",
              color: "var(--text-secondary)",
            }}>
              {this.state.error.toString()}
            </pre>
          )}
          <div style={{ display: "flex", gap: 12 }}>
            <button
              onClick={this.handleRetry}
              style={{
                padding: "0.5rem 1.25rem",
                borderRadius: 8,
                background: "var(--green)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Try Again
            </button>
            <button
              onClick={() => window.location.href = "/dashboard"}
              style={{
                padding: "0.5rem 1.25rem",
                borderRadius: 8,
                background: "var(--bg-tertiary, #374151)",
                color: "var(--text-primary)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
