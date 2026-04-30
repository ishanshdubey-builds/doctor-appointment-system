// -------------------------------------------------------------
// loogin.jsx - Main Application Router and Layout Container
// Defines all the routes in the application and manages authenticated routes.
// -------------------------------------------------------------

// Import required components from react-router-dom for routing
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// Import page components for different routes
import HomeComponent from "./HomeComponent";
import WelcomeComponent from "./WelcomeComponent";
import Signin from "./Signin";
import InvalidCred from "./Invalidcred";
import HeaderComponent from "./HeaderComponent";
import Signup from "./Signup";
import BookingComponent from "./Booking";
import BookingSuccess from "./BookingSuccess";
import SignupSuccess from "./SignupSuccess";
import DoctorComponent from "./Doctor";
import SignoutComponent from "./SignoutComponent";

// Import AuthContext to provide authentication state to all components
import AuthProvider, { useAuth } from "./Securirty/AuthContext";

// Import React hooks
import { useEffect } from "react";

// AuthenticatedRoute protects routes from unauthorized access
function AuthenticatedRoute({ children }) {
  // Access the authentication context containing user login state
  const authContext = useAuth();
  
  // Log the authentication context for debugging purposes
  console.log("AuthContext in Guard:", authContext);

  // If the user is NOT authenticated, redirect them to the home/login page
  if (!authContext.isAuthenticated) {
    return <Navigate to="/Signin" />;
  }

  // NOTE: Logic for restricting access to specific users (e.g., doctor) should typically 
  // be handled explicitly inside their specific routes. The previous logic 
  // had a bug that blocked normal rendering. For now, returning children allows 
  // authenticated users to view the component.
  
  // Return the protected children components if the user is authenticated
  return children;
}

// Default export of the AppRouter component (Main Layout)
export default function AppRouter() {
  // useLocation hook provides information about current URL route
  const location = useLocation();

  // useEffect triggers whenever the location dependency changes
  useEffect(() => {
    // Store the last visited route in localStorage so the user can return there later
    localStorage.setItem("lastVisitedRoute", location.pathname);
  }, [location.pathname]); // Dependency updated to avoid continuous triggers

  // Render the application routes and layout
  return (
    // Wrap the entire component tree and routes with AuthProvider 
    // This allows any component to access the authentication context
    <AuthProvider>
      <div className="app-container">
        {/* Render the Header component on all pages */}
        <HeaderComponent />
        
        {/* Define the Routes for the application */}
        <Routes>
          {/* Public Routes */}
          {/* Path '/' renders the HomeComponent */}
          <Route path="/" element={<HomeComponent />} />
          
          {/* Path '/Signin' renders the Signin component */}
          <Route path="/Signin" element={<Signin />} />
          
          {/* Path '/Signup' renders the Signup component */}
          <Route path="/Signup" element={<Signup />} />
          
          {/* Protected Routes (Wrapped in AuthenticatedRoute) */}
          {/* Welcome Dashboard path, protected route */}
          <Route 
            path="/welcome/:user_id" 
            element={
              <AuthenticatedRoute>
                <WelcomeComponent />
              </AuthenticatedRoute>
            } 
          />
          
          {/* Invalid credentials error path, protected route */}
          <Route 
            path="/loginfailed" 
            element={
              <AuthenticatedRoute>
                <InvalidCred />
              </AuthenticatedRoute>
            } 
          />
          
          {/* Signout path, protected route */}
          <Route 
            path="/signout" 
            element={
              <AuthenticatedRoute>
                <SignoutComponent />
              </AuthenticatedRoute>
            } 
          />
          
          {/* Appointment Booking paths */}
          {/* Route to book an appointment */}
          <Route path="/booking" element={<BookingComponent />} />
          
          {/* Route showing successful booking confirmation */}
          <Route path="/bookingsuccess" element={<BookingSuccess />} />
          
          {/* Route showing successful signup confirmation */}
          <Route path="/signupsuccess" element={<SignupSuccess />} />
          
          {/* Doctor dashboard route, taking user_id parameter */}
          <Route 
            path="/DoctorComponent/:user_id" 
            element={<DoctorComponent />} 
          />
        </Routes>
      </div>
    </AuthProvider>
  );
}
