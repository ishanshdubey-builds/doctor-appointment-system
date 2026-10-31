import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "./Securirty/AuthContext";

const BookingSuccess = () => {
  const location = useLocation();
  const auth = useAuth();
  const response = location?.state?.responseMessage;
  const message = typeof response === "string"
    ? response
    : response?.response || "Your appointment request has been submitted successfully.";

  return (
    <div className="auth-wrapper" style={{ padding: "2rem 1rem" }}>
      <div className="auth-card glass-panel" style={{ textAlign: "center", maxWidth: "450px" }}>
        <div style={{ fontSize: "3rem", marginBottom: "1rem", color: "var(--color-success)" }} aria-hidden="true">✓</div>
        <h2 style={{ color: "var(--color-success)", marginBottom: "1rem", marginTop: 0 }}>
          Booking Confirmed
        </h2>
        <div style={{ background: "#f4f8f7", padding: "1.25rem", borderRadius: "var(--radius)", border: "1px solid #e1ece9", marginBottom: "1.5rem" }}>
          <p style={{ margin: 0, color: "var(--text-dark)", lineHeight: 1.6 }}>{message}</p>
          {response?.booking_id && <p style={{ margin: ".7rem 0 0", color: "var(--text-muted)", fontSize: ".78rem" }}>Appointment reference: {response.booking_id}</p>}
        </div>
        <Link to={auth.userId ? `/welcome/${auth.userId}` : "/"} className="btn primary-btn auth-btn" style={{ textDecoration: "none" }}>
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default BookingSuccess;
