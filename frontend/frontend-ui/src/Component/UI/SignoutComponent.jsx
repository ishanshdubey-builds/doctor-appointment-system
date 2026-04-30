// -------------------------------------------------------------
// SignoutComponent.jsx - Logout Confirmation View
// Provides visual feedback confirming user termination of session
// -------------------------------------------------------------

// Import visual standard linkage mechanism bypassing native browser requests
import { Link } from "react-router-dom";

// Standard function wrapping the confirmation view explicitly
export default function SignoutComponent() {
  // Wrap interface within existing full-screen aesthetic centering methodology
  return (
    // Base wrapper establishing responsive flex behaviors
    <div className="auth-wrapper" style={{ padding: '2rem 1rem' }}>
      
      {/* Explicit bounded container maintaining max-width formatting identical to login */}
      <div className="auth-card glass-panel" style={{ textAlign: "center", maxWidth: "450px" }}>
        
        {/* Wave icon signaling departure utilizing standard OS glyphs safely */}
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>&#128075;</div>
        
        {/* Direct success heading noting process completion gracefully */}
        <h2 style={{ color: 'var(--color-primary-dark)', marginBottom: '1rem', marginTop: 0 }}>
          Session Terminated
        </h2>
        
        {/* Textual block reiterating context clearly separated through borders */}
        <div style={{ 
          background: 'rgba(0,0,0,0.02)', 
          padding: '1.5rem', 
          borderRadius: 'var(--radius)',
          border: '1px solid rgba(0,0,0,0.05)',
          marginBottom: '1.5rem',
          color: 'var(--text-muted)'
        }}>
          <p style={{ margin: 0 }}>
            You have been successfully logged out of the system. Your session data has been cleared securely.
          </p>
        </div>

        {/* Singular interactive path redirecting state entirely out of the platform map mapping towards base routing block */}
        <Link to="/" className="btn primary-btn auth-btn" style={{ textDecoration: 'none', display: 'block' }}>
          Return to Home
        </Link>
        
      </div>
    </div>
  );
}
