
import React from "react";

function ViewStudentModal({ student, isOpen, onClose }) {
  if (!isOpen || !student) return null;

  const placementStages = [
    "Applied",
    "Shortlisted",
    "Interview",
    "Selected",
  ];

  const name = student.name || student.display_name || "Student";
  const skills = Array.isArray(student.skills)
    ? student.skills
    : typeof student.skills === "string"
      ? student.skills.split(",").map((skill) => skill.trim()).filter(Boolean)
      : [];

  // Applications must come from the actual student data/API.
  const applications = Array.isArray(student.applications)
    ? student.applications
    : [];

  const resumeAvailable = Boolean(
    student.resume ||
    student.resume_url ||
    student.resumeUrl
  );

  const currentStage = placementStages.indexOf(student.status || "");

  const formatValue = (value) =>
    value !== null && value !== undefined && value !== ""
      ? value
      : "Not provided";

  const getApplicationName = (application) =>
    application.company_name ||
    application.company?.name ||
    application.company ||
    "Company not specified";

  const getApplicationRole = (application) =>
    application.job_title ||
    application.job?.title ||
    application.position ||
    application.role ||
    "Role not specified";

  const getApplicationStatus = (application) =>
    application.status || "Status unavailable";

  const resumeUrl =
    typeof student.resume === "string"
      ? student.resume
      : student.resume_url || student.resumeUrl || null;

  const openResume = () => {
    if (!resumeUrl) return;
    window.open(resumeUrl, "_blank", "noopener,noreferrer");
  };

  const downloadResume = () => {
    if (!resumeUrl) return;

    const link = document.createElement("a");
    link.href = resumeUrl;
    link.download = `${name.replace(/[^a-z0-9_-]/gi, "_")}_resume.pdf`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="view-student-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`${name}'s profile`}
        onClick={(event) => event.stopPropagation()}
        style={{
          maxWidth: "900px",
          width: "95%",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        <button
  type="button"
  className="close-modal"
  onClick={onClose}
  aria-label="Close student profile"
  title="Close"
>
  &times;
</button>

        {/* Student header */}
        <div className="student-profile-header">
          <div
            className="student-avatar"
            style={{
              width: "80px",
              height: "80px",
              fontSize: "2rem",
            }}
          >
            {name.charAt(0).toUpperCase()}
          </div>

          <div>
            <h2>{name}</h2>
            <p>{formatValue(student.rollNo || student.roll_number || student.roll_number_id)}</p>

            <span className="status-badge">
              {formatValue(student.status || student.profile_status)}
            </span>
          </div>
        </div>

        {/* Student information */}
        <div
          className="profile-grid"
          style={{ marginTop: "25px" }}
        >
          <div className="profile-item">
            <label>Email</label>
            <p>{formatValue(student.email)}</p>
          </div>

          <div className="profile-item">
            <label>Phone</label>
            <p>{formatValue(student.phone)}</p>
          </div>

          <div className="profile-item">
            <label>Branch</label>
            <p>
              {formatValue(
                student.branch ||
                student.department_name ||
                student.department
              )}
            </p>
          </div>

          <div className="profile-item">
            <label>CGPA</label>
            <p>{formatValue(student.cgpa)}</p>
          </div>

          <div className="profile-item">
            <label>Graduation Year</label>
            <p>
              {formatValue(
                student.graduation_year ??
                student.graduationYear ??
                student.year
              )}
            </p>
          </div>

          <div className="profile-item">
            <label>Semester</label>
            <p>{formatValue(student.semester)}</p>
          </div>

          <div className="profile-item">
            <label>10th Percentage</label>
            <p>{formatValue(student.tenth_percentage)}</p>
          </div>

          <div className="profile-item">
            <label>12th Percentage</label>
            <p>{formatValue(student.twelfth_percentage)}</p>
          </div>
        </div>

        {/* Skills from the student profile */}
        <div className="profile-section">
          <h3>Skills</h3>

          {skills.length > 0 ? (
            <div className="skill-list">
              {skills.map((skill, index) => (
                <span key={`${skill}-${index}`}>{skill}</span>
              ))}
            </div>
          ) : (
            <p>No skills added to this profile yet.</p>
          )}
        </div>

        {/* Placement progress from the actual student status */}
        <div className="profile-section">
          <h3>Placement Progress</h3>

          {currentStage >= 0 ? (
            <div
              style={{
                display: "flex",
                gap: "10px",
                flexWrap: "wrap",
                marginTop: "15px",
              }}
            >
              {placementStages.map((stage, index) => (
                <div
                  key={stage}
                  style={{
                    padding: "10px 18px",
                    borderRadius: "10px",
                    background:
                      index <= currentStage ? "#2563eb" : "#e5e7eb",
                    color: index <= currentStage ? "#fff" : "#374151",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                  }}
                >
                  {stage}
                </div>
              ))}
            </div>
          ) : (
            <p>
              Placement progress is unavailable because no recognized
              placement status was provided.
            </p>
          )}
        </div>

        {/* Real applications only */}
        <div className="profile-section">
          <h3>Recent Applications</h3>

          {applications.length > 0 ? (
            <div
              style={{
                display: "grid",
                gap: "12px",
                marginTop: "15px",
              }}
            >
              {applications.map((application, index) => (
                <div
                  className="timeline-card"
                  key={
                    application.id ||
                    application.application_id ||
                    `${getApplicationName(application)}-${index}`
                  }
                >
                  <strong>{getApplicationName(application)}</strong>
                  <p>{getApplicationRole(application)}</p>
                  <small>{getApplicationStatus(application)}</small>
                </div>
              ))}
            </div>
          ) : (
            <p>No application records are available for this student.</p>
          )}
        </div>

        {/* Resume actions only when a resume URL is available */}
        <div className="profile-section">
          <h3>Documents</h3>

          {resumeAvailable && resumeUrl ? (
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "15px",
                flexWrap: "wrap",
              }}
            >
              <button
                type="button"
                className="dashboard-action"
                onClick={openResume}
              >
                View Resume
              </button>

              <button
                type="button"
                className="dashboard-action"
                onClick={downloadResume}
              >
                Download Resume
              </button>
            </div>
          ) : (
            <p>No resume has been uploaded or no resume link is available.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewStudentModal;
