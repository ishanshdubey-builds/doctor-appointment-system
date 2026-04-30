// -------------------------------------------------------------
// BookingSuccess.jsx - Appointment Confirmation View
// Intercepts positive server responses and displays a success card
// -------------------------------------------------------------

// Import core React definitions
import React from "react";

// Import navigation routing object to extract payload state
import { useLocation, Link } from "react-router-dom";

// Component strictly responsible for showing success state without state mutations
const BookingSuccess = () => {
  // Extract contextual location routing payload mapped by prior form navigation
  const location = useLocation(); 

  // Default string fallback preventing undefined crashes
  let responseMessage = "Error: Confirmation details not accessible.";

  // Safe traversal confirming route payload contained our target response message
  if (location?.state?.responseMessage) {
    // Determine if backend response was passed as string or object natively
    if (typeof location.state.responseMessage === "string") {
      // Map straight textual string
      responseMessage = location.state.responseMessage;
    } else if (location.state.responseMessage.response) {
      // Map nested 'response' property typical from our Java backend mapping
      responseMessage = location.state.responseMessage.response;
    } else {
      // Stringify entirety just in case the object schema shifted
      responseMessage = JSON.stringify(location.state.responseMessage, null, 2);
    }
  }

  // Visual layout rendering mapped to our global app styles
  return (
    // Reutilize authentication wrapper for clean centering and margins
    <div className="auth-wrapper" style={{ padding: '2rem 1rem' }}>
      {/* Container utilizing glassmorphism visual mapping */}
      <div className="auth-card glass-panel" style={{ textAlign: "center", maxWidth: "450px" }}>
        {/* Visual green success icon rendering using system emoji map */}
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>&#10004;&#65039;</div>
        
        {/* Main textual header bound against brand primary scale */}
        <h2 style={{ color: 'var(--color-success)', marginBottom: '1rem', marginTop: 0 }}>
          Booking Confirmed!
        </h2>
        
        {/* Message block displaying exact server response */}
        <div style={{ 
          background: 'rgba(0,0,0,0.02)', 
          padding: '1.5rem', 
          borderRadius: 'var(--radius)',
          border: '1px solid rgba(0,0,0,0.05)',
          marginBottom: '1.5rem',
          color: 'var(--text-dark)'
        }}>
          <p style={{ margin: 0, fontWeight: 500 }}>{responseMessage}</p>
        </div>

        {/* Action button rerouting user back to generic portal space */}
        <Link to="/welcome" className="btn primary-btn auth-btn" style={{ textDecoration: 'none' }}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

// Expose component linearly for the router
export default BookingSuccess;
