// -------------------------------------------------------------
// Signup.jsx - Registration Component
// Manages the creation of both Patient and Doctor accounts
// -------------------------------------------------------------

// Import state management hook from React
import { useState } from "react";

// Import styles specific to the signup form
import "./signup.css";

// Import navigation hook to redirect the user after registration
import { useNavigate } from "react-router-dom";

// Import axios configuration
import api from "api/axiosConfig";

// Export the main functional component for Signup
export default function Signup() {
  // Initialize the form state with fields for both patients and doctors
  const [formData, setFormData] = useState({
    user_id: "",
    name: "",
    date_of_birth: "",
    address: "",
    contact: "",
    other_contact: "",
    role: "", // "Patient" or "Doctor"
    email_id: "",
    password: "",
    // The following fields are specific to the Doctor role
    specification: "",
    doctor_id: "",
    hospital_address: "",
    official_contact: "",
    official_email_id: "",
  });

  // State object to hold validation error messages for specific fields
  const [errors, setErrors] = useState({});

  // State to hold any server response messages upon successful registration
  const [responseMessage, setResponseMessage] = useState("");

  // Instantiate the navigation hook
  const navigate = useNavigate();

  // Helper function to validate form data before submission
  const validateForm = () => {
    // Flag to track overall validity
    let valid = true;

    // Temporary object to collect specific error messages
    const newErrors = {};

    // Validate if Name is populated
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    // Validate if Email is populated and formatted correctly
    if (!formData.email_id.trim()) {
      newErrors.email_id = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email_id)) {
      newErrors.email_id = "Email is invalid";
      valid = false;
    }

    // Validate if Username is populated
    if (!formData.user_id.trim()) {
      newErrors.user_id = "Username is required";
      valid = false;
    }

    // Validate if Date of Birth is populated
    if (!formData.date_of_birth.trim()) {
      newErrors.date_of_birth = "Date of Birth is required";
      valid = false;
    }

    // Validate primary contact number format (10 digits)
    if (!formData.contact) {
      newErrors.contact = "Contact number is required";
      valid = false;
    } else if (!/^\d{10}$/.test(formData.contact)) {
      newErrors.contact = "Contact number is invalid (must be 10 digits)";
      valid = false;
    }

    // Validate secondary contact number format (10 digits)
    if (!formData.other_contact) {
      newErrors.other_contact = "Other Contact is required";
      valid = false;
    } else if (!/^\d{10}$/.test(formData.other_contact)) {
      newErrors.other_contact = "Contact number is invalid (must be 10 digits)";
      valid = false;
    }

    // Validate Address
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
      valid = false;
    }

    // Validate Role selection
    if (!formData.role.trim()) {
      newErrors.role = "Role is required";
      valid = false;
    }

    // Conditional Validation: Only apply if Role is "Doctor"
    if (formData.role === "Doctor") {
      if (!formData.specification.trim()) {
        newErrors.specification = "Specification is required";
        valid = false;
      }
      if (!formData.doctor_id.trim()) {
        newErrors.doctor_id = "Doctor ID is required";
        valid = false;
      }
      if (!formData.hospital_address.trim()) {
        newErrors.hospital_address = "Hospital address is required";
        valid = false;
      }
      if (!formData.official_contact.trim()) {
        newErrors.official_contact = "Official contact is required";
        valid = false;
      }
      if (!formData.official_email_id.trim()) {
        newErrors.official_email_id = "Official email ID is required";
        valid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.official_email_id)) {
        newErrors.official_email_id = "Official email ID is invalid";
        valid = false;
      }
    }

    // Validate general Password
    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
      valid = false;
    }

    // Write temporary object back to component state
    setErrors(newErrors);

    // Return boolean indicating form status
    return valid;
  };

  // Process form submission asynchronously
  const handleSubmit = async (e) => {
    // Stop the browser from executing default form submisson behaviors
    e.preventDefault();

    // Check if form data is valid before attempting network request
    if (validateForm()) {
      try {
        // First Network Request: Check if username is already taken
        const userIdAvailabilityResponse = await api.get(
          `/checkuserId?user_id=${formData.user_id}`
        );

        // If not available, notify the user and halt submission
        if (!userIdAvailabilityResponse.data.available) {
          setErrors({ ...errors, user_id: "This username is already taken" });
          return;
        }

        // Second Network Request: Post the signup data to the backend
        const response = await api.post("/auth/signup", formData);

        // Handle successful response
        if (response.status === 200) {
          setResponseMessage(response.data.message);
          // Route user to success screen and pass response data
          navigate("/signupsuccess", { state: { responseMessage: response.data } });
        }

        // Reset local state if signup is flawless (though navigate usually unmounts)
        setFormData({
          user_id: "", name: "", date_of_birth: "", address: "",
          contact: "", other_contact: "", role: "", email_id: "",
          password: "", specification: "", doctor_id: "",
          hospital_address: "", official_contact: "", official_email_id: "",
        });
      } catch (error) {
        // Catch any network or logical errors and notify user
        console.error("Error:", error);
        alert("Failed to sign up. Detailed error logs in console.");
      }
    }
  };

  // Render the User Registration Form
  return (
    // Outer responsive layout container 
    <div className="auth-wrapper">
      {/* Reused auth-card but with extended signup-card width */}
      <div className="auth-card signup-card glass-panel">

        <h2 className="auth-title">Create an Account</h2>
        <p className="auth-subtitle">Join DAS and manage your healthcare seamlessly.</p>

        {/* Registration form calling handleSubmit */}
        <form onSubmit={handleSubmit} className="form-grid">

          {/* Name Input */}
          <div className="form-group">
            <label className="form-label">Full Name*</label>
            <input
              className="form-input"
              type="text"
              placeholder="e.g. John Doe"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>

          {/* Email Input */}
          <div className="form-group">
            <label className="form-label">Email Address*</label>
            <input
              className="form-input"
              type="email"
              placeholder="e.g. name@example.com"
              value={formData.email_id}
              onChange={(e) => setFormData({ ...formData, email_id: e.target.value })}
            />
            {errors.email_id && <div className="error-message">{errors.email_id}</div>}
          </div>

          {/* User ID/Username Input */}
          <div className="form-group">
            <label className="form-label">Username*</label>
            <input
              className="form-input"
              type="text"
              placeholder="Choose a unique username"
              value={formData.user_id}
              onChange={(e) => setFormData({ ...formData, user_id: e.target.value })}
            />
            {errors.user_id && <div className="error-message">{errors.user_id}</div>}
          </div>

          {/* DOB Input */}
          <div className="form-group">
            <label className="form-label">Date of Birth*</label>
            <input
              className="form-input"
              type="date"
              value={formData.date_of_birth}
              onChange={(e) => {
                const dateValue = e.target.value;
                setFormData({
                  ...formData,
                  // Safely reformat or store the date as needed 
                  date_of_birth: dateValue ? new Date(dateValue).toISOString().split("T")[0] : "",
                });
              }}
            />
            {errors.date_of_birth && <div className="error-message">{errors.date_of_birth}</div>}
          </div>

          {/* Primary Contact Input */}
          <div className="form-group">
            <label className="form-label">Primary Contact*</label>
            <input
              className="form-input"
              type="text"
              placeholder="10 digit phone number"
              value={formData.contact}
              onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
            />
            {errors.contact && <div className="error-message">{errors.contact}</div>}
          </div>

          {/* Secondary Contact Input */}
          <div className="form-group">
            <label className="form-label">Other Contact*</label>
            <input
              className="form-input"
              type="text"
              placeholder="Alternative 10 digit number"
              value={formData.other_contact}
              onChange={(e) => setFormData({ ...formData, other_contact: e.target.value })}
            />
            {errors.other_contact && <div className="error-message">{errors.other_contact}</div>}
          </div>

          {/* Address Input - Spans full grid width */}
          <div className="form-group full-width">
            <label className="form-label">Home Address*</label>
            <input
              className="form-input"
              type="text"
              placeholder="Full physical address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            {errors.address && <div className="error-message">{errors.address}</div>}
          </div>

          {/* Password Input */}
          <div className="form-group full-width">
            <label className="form-label">Password*</label>
            <input
              className="form-input"
              type="password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          {/* Account Role Selection */}
          <div className="form-group full-width">
            <label className="form-label">I am registering as a:*</label>
            <div className="radio-group">
              <label className="radio-item text-dark">
                <input
                  type="radio"
                  value="Patient"
                  checked={formData.role === "Patient"}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
                Patient
              </label>

              <label className="radio-item text-dark">
                <input
                  type="radio"
                  value="Doctor"
                  checked={formData.role === "Doctor"}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                />
                Doctor
              </label>
            </div>
            {errors.role && <div className="error-message">{errors.role}</div>}
          </div>

          {/* Dynamic Section: Rendered ONLY if the Doctor role is selected */}
          {formData.role === "Doctor" && (
            <div className="form-grid full-width" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(0,0,0,0.1)' }}>
              <div className="form-group full-width">
                <h4 style={{ margin: 0, color: 'var(--color-primary)' }}>Doctor Professional Details</h4>
              </div>

              <div className="form-group">
                <label className="form-label">Medical Specification*</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="e.g. Cardiologist"
                  value={formData.specification}
                  onChange={(e) => setFormData({ ...formData, specification: e.target.value })}
                />
                {errors.specification && <div className="error-message">{errors.specification}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Doctor ID / License*</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Official ID number"
                  value={formData.doctor_id}
                  onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
                />
                {errors.doctor_id && <div className="error-message">{errors.doctor_id}</div>}
              </div>

              <div className="form-group full-width">
                <label className="form-label">Hospital Address*</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Practicing hospital address"
                  value={formData.hospital_address}
                  onChange={(e) => setFormData({ ...formData, hospital_address: e.target.value })}
                />
                {errors.hospital_address && <div className="error-message">{errors.hospital_address}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Official Contact*</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Work phone number"
                  value={formData.official_contact}
                  onChange={(e) => setFormData({ ...formData, official_contact: e.target.value })}
                />
                {errors.official_contact && <div className="error-message">{errors.official_contact}</div>}
              </div>

              <div className="form-group">
                <label className="form-label">Official Email*</label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Professional email"
                  value={formData.official_email_id}
                  onChange={(e) => setFormData({ ...formData, official_email_id: e.target.value })}
                />
                {errors.official_email_id && <div className="error-message">{errors.official_email_id}</div>}
              </div>
            </div>
          )}

          {/* Sign Up Activation Button */}
          <div className="form-group full-width" style={{ marginTop: "1rem" }}>
            <button className="btn primary-btn auth-btn" type="submit">
              Complete Registration
            </button>
          </div>
        </form>

        {/* Output server response messages */}
        {responseMessage && <p className="response-msg">{responseMessage}</p>}
      </div>
    </div>
  );
}
