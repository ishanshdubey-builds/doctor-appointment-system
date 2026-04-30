// -------------------------------------------------------------
// SignupSuccess.jsx - Registration Confirmation View
// Intercepts positive server responses post-signup and displays onboarding
// -------------------------------------------------------------

// Import core React definitions
import React from "react";

// Import navigation routing object to extract payload state and route linking
import { useLocation, Link } from "react-router-dom";

// Component directly maps to the route post-successful user registration
const SignupSuccess = () => {
  // Extract contextual location routing payload mapped by Signup.jsx navigation
  const location = useLocation();
  
  // Default string fallback averting undefined access scenarios
  let responseMessage = "Account created successfully!";

  // Safe traversal confirming route payload contained response string block
  if (location?.state?.responseMessage) {
    if (typeof location.state.responseMessage === "string") {
      // Map textual literal 
      responseMessage = location.state.responseMessage;
    } else if (location.state.responseMessage.response) {
      // Use mapped property block if backend replied with canonical structure
      responseMessage = location.state.responseMessage.response;
    } else {
      // Fallback JSON dump representation 
      responseMessage = JSON.stringify(location.state.responseMessage, null, 2);
    }
  }

  // Visual component boundary defining completion logic
  return (
    // Outer framework vertically and horizontally centering prompt
    <div className="auth-wrapper" style={{ padding: '2rem 1rem' }}>
      
      {/* Boxed panel inheriting standard visual themes */}
      <div className="auth-card glass-panel" style={{ textAlign: "center", maxWidth: "450px" }}>
        
        {/* Celebration icon for immediate visual user feedback */}
        <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>&#127881;</div>
        
        {/* Strong header signifying clear successful registration state */}
        <h2 style={{ color: 'var(--color-primary-dark)', marginBottom: '1rem', marginTop: 0 }}>
          Welcome to the Platform!
        </h2>
        
        {/* Dedicated container displaying server persistence confirmation literal string */}
        <div style={{ 
          background: 'rgba(0,0,0,0.02)', 
          padding: '1.5rem', 
          borderRadius: 'var(--radius)',
          border: '1px solid rgba(0,0,0,0.05)',
          marginBottom: '1.5rem',
          color: 'var(--text-muted)'
        }}>
          <p style={{ margin: 0 }}>{responseMessage}</p>
        </div>

        {/* Dedicated call-to-action pressing user to immediately authenticate with new data */}
        <Link to="/login" className="btn primary-btn auth-btn" style={{ textDecoration: 'none' }}>
          Log In to Account
        </Link>
        
      </div>
    </div>
  );
};

// Export explicit function definition referencing scope limits
export default SignupSuccess;
