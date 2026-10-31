import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import img from "./img/doctor-image.jpg";

const services = [
  { icon: "✚", title: "General consultation", copy: "Routine check-ups and support for everyday health concerns." },
  { icon: "♡", title: "Specialist care", copy: "Connect with doctors and review their areas of speciality." },
  { icon: "◷", title: "Simple scheduling", copy: "Choose a convenient date and time for your appointment." },
];

export default function HomeComponent() {
  return (
    <main className="home-container">
      <section className="home-trustbar" aria-label="Service information">
        <span><i className="trust-dot" /> Patient-first appointment care</span>
        <span>Secure account access</span>
        <span>Appointments and reports in one place</span>
      </section>

      <section className="home-hero">
        <div className="hero-copy">
          <p className="eyebrow">DOCTOR APPOINTMENT SYSTEM</p>
          <h1>Healthcare that fits <span>your life.</span></h1>
          <p className="hero-description">
            Find the right care, connect with a doctor and arrange your next appointment
            with a simple, secure experience.
          </p>
          <div className="hero-actions">
            <Link to="/Signup" className="btn primary-btn">Get started <span aria-hidden="true">→</span></Link>
            <Link to="/Signin" className="text-action">Sign in to your account</Link>
          </div>
          <div className="hero-assurance">
            <span className="assurance-icon">✓</span>
            <span><strong>Your care journey, organised.</strong><small>Appointments and reports in one place</small></span>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-image-frame">
            <img src={img} alt="Healthcare professional ready to help patients" className="modern-img" />
          </div>
          <div className="hero-note">
            <span className="note-icon">✚</span>
            <span><strong>Care starts here</strong><small>Thoughtful access to healthcare</small></span>
          </div>
          <div className="hero-side-label">PATIENT SUPPORT · DOCTOR ACCESS</div>
        </div>
      </section>

      <section className="home-section services-section">
        <div className="section-heading">
          <div><p className="eyebrow">HOW WE HELP</p><h2>Care, made a little simpler.</h2></div>
          <p>Useful tools to help patients and healthcare professionals stay connected.</p>
        </div>
        <div className="service-grid">
          {services.map((service) => (
            <article className="service-card" key={service.title}>
              <span className="service-icon" aria-hidden="true">{service.icon}</span>
              <h3>{service.title}</h3>
              <p>{service.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-process">
        <div className="process-intro">
          <p className="eyebrow">A CLEARER WAY FORWARD</p>
          <h2>Three steps to your appointment.</h2>
          <p>Start with an account, select a doctor and send your appointment request.</p>
          <Link to="/Signup" className="text-action">Create your account <span aria-hidden="true">→</span></Link>
        </div>
        <div className="process-steps">
          <div className="process-step"><span>01</span><div><h3>Create an account</h3><p>Register as a patient or healthcare professional.</p></div></div>
          <div className="process-step"><span>02</span><div><h3>Choose your doctor</h3><p>Review available doctors and their specialities.</p></div></div>
          <div className="process-step"><span>03</span><div><h3>Request a visit</h3><p>Pick a suitable date and time and submit your details.</p></div></div>
        </div>
      </section>

      <footer className="home-footer">
        <div><strong>DAS Healthcare</strong><span>Healthcare access, thoughtfully organised.</span></div>
        <div className="footer-links"><Link to="/Signin">Sign in</Link><Link to="/Signup">Create account</Link></div>
        <small>For emergencies, contact your local emergency service.</small>
      </footer>
    </main>
  );
}
