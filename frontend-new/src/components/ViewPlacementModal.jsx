function ViewPlacementModal({
  placement,
  isOpen,
  onClose,
}) {
  if (!isOpen || !placement) return null;

  return (
    <div className="modal-overlay">
      <div className="view-student-modal">

        <button
          className="close-modal"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="student-profile-header">
          <div className="student-avatar">
            {placement.companyName?.charAt(0)}
          </div>

          <div>
            <h2>{placement.companyName}</h2>

            <p>{placement.jobRole}</p>

            <span
              className={`status-badge ${(
                placement.status || ""
              ).toLowerCase()}`}
            >
              {placement.status}
            </span>
          </div>
        </div>

        <div className="student-details-grid">

          <div className="detail-card">
            <span>Job Role</span>
            <strong>
              {placement.jobRole}
            </strong>
          </div>

          <div className="detail-card">
            <span>Package</span>
            <strong>
              ₹{placement.package} LPA
            </strong>
          </div>

          <div className="detail-card">
            <span>Eligibility CGPA</span>
            <strong>
              {placement.eligibility}
            </strong>
          </div>

          <div className="detail-card">
            <span>Positions</span>
            <strong>
              {placement.positions}
            </strong>
          </div>

          <div className="detail-card">
            <span>Drive Date</span>
            <strong>
              {placement.driveDate}
            </strong>
          </div>

          <div className="detail-card">
            <span>Application Deadline</span>
            <strong>
              {placement.deadline}
            </strong>
          </div>

        </div>

        <div className="profile-section">

          <h3>Drive Summary</h3>

          <div className="timeline-card">
            Company: {placement.companyName}
          </div>

          <div className="timeline-card">
            Role: {placement.jobRole}
          </div>

          <div className="timeline-card">
            Package: ₹{placement.package} LPA
          </div>

          <div className="timeline-card">
            Minimum CGPA Required: {placement.eligibility}
          </div>

          <div className="timeline-card">
            Open Positions: {placement.positions}
          </div>

        </div>

      </div>
    </div>
  );
}

export default ViewPlacementModal;