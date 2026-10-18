function Announcements() {
  return (
    <section className="announcement-section">

      <div className="section-header">
        <span>ANNOUNCEMENTS</span>
        <h2>Latest Updates</h2>
      </div>

      <div className="timeline">

        <div className="timeline-item">
          <h3>Amazon Hiring Drive</h3>
          <p>Registration opens soon.</p>
        </div>

        <div className="timeline-item">
          <h3>TCS Placement Registration</h3>
          <p>Applications are now open.</p>
        </div>

        <div className="timeline-item">
          <h3>Mock Interview Session</h3>
          <p>Training workshop this week.</p>
        </div>

      </div>

    </section>
  );
}

export default Announcements;