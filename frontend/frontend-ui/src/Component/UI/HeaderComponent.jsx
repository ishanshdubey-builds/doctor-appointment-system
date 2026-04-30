// -------------------------------------------------------------
// HeaderComponent.jsx - Main Application Navigation Bar
// Displays the branding and navigation links based on user authentication state
// -------------------------------------------------------------

// Import React library to create components
import React from "react";

// Import styling specifically scoped for the header
import "./Header.css";

// Import Link from react-router-dom for client-side routing without page reloads
import { Link } from "react-router-dom";

// Import the authentication context hook strictly to check user login status
import { useAuth } from "./Securirty/AuthContext";

// Define the functional component for the application header
const HeaderComponent = () => {
  // Use the authentication context hook to retrieve global state
  const authContext = useAuth();
  
  // Extract the boolean value indicating if a user is currently logged in
  const isAuthenticated = authContext.isAuthenticated;

  // Define a helper function to handle the logout process
  function logout() {
    // Call the signOut method provided by the authentication context
    authContext.signOut();
  }

  // Render the header JSX layout
  return (
    // Use semantic HTML header tag with a modern container class
    <header className="app-header glass-panel">
      {/* Container for the logo/brand name */}
      <div className="logo-container">
        {/* Wrap branding in a Link to redirect to the home page easily */}
        <Link to="/" className="brand-link">
          <h1 className="brand-logo">DAS</h1>
        </Link>
      </div>

      {/* Semantic navigation wrapper representing the main menu */}
      <nav className="main-nav">
        {/* Main list for navigation items */}
        <ul className="nav-list">
          
          {/* Always display the Home link */}
          <li className="nav-item">
            {/* Utilize Link component for rapid client-side routing */}
            <Link to="/" className="nav-link">Home</Link>
          </li>

          {/* Conditional rendering: If the user is logged in, show their account link */}
          {isAuthenticated && authContext.userId && (
            <li className="nav-item">
              {/* Dynamic route generation based on the user's role and ID */}
              <Link
                to={
                  authContext.isDoctor
                    ? `/DoctorComponent/${authContext.userId}`
                    : `/welcome/${authContext.userId}`
                }
                className="nav-link"
              >
                Account
              </Link>
            </li>
          )}

          {/* Conditional rendering: If the user is NOT logged in, show Signin/Signup */}
          {!isAuthenticated && (
            <li className="nav-item">
              <Link className="nav-link nav-btn primary-btn" to="/Signin">
                Signin / Signup
              </Link>
            </li>
          )}

          {/* Conditional rendering: If the user IS logged in, show Logout */}
          {isAuthenticated && (
            <li className="nav-item">
              <Link className="nav-link nav-btn danger-btn" to="/signout" onClick={logout}>
                Logout
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

// Export the HeaderComponent to be used in the main App layout
export default HeaderComponent;
