// -------------------------------------------------------------
// Booking.jsx - Create Appointment Component
// Allows authenticated patients to schedule consultations
// -------------------------------------------------------------

// Import core React hooks for state and component lifecycle management
import { useEffect, useState } from "react";

// Import navigation hook to route after successful bookings
import { useNavigate, Navigate } from "react-router-dom";

// Import custom styling for the booking form context
import "./Booking.css";

// Import authentication context to link bookings to current user
import { useAuth } from "./Securirty/AuthContext";

// Import API configuration
import api from "../../../api/axiosConfig";

// Component accepts an optional onBookingMade prop (though primarily uses routing)
export default function BookingComponent({ onBookingMade }) {
  // Initialize component state containing all required booking payload fields
  const [formData, setFormData] = useState({
    doctor_id: "",
    patient_id: "",
    patient_name: "",
    age: 0,
    contact: "", // Store as string to handle varying formats cleanly
    booking_date: "",
    booking_time: "",
    booking_type: "",
    payment_mode: "",
  });

  // State variable holding the final confirmation string returned by API
  const [responseMessage, setResponseMessage] = useState("");
  
  // State variable storing mapped validation errors for form feedback
  const [errors, setErrors] = useState({});
  
  // State variable tracking available doctors fetched from backend
  const [doctorList, setDoctorList] = useState([]);

  // Initialize generic react-router programmatic navigator
  const navigate = useNavigate();
  
  // Destructure contextual user data from singleton Auth state
  const { user, doctor, isAuthenticated } = useAuth();
  
  // Safety check yielding active user ID if defined
  const userId = user ? user.user_id : "";

  // Component Mounting side-effect: pull available doctors from the DB
  useEffect(() => {
    // Invoke immediately upon rendering
    fetchDoctorList();
  }, []); // Empty dependency array means runs once on mount

  // Asynchronous abstraction requesting doctor records from Spring
  const fetchDoctorList = async () => {
    try {
      // Basic GET request hitting open endpoint via Axios
      const response = await api.get("/doctorlist");
      
      // Axios directly parses JSON into the data object
      const data = response.data;
      
      // Log array locally to ensure successful backend wiring
      console.log("Doctors Fetched:", data);

      // Mutate local React state injecting the array into the UI
      setDoctorList(data);
    } catch (error) {
      // Catch misconfigured URLs or closed backend instances
      console.error("Error fetching doctor list: ", error);
    }
  };

  // Helper calculating the literal current time string allowing minimal time threshold
  const getCurrentTime = () => {
    // Instantialize standard js Date object for "now"
    const now = new Date();
    
    // Convert string-held form state date into a real date object
    const selectedDate = new Date(formData.booking_date);

    // Ensure the system only rate-limits time if strictly booking 'today'
    if (selectedDate.toDateString() === now.toDateString()) {
      // Calculate scalar minute value relative to start of day
      const totalMinutes = now.getHours() * 60 + now.getMinutes();
      
      // Format hour bounds back down to modular arrays
      const minutes = (totalMinutes % (24 * 60)) % 60;
      const hours = Math.floor(totalMinutes / 60) % 24;

      // Concatenate forcing HH:MM format using padStart utility via string casting
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
    } else {
      // Return unconstrained boundary if booking in future days
      return "";
    }
  };

  // Form input validation block prior to payload dispatch
  const validateForm = () => {
    // Assume validity unless explicitly marked false
    let valid = true;
    
    // Temporary dictionary collating string messages
    const newErrors = {};

    // Validate textual username
    if (!formData.patient_name.trim()) {
      newErrors.patient_name = "Patient Name is required";
      valid = false;
    }

    // Validate numeric physiological requirement
    if (!formData.age || formData.age.toString().trim() === "" || formData.age == 0) {
      newErrors.age = "Valid Patient Age is required";
      valid = false;
    }

    // Validate telecom contact array format strictness
    if (!formData.contact) {
      newErrors.contact = "Contact number is required";
      valid = false;
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = "Contact number is invalid (Must be 10 digits)";
      valid = false;
    }

    // Validate date boundary object
    if (!formData.booking_date.trim()) {
      newErrors.booking_date = "Appointment Date is required";
      valid = false;
    }

    // Validate literal time requirement
    if (!formData.booking_time.trim()) {
      newErrors.booking_time = "Appointment Time is required";
      valid = false;
    }

    // Verify user explicitly chose a practicing doctor
    if (!formData.doctor_id.trim()) {
      newErrors.doctor_id = "Please select an available Doctor";
      valid = false;
    }

    // Ensure urgency meta-level was set
    if (!formData.booking_type.trim()) {
      newErrors.booking_type = "Booking type must be specified";
      valid = false;
    }

    // Assure financial structure checks out
    if (!formData.payment_mode.trim()) {
      newErrors.payment_mode = "Payment method must be selected";
      valid = false;
    }

    // Write transient object over state tracker
    setErrors(newErrors);
    
    // Return explicit boolean marker
    return valid;
  };

  // Asynchronous network submission handler reacting to Submit button
  const handleSubmit = async (e) => {
    // Disables browser's native GET-postback behavior
    e.preventDefault();

    // Condition triggering ONLY if previous verification matrix succeeds
    if (validateForm()) {
      try {
        // Construct standard POST fetch pointing to endpoint via Axios
        const response = await api.post("/Patientbooking", { ...formData, patient_id: userId });

        // Absorb resultant payload parsing
        const data = response.data;

        // Check if internal HTTP codes represent a 2xx success stream
        if (response.status === 200) {
          // Pass success string into active UI
          setResponseMessage(data.response);
          // Auto-route patient strictly towards completion overview screen tracking state context globally
          navigate("/bookingsuccess", { state: { responseMessage: data } });
        } else {
          // If 400 or 5xx code, trigger manual thrown error dropping into Catch clause
          throw new Error(data.response || "Unknown error occurred.");
        }
      } catch (error) {
        // Output developer console traces
        console.error("Booking Exception:", error);
        // Fire generic browser alert signaling terminal logic failure
        alert("Booking Failed: Please verify connection and try again.");
      }
    }
  };

  // Pre-render hook avoiding unauthorized data viewing (blocks doctors and logged-out users)
  if (!isAuthenticated || doctor) {
    // Navigate home natively if guard checks fail
    return <Navigate to="/" />;
  }

  // Primary rendering execution wrapping form UI
  return (
    // Outer responsive framework mapping standard dashboard context
    <div className="booking-card glass-panel" style={{ margin: '1rem auto' }}>
      
      {/* Visual top indicator defining form context bounds */}
      <h2 style={{ color: 'var(--color-primary)', borderBottom: '2px solid rgba(0,0,0,0.05)', paddingBottom: '1rem', marginBottom: '1.5rem', marginTop: 0 }}>
        Schedule New Consultation
      </h2>

      {/* Main submission interceptor wiring form layout */}
      <form onSubmit={handleSubmit} className="form-grid">
        
        {/* Full-width block declaring primary patient record */}
        <div className="form-group full-width">
          <label className="form-label">Patient Full Name*</label>
          <input
            className="form-input"
            type="text"
            placeholder="Ensure spelling matches records"
            value={formData.patient_name}
            onChange={(e) => setFormData({ ...formData, patient_name: e.target.value })}
          />
          {errors.patient_name && <div className="error-message">{errors.patient_name}</div>}
        </div>

        {/* Half-width block tracking demographic numeric boundaries */}
        <div className="form-group">
          <label className="form-label">Patient Age*</label>
          <select
            className="form-input"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
          >
            <option value="">Select current age</option>
            {/* Creates an inline dynamic array sizing exactly 120 elements mapping to raw indexes */}
            {[...Array(120)].map((_, index) => (
              <option key={index+1} value={index+1}>
                {index+1} Years Old
              </option>
            ))}
          </select>
          {errors.age && <div className="error-message">{errors.age}</div>}
        </div>

        {/* Contact info element */}
        <div className="form-group">
          <label className="form-label">Contact Number*</label>
          <input
            className="form-input"
            type="text"
            placeholder="10 digit active phone"
            value={formData.contact}
            onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          />
          {errors.contact && <div className="error-message">{errors.contact}</div>}
        </div>

        {/* Native date integration restricting out-of-bounds history */}
        <div className="form-group">
          <label className="form-label">Desired Appointment Date*</label>
          <input
            className="form-input"
            type="date"
            value={formData.booking_date}
            // ISO Split ensuring min validation locks client browser past today literally
            min={new Date().toISOString().split("T")[0]} 
            onChange={(e) =>
              setFormData({
                ...formData,
                booking_date: new Date(e.target.value).toISOString().split("T")[0],
              })
            }
          />
          {errors.booking_date && <div className="error-message">{errors.booking_date}</div>}
        </div>

        {/* Native time integration utilizing local function logic boundary bounds */}
        <div className="form-group">
          <label className="form-label">Desired Appointment Time*</label>
          <input
            className="form-input"
            type="time"
            value={formData.booking_time}
            // Bind manual temporal check matching today threshold 
            min={getCurrentTime()} 
            onChange={(e) => setFormData({ ...formData, booking_time: e.target.value })}
          />
          {errors.booking_time && <div className="error-message">{errors.booking_time}</div>}
        </div>

        {/* Dynamic relational component utilizing external DB hook logic mapping IDs to Display UI */}
        <div className="form-group full-width">
          <label className="form-label">Select Physician / Specialist*</label>
          <select
            className="form-input"
            value={formData.doctor_id}
            onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
          >
            <option value="">-- View Available Doctors --</option>
            {/* Inject dynamic iteration based sequentially directly upon DB responses */}
            {doctorList.map((doctor) => (
              <option key={doctor.doctor_id} value={doctor.doctor_id}>
                Dr. {doctor.doctor_name} — {doctor.specification || "General Practice"}
              </option>
            ))}
          </select>
          {errors.doctor_id && <div className="error-message">{errors.doctor_id}</div>}
        </div>

        {/* Static prioritization classification input */}
        <div className="form-group">
          <label className="form-label">Consultation Type*</label>
          <select
            className="form-input"
            value={formData.booking_type}
            onChange={(e) => setFormData({ ...formData, booking_type: e.target.value })}
          >
            <option value="">Select priority basis</option>
            <option value="Regular_checkup">Standard Regular Checkup</option>
            <option value="Emergency">Emergency Evaluation</option>
          </select>
          {errors.booking_type && <div className="error-message">{errors.booking_type}</div>}
        </div>

        {/* Explicit explicit form input toggling cash tracking mechanics */}
        <div className="form-group" style={{ 
            display: 'flex', flexDirection: 'column', padding: '0.8rem', 
            background: 'rgba(0,0,0,0.02)', borderRadius: 'var(--radius)', border: '1px solid rgba(0,0,0,0.05)'
        }}>
          <label className="form-label" style={{ marginBottom: '0.5rem' }}>Payment Method*</label>
          <label className="radio-item" style={{ color: 'var(--text-dark)' }}>
            <input
              style={{ marginRight: '0.5rem', accentColor: 'var(--color-primary)', transform: 'scale(1.2)' }}
              type="radio"
              value="Cash"
              checked={formData.payment_mode === "Cash"}
              onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value })}
            />
            Cash on Arrival
          </label>
          {errors.payment_mode && <div className="error-message">{errors.payment_mode}</div>}
        </div>

        {/* Submit activation boundary binding logic directly to overarching handler map */}
        <div className="form-group full-width" style={{ marginTop: '1rem' }}>
          <button className="btn primary-btn auth-btn" type="submit">
             Secure Appointment
          </button>
        </div>
      </form>

      {/* Conditionally rendered server callback visual verification marker */}
      {responseMessage && <p className="response-msg" style={{ textAlign: 'center', color: 'var(--color-success)', marginTop: '1rem' }}>{responseMessage}</p>}
    </div>
  );
}
