import { useState, useEffect } from "react";
import "./WelcomeComponent.css";
import { useNavigate, useParams } from "react-router-dom";
import BookingComponent from "./Booking";
import { useAuth } from "./Securirty/AuthContext";
import api from "../../../api/axiosConfig";

export default function WelcomeComponent() {
  const { user_id } = useParams();
  const [showBookingComponent, setShowBookingComponent] = useState(false);
  const [error, setError] = useState(null);
  const [bookings, setBookings] = useState([]);
  const authContext = useAuth();

  const handleSubmit = () => {
    setShowBookingComponent(true);
  };

  useEffect(() => {
    async function fetchBookings() {
      try {
        const response = await api.get("/booking");
        const bookingsData = response.data;

        const liveBookings = bookingsData.sort((a, b) => {
          const timeA = new Date(`${a.booking_date}T${a.booking_time}`);
          const timeB = new Date(`${b.booking_date}T${b.booking_time}`);
          return timeB - timeA;
        });

        const patientBooking = liveBookings.filter(
          (booking) => booking.patient_id === authContext.userId
        );

        setBookings(patientBooking);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    }

    if (authContext.userId) {
      fetchBookings();
    }
    // Polling removed for performance
  }, [authContext.userId]);

  const handleDownloadPDF = async (report_id) => {
    try {
      const response = await api.get(`/downloadReport/booking`, {
        params: { report_id },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Report_${report_id}.pdf`;
      document.body.appendChild(link);
      link.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      setError("Failed to download report");
      console.error("Error downloading report:", error);
    }
  };

  if (!authContext.userId) {
    return <div className="dashboard-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}><h2 style={{ color: 'white' }}>Loading profile...</h2></div>;
  }

  return (
    <div className="dashboard-wrapper">
      {showBookingComponent ? (
        <BookingComponent />
      ) : (
        <div className="dashboard-grid">

          <div className="dashboard-header glass-panel">
            <h1 className="welcome-text">Welcome back, User {authContext.userId}</h1>
          </div>

          <div className="dashboard-sidebar">
            <div className="profile-card glass-panel">
              <h3>Patient Profile</h3>
              <div className="profile-details">
                <p><strong>Patient ID:</strong> {authContext.userId}</p>
                <p><em>Sensitive details removed from local storage for security</em></p>
              </div>
            </div>

            <div className="booking-widget glass-panel">
              <div className="widget-content">
                <h3>Need a consultation?</h3>
                <p>Schedule a new appointment easily.</p>
                <button className="btn primary-btn" onClick={handleSubmit}>
                  Book Appointment
                </button>
              </div>
            </div>

            {error && <div className="error-alert">{error}</div>}
          </div>

          <div className="dashboard-main glass-panel">
            <div className="table-header">
              <h2>My Appointments</h2>
            </div>

            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Appt ID</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Report ID</th>
                    <th>Patient Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <tr key={booking.booking_id}>
                        <td>{booking.booking_id}</td>
                        <td>{booking.booking_date}</td>
                        <td>{booking.booking_time}</td>
                        <td>{booking.report_id}</td>
                        <td>{booking.patient_name}</td>
                        <td>
                          <button
                            className="btn action-btn"
                            onClick={() => handleDownloadPDF(booking.report_id)}
                          >
                            Download PDF
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="empty-state">No appointments found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
