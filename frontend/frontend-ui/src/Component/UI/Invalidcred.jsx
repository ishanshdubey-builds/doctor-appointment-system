// -------------------------------------------------------------
// Invalidcred.jsx - Error Interstitial View
// Displays when static routing triggers an invalid credential flow 
// (Typically replaced by in-component errors, but maintained for route fallback)
// -------------------------------------------------------------

// Import navigation linkage hook from router
import { Link } from "react-router-dom";

// Standard exported function for error view component map
export default function InvalidCred() {
  // Visual layout encapsulating failure state aesthetically
  return (
    // Utilize existing authentication grid logic to center frame
    <div className="auth-wrapper" style={{ padding: '2rem 1rem' }}>
      
      {/* Maintain uniform sizing boundary across error/success states */}
      <div className="auth-card glass-panel" style={{ textAlign: "center", maxWidth: "450px" }}>
        
        {/* Explicit danger icon alerting user to credential failure immediately */}
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>&#10060;</div>
        
        {/* Strong header utilizing brand danger signaling coloring */}
        <h2 style={{ color: 'var(--color-danger)', marginBottom: '1rem', marginTop: 0 }}>
          Authentication Failed
        </h2>
        
        {/* Descriptive block instructing next procedural steps gently */}
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.05)', 
          padding: '1.5rem', 
          borderRadius: 'var(--radius)',
          border: '1px solid rgba(239, 68, 68, 0.2)',
          marginBottom: '1.5rem',
          color: 'var(--text-dark)'
        }}>
          <p style={{ margin: 0 }}>
            We could not verify your credentials. Please double-check your username and password, then try logging in again.
          </p>
        </div>

        {/* Call to action pushing user firmly back into standard flow constraints */}
        <Link to="/login" className="btn secondary-btn auth-btn" style={{ textDecoration: 'none', display: 'block' }}>
          Back to Login
        </Link>
        
      </div>
    </div>
  );
}
