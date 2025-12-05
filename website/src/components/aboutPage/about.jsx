import './about.css';
import Bar from '../homePage/bar';
import logo from './logo.jpg';

function About() {
  return (
    <div className="about-page">
      <Bar />

      {/* HERO SECTION */}
      <section className="about-hero">
        <h1 className="about-title">Stay Safe. Stay Connected.</h1>

        <p className="about-intro">
          Your neighborhood hub for <strong>local events</strong>,
          <strong> real-time safety updates</strong>, and 
          <strong> community conversations</strong>.
        </p>
      </section>

      {/* ABOUT PLATFORM */}
      <section className="about-section">
        <h3 className="section-title">What is LOOP?</h3>

        <p className="section-text">
          LOOP combines incident reports, local events, and real-time chat into a single platform.  
          Get live updates about incidents near you, discover local happenings, and connect with your community — all in one place!
        </p>

        <p className="section-text">
          Whether it’s a transit delay, a street closure, an emergency alert, or a neighborhood meetup, LOOP keeps you informed and involved.
        </p>
      </section>

      {/* TEAM SECTION */}
        <section className="about-section">
            <h3 className="section-title">Learn More About the Team on LinkedIn</h3>

            <div className="team-grid">
                <a href="" target="_blank" rel="noopener noreferrer">
                <div className="team-card">Team Member 1</div>
                </a>
                <a href="" target="_blank" rel="noopener noreferrer">
                <div className="team-card">Team Member 2</div>
                </a>
                <a href="https://www.linkedin.com/in/angelapzhang" target="_blank" rel="noopener noreferrer">
                <div className="team-card">Angela Zhang</div>
                </a>
                <a href="" target="_blank" rel="noopener noreferrer">
                <div className="team-card">Team Member 4</div>
                </a>
            </div>
        </section>

    </div>
  );
}

export default About;
