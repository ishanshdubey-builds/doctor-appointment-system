import React from "react";
import { useLocation, Link } from "react-router-dom";

const SignupSuccess = () => {
  const location = useLocation();
  const response = location?.state?.responseMessage;
  const message = typeof response === "string"
    ? response
    : response?.message || "Your account has been created successfully.";

  return (
    <div className="auth-wrapper" style={{ padding: "2rem 1rem" }}>
      <div className="auth-card glass-panel" style={{ textAlign: "center", maxWidth: "450px" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem", color: "var(--color-success)" }} aria-hidden="true">✓</div>
        <h2 style={{ color: "var(--color-primary)", marginBottom: "1rem", marginTop: 0 }}>
          Welcome to DAS
        </h2>
        <div style={{ background: "#f4f8f7", padding: "1.25rem", borderRadius: "var(--radius)", border: "1px solid #e1ece9", marginBottom: "1.5rem" }}>
          <p style={{ margin: 0, color: "var(--text-muted)", lineHeight: 1.6 }}>{message}</p>
        </div>
        <Link to="/Signin" className="btn primary-btn auth-btn" style={{ textDecoration: "none" }}>
          Sign in to your account
        </Link>
      </div>
    </div>
  );
};

export default SignupSuccess;
