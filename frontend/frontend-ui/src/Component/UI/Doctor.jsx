// -------------------------------------------------------------
// Doctor.jsx - Doctor Dashboard Component
// Displays doctor profile, pending appointments, and past appointments
// Allows uploading reports and marking appointment status
// -------------------------------------------------------------

// Import necessary React hooks for state, effect, and DOM references
import { useEffect, useRef, useState } from "react";

// Import custom authentication hook to check user access and info
import { useAuth } from "./Securirty/AuthContext";

// Import routing components for navigation and parameter extraction
import { Navigate, useNavigate, useParams } from "react-router-dom";

// Import axios configuration for API calls
import api from "api/axiosConfig";

// Import specific FontAwesome icons for the user interface
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUndo } from "@fortawesome/free-solid-svg-icons";

// Import component-specific styles
import "./Doctor.css";

// Main export for the Doctor dashboard component
export default function DoctorComponent() {
  // Authentication context provides current user data and login status
  const authContext = useAuth();

  // Extract user_id from the routing parameters (e.g. /DoctorComponent/:user_id)
  const { user_id } = useParams();

  // State to hold upcoming/current appointments
  const [bookings, setBookings] = useState([]);

  // State to hold past appointments
  const [pastBookings, setPastBookings] = useState([]);

  // State map tracking whether an upload succeeded/failed by booking ID
  const [uploadStatus, setUploadStatus] = useState({});

  // State holding metadata parameters before a file is chosen
  const [uploadParams, setUploadParams] = useState({});

  // State map linking booking ID to a backend-generated report ID
  const [uploadStatusMap, setUploadStatusMap] = useState({});

  // State for rendering download/upload errors natively
  const [error, setError] = useState(null);

  // State map for tracking doctor-selected status (right/wrong checkmarks) per booking
  const [selectedOption, setSelectedOption] = useState({});

  // Reference hook pointing to the hidden file input element for uploading PDFs
  const fileInputRef = useRef(null);

  // Updates the localized option state (right/wrong) and mirrors to localStorage
  const markOption = (bookingId, option) => {
    setSelectedOption((prevOptions) => {
      const updatedOptions = { ...prevOptions, [bookingId]: option };
      // Save stringified JSON of the mapping to browser's local storage
      localStorage.setItem("selectedOptions", JSON.stringify(updatedOptions));
      return updatedOptions;
    });
  };

  // Removes a previously marked option (right/wrong) and mirrors to localStorage
  const resetOption = (bookingId) => {
    setSelectedOption((prevOptions) => {
      const updatedOptions = { ...prevOptions, [bookingId]: null };
      // Save the cleared state back to local storage
      localStorage.setItem("selectedOptions", JSON.stringify(updatedOptions));
      return updatedOptions;
    });
  };

  // Lifecycle Effect: On initial render, retrieve stored checkmark states
  useEffect(() => {
    // Attempt parsing existing data from localStorage
    const storedOptions = JSON.parse(localStorage.getItem("selectedOptions"));
    if (storedOptions) {
      // Hydrate state if options existed in a prior browser session
      setSelectedOption(storedOptions);
    }
  }, []);

  // Lifecycle Effect: Polling current/future bookings every 10 seconds
  useEffect(() => {
    async function fetchBookings() {
      try {
        // GET array of ALL bookings across the system via Axios
        const response = await api.get("/booking");
        const bookingsData = response.data;

        // Get midnight of the current day for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter bookings belonging strictly to today or future dates
        const filteredBookings = bookingsData.filter((booking) => {
          const bookingDate = new Date(booking.booking_date);
          return bookingDate >= today;
        });

        // Sort resulting future bookings in ascending order (soonest first)
        const liveBookings = filteredBookings.sort((a, b) => {
          const timeA = new Date(`${a.booking_date}T${a.booking_time}`);
          const timeB = new Date(`${b.booking_date}T${b.booking_time}`);
          return timeA - timeB;
        });

        // Slice out only bookings corresponding to the logged-in doctor
        const doctorBooking = liveBookings.filter(
          (booking) => booking.doctor_id === authContext.userId
        );

        // Push final curated list to state
        setBookings(doctorBooking);
      } catch (error) {
        console.error("Error fetching live bookings:", error);
      }
    }

    // Call initially on effect trigger
    if (authContext.userId) {
      fetchBookings();
    }
  }, [user_id, authContext.userId]);

  // Lifecycle Effect: Polling entirely past bookings every 90 seconds
  useEffect(() => {
    async function fetchPastBookings() {
      try {
        // GET array of ALL bookings across the system via Axios
        const response = await api.get("/booking");
        const pastBookingsData = response.data;

        // Get midnight of current day for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Filter bookings belonging strictly to days before today
        const filteredBookings = pastBookingsData.filter((booking) => {
          const bookingDate = new Date(booking.booking_date);
          return bookingDate < today;
        });

        // Sort resulting past bookings in descending order (most recent first)
        const pastBookingsList = filteredBookings.sort((a, b) => {
          const timeA = new Date(`${a.booking_date}T${a.booking_time}`);
          const timeB = new Date(`${b.booking_date}T${b.booking_time}`);
          return timeB - timeA;
        });

        // Slice out only bookings corresponding to the logged-in doctor
        const doctorPastBooking = pastBookingsList.filter(
          (booking) => booking.doctor_id === authContext.userId
        );

        // Push final curated list to state
        setPastBookings(doctorPastBooking);
      } catch (error) {
        console.error("Error fetching past bookings:", error);
      }
    }

    // Call initially on effect trigger
    if (authContext.userId) {
      fetchPastBookings();
    }
  }, [user_id, authContext.userId]);

  // Utility to store uploaded report IDs dynamically in localStorage
  const saveReportIdToLocalStorage = (bookingId, reportId) => {
    const storageKey = `report_${bookingId}`;
    localStorage.setItem(storageKey, reportId);
  };

  // Utility to read previously uploaded report IDs mapped to a booking ID
  const getReportIdFromLocalStorage = (bookingId) => {
    const storageKey = `report_${bookingId}`;
    return localStorage.getItem(storageKey);
  };

  // Action hook triggered when "Upload Report" button is clicked
  async function handleReportSubmission(
    booking_id,
    patient_name,
    booking_date,
    patient_id
  ) {
    try {
      // Temporarily store meta-data about the upload target
      setUploadParams({ booking_id, patient_name, booking_date, patient_id });

      // Clear any prior status message for this specific submission
      setUploadStatus((prevStatus) => ({ ...prevStatus, [booking_id]: null }));

      // Trigger the browser's native file explorer dialog via the hidden ref
      fileInputRef.current.click();
    } catch (error) {
      console.error("Error handling report submission opening:", error);
    }
  }

  // Action hook bound natively to the hidden file input's onChange event
  async function handleFileUpload(e) {
    // Destructure target parameters defined immediately prior in handleReportSubmission
    const { booking_id, patient_name, booking_date, patient_id } = uploadParams;

    // Basic verification of metadata
    if (!booking_id || !patient_name || !booking_date || !patient_id) {
      console.error("Booking details not available for file upload");
      return;
    }

    // Get the first file from the input selection arrays
    const file = e.target.files[0];
    if (!file) return;

    // Use FormData object due to multipart/form-data requirements of Spring files
    const formData = new FormData();
    formData.append("booking_report_id", booking_id);
    formData.append("patient_report_name", patient_name);
    // Bind to the currently authenticated user's ID
    formData.append("doctor_report_id", authContext.userId);
    formData.append("booking_date", booking_date);
    formData.append("patient_report_id", patient_id);
    // Explicitly append the binary file payload
    formData.append("pdf", file);

    try {
      // POST the FormData off to the server via Axios
      const response = await api.post("/uploadReport", formData);

      // Decode whatever the server responded
      const responseData = response.data;

      if (response.status === 200) {
        // Tag upload success via status block maps
        setUploadStatus((prevStatus) => ({
          ...prevStatus,
          [booking_id]: "success",
        }));

        // Link response mapping backend ID locally
        setUploadStatusMap((prevMap) => ({
          ...prevMap,
          [booking_id]: responseData.report_id,
        }));

        // Solidify the upload locally across browser sessions
        saveReportIdToLocalStorage(booking_id, responseData.report_id);
      } else {
        // Tag upload failure map
        setUploadStatus((prevStatus) => ({
          ...prevStatus,
          [booking_id]: "failure",
        }));
        console.error("Failed to upload report");
      }
    } catch (error) {
      // Network exceptions or catastrophic failures
      console.error("Error uploading report:", error);
      setUploadStatus((prevStatus) => ({
        ...prevStatus,
        [booking_id]: "failure",
      }));
    }
  }

  // Async handler function to download a report PDF over axios
  const handleDownloadPDF = async (report_id) => {
    try {
      // Configure AXIOS to receive Blob binary format
      const response = await api.get(`/downloadReport`, {
        params: { report_id },
        responseType: "blob",
      });

      // Synthesize Blob with proper mime type matching PDF specification
      const blob = new Blob([response.data], { type: "application/pdf" });

      // Mint browser URL referencing memory blob
      const url = window.URL.createObjectURL(blob);

      // Create synthetic link to bypass pop-up blockers
      const link = document.createElement("a");
      link.href = url;
      // Define filename
      link.download = `Report_${report_id}.pdf`;
      document.body.appendChild(link);

      // Actuate synthetic click
      link.click();

      // Deallocate heap memory and disconnect synthetic link
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      // Throw display error on catch
      setError("Failed to download report");
      console.error("Error downloading report:", error);
    }
  };

  // Pre-render hook avoiding unauthorized data viewing
  if (!authContext.isAuthenticated || !authContext.doctor) {
    // Navigate home natively if guard checks fail
    return <Navigate to="/" />;
  }

  if (!authContext.userId) {
    return <div className="dashboard-wrapper" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}><h2 style={{ color: 'white' }}>Loading profile...</h2></div>;
  }

  // Visual layout for Doctor Dashboard
  return (
    // Single hidden input utilized programmatically by action buttons across both tables
    <div className="dashboard-wrapper">
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileUpload}
      />

      {/* Root responsive grid mapping */}
      <div className="dashboard-grid">

        {/* Banner Section */}
        <div className="dashboard-header glass-panel">
          <h1 className="welcome-text">Dr. {authContext.userId}'s Dashboard</h1>
        </div>

        {/* Sidebar Left Column */}
        <div className="dashboard-sidebar">
          {/* Profile Card utilizing shared variable CSS format */}
          <div className="profile-card glass-panel">
            <h3>Professional Profile</h3>
            <div className="profile-details">
              <p><strong>License ID:</strong> {authContext.userId}</p>
              <p><em>Sensitive details removed from local storage for security</em></p>
            </div>
          </div>

          {/* Persistent general error viewer mapping output text */}
          {error && <div className="error-alert">{error}</div>}
        </div>

        {/* Center Main Dashboard Column */}
        <div className="dashboard-main doctor-main">

          {/* Container wrapper for Live / Future Appointments */}
          <div className="table-block glass-panel" style={{ marginBottom: "2rem" }}>
            <div className="table-header">
              <h2>Pending Appointments</h2>
            </div>
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Appt ID</th>
                    <th>Date / Time</th>
                    <th>Patient Name</th>
                    <th>Report ID</th>
                    <th>Actions</th>
                    <th>Checkoff</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Map over pending upcoming bookings array */}
                  {bookings.map((booking) => (
                    <tr key={booking.booking_id}>
                      <td>{booking.booking_id}</td>
                      {/* Combine date and time for cleaner presentation */}
                      <td>{booking.booking_date} {booking.booking_time}</td>
                      <td>{booking.patient_name}</td>
                      {/* Read mapped localized ID logic onto view */}
                      <td>{getReportIdFromLocalStorage(booking.booking_id) || "-"}</td>

                      {/* Actions Cell binding localized buttons */}
                      <td className="action-cell">
                        <button
                          className="btn secondary-btn small-btn"
                          onClick={() => handleReportSubmission(
                            booking.booking_id, booking.patient_name, booking.booking_date, booking.patient_id
                          )}
                        >
                          Upload
                        </button>
                        {/* Only allow download interaction if we have a locally bound report ID */}
                        {getReportIdFromLocalStorage(booking.booking_id) && (
                          <button
                            className="btn primary-btn small-btn"
                            style={{ marginLeft: '0.5rem' }}
                            onClick={() => handleDownloadPDF(getReportIdFromLocalStorage(booking.booking_id))}
                          >
                            Download
                          </button>
                        )}
                      </td>

                      {/* Manual Verification UI handling Right/Wrong Toggles */}
                      <td className="optionSelection">
                        {selectedOption[booking.booking_id] ? (
                          <div className="toggle-status">
                            {selectedOption[booking.booking_id] === "right" ? (
                              <span className="icon-success">&#10004;</span>
                            ) : (
                              <span className="icon-danger">&#10006;</span>
                            )}
                            <button className="reset-btn" onClick={() => resetOption(booking.booking_id)}>
                              <FontAwesomeIcon icon={faUndo} />
                            </button>
                          </div>
                        ) : (
                          <div className="toggle-actions">
                            <button className="btn-icon success" onClick={() => markOption(booking.booking_id, "right")}>
                              &#10004;
                            </button>
                            <button className="btn-icon danger" onClick={() => markOption(booking.booking_id, "wrong")}>
                              &#10006;
                            </button>
                          </div>
                        )}
                      </td>

                      {/* Display asynchronous backend success states regarding PDF post routing */}
                      <td className="status-cell">
                        {uploadStatus[booking.booking_id] === "success" && (
                          <span className="badge badge-success">Uploaded</span>
                        )}
                        {uploadStatus[booking.booking_id] === "failure" && (
                          <span className="badge badge-danger">Failed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {/* Empty state fallbacks */}
                  {bookings.length === 0 && (
                    <tr><td colSpan="7" className="empty-state">No pending appointments.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Container wrapper for Historic / Past Appointments */}
          <div className="table-block glass-panel">
            <div className="table-header">
              <h2>Past Appointments</h2>
            </div>
            <div className="table-responsive">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Appt ID</th>
                    <th>Date / Time</th>
                    <th>Patient Name</th>
                    <th>Report ID</th>
                    <th>Actions</th>
                    <th>Checkoff</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Duplicate layout specifically mapping over Historic arrays */}
                  {pastBookings.map((booking) => (
                    <tr key={booking.booking_id}>
                      <td>{booking.booking_id}</td>
                      <td>{booking.booking_date} {booking.booking_time}</td>
                      <td>{booking.patient_name}</td>
                      <td>{getReportIdFromLocalStorage(booking.booking_id) || "-"}</td>

                      <td className="action-cell">
                        <button
                          className="btn secondary-btn small-btn"
                          onClick={() => handleReportSubmission(
                            booking.booking_id, booking.patient_name, booking.booking_date, booking.patient_id
                          )}
                        >
                          Upload
                        </button>
                        {getReportIdFromLocalStorage(booking.booking_id) && (
                          <button
                            className="btn primary-btn small-btn"
                            style={{ marginLeft: '0.5rem' }}
                            onClick={() => handleDownloadPDF(getReportIdFromLocalStorage(booking.booking_id))}
                          >
                            Download
                          </button>
                        )}
                      </td>

                      <td className="optionSelection">
                        {selectedOption[booking.booking_id] ? (
                          <div className="toggle-status">
                            {selectedOption[booking.booking_id] === "right" ? (
                              <span className="icon-success">&#10004;</span>
                            ) : (
                              <span className="icon-danger">&#10006;</span>
                            )}
                            <button className="reset-btn" onClick={() => resetOption(booking.booking_id)}>
                              <FontAwesomeIcon icon={faUndo} />
                            </button>
                          </div>
                        ) : (
                          <div className="toggle-actions">
                            <button className="btn-icon success" onClick={() => markOption(booking.booking_id, "right")}>
                              &#10004;
                            </button>
                            <button className="btn-icon danger" onClick={() => markOption(booking.booking_id, "wrong")}>
                              &#10006;
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="status-cell">
                        {uploadStatus[booking.booking_id] === "success" && (
                          <span className="badge badge-success">Uploaded</span>
                        )}
                        {uploadStatus[booking.booking_id] === "failure" && (
                          <span className="badge badge-danger">Failed</span>
                        )}
                      </td>
                    </tr>
                  ))}
                  {/* Historic empty state fallback */}
                  {pastBookings.length === 0 && (
                    <tr><td colSpan="7" className="empty-state">No historical appointments.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
