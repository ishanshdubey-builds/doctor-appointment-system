import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Securirty/AuthContext";
import "./sign.css";

export default function Signin() {
  const [user_id, setUser_id] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // INLINE ERROR STATE
  
  const navigate = useNavigate();
  const authContext = useAuth();

  async function handleLogin(e) {
    e.preventDefault();
    setError(""); // clear previous error
    
    const result = await authContext.login(user_id, password);
    
    if (result.success) {
      if (authContext.isDoctor) {
        navigate(`/DoctorComponent/${user_id}`);
      } else {
        navigate(`/welcome/${user_id}`);
      }
    } else {
      setError(result.message); // Show error directly on page
    }
  }

  function handleSignup() {
    navigate("/Signup");
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card glass-panel">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Please sign in to your account</p>
        
        {/* INLINE ERROR DISPLAY */}
        {error && <div className="error-alert" style={{color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px', border: '1px solid #ef5350'}}>{error}</div>}
        
        <div className="form-group">
          <label className="form-label">Username</label>
          <input
            className="form-input"
            type="text"
            placeholder="Enter your username"
            value={user_id}
            onChange={(e) => setUser_id(e.target.value)}
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            className="form-input"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <div className="auth-actions">
          <button className="btn primary-btn auth-btn" onClick={handleLogin}>
            Sign In
          </button>
        </div>
        
        <div className="auth-footer">
          <p>Don't have an account?</p>
          <button className="btn secondary-btn" onClick={handleSignup}>
            Create an Account
          </button>
        </div>
        
      </div>
    </div>
  );
}
