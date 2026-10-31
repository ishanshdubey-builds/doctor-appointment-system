import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "./WelcomeComponent.css";
import BookingComponent from "./Booking";
import { useAuth } from "./Securirty/AuthContext";
import api from "../../api/axiosConfig";

export default function WelcomeComponent() {
  const [showBookingComponent, setShowBookingComponent] = useState(false);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);
  const authContext = useAuth();

  useEffect(() => {
    let active = true;

    async function fetchBookings() {
      try {
        // The API returns only appointments owned by the authenticated patient.
        const response = await api.get("/booking");
        const patientBookings = [...response.data].sort((a, b) => {
          const timeA = new Date(`${a.booking_date}T${a.booking_time}`);
          const timeB = new Date(`${b.booking_date}T${b.booking_time}`);
          return timeA - timeB;
        });
        if (active) setBookings(patientBookings);
      } catch (requestError) {
        if (active) setError("Your appointments could not be loaded. Please refresh and try again.");
        console.error("Error fetching bookings:", requestError);
      }
    }

    if (authContext.userId && !authContext.isDoctor) fetchBookings();
    return () => { active = false; };
  }, [authContext.userId, authContext.isDoctor]);

  const handleDownloadPDF = async (reportId) => {
    try {
      const response = await api.get("/downloadReport", {
        params: { report_id: reportId },
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Report_${reportId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (requestError) {
      setError("The report could not be downloaded. Please try again.");
      console.error("Error downloading report:", requestError);
    }
  };

  if (!authContext.isAuthenticated || authContext.isDoctor) {
    return <Navigate to="/" replace />;
  }

  if (!authContext.userId) {
    return <div className="dashboard-wrapper loading-state">Loading your patient dashboard…</div>;
  }

  return (
    <div className="dashboard-wrapper">
      {showBookingComponent ? (
        <BookingComponent />
      ) : (
        <div className="dashboard-grid">
          <div className="dashboard-header glass-panel">
            <p className="dashboard-kicker">PATIENT PORTAL</p>
            <h1 className="welcome-text">Welcome back</h1>
            <p className="dashboard-subtitle">Your appointments and reports, all in one place.</p>
          </div>

          <aside className="dashboard-sidebar">
            <div className="profile-card glass-panel">
              <h3>Patient profile</h3>
              <div className="profile-details">
                <p><strong>Patient ID</strong><span>{authContext.userId}</span></p>
                <p><strong>Account type</strong><span>Patient</span></p>
              </div>
            </div>

            <div className="booking-widget glass-panel">
              <div className="widget-content">
                <span className="widget-icon" aria-hidden="true">＋</span>
                <h3>Need a consultation?</h3>
                <p>Request an appointment with an available doctor.</p>
                <button className="btn primary-btn" onClick={() => setShowBookingComponent(true)}>
                  Book appointment
                </button>
              </div>
            </div>
            {error && <div className="error-alert" role="alert">{error}</div>}
          </aside>

          <section className="dashboard-main glass-panel">
            <div className="table-header">
              <div><p className="dashboard-kicker">YOUR CARE</p><h2>My appointments</h2></div>
              <span className="appointment-count">{bookings.length} total</span>
            </div>

            <div className="table-responsive">
              <table className="modern-table">
                <thead><tr><th>Appointment</th><th>Date</th><th>Time</th><th>Report</th><th>Patient</th></tr></thead>
                <tbody>
                  {bookings.length > 0 ? bookings.map((booking) => {
                    const reportId = booking.reportInfoEntity?.report_id;
                    return (
                      <tr key={booking.booking_id}>
                        <td><strong>#{booking.booking_id}</strong></td>
                        <td>{booking.booking_date}</td>
                        <td>{booking.booking_time}</td>
                        <td>{reportId ? (
                          <button className="btn action-btn" onClick={() => handleDownloadPDF(reportId)}>Download PDF</button>
                        ) : <span className="muted-status">Not available yet</span>}</td>
                        <td>{booking.patient_name}</td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan="5" className="empty-state">No appointments yet. Book a consultation to get started.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
