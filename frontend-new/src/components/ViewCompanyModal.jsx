
function ViewCompanyModal({ company, isOpen, onClose }) {
  if (!isOpen || !company) return null;

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="view-student-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="company-modal-title"
      >
        <button
          type="button"
          className="close-modal"
          onClick={onClose}
          aria-label="Close company details"
        >
          ✕
        </button>

        <h2 id="company-modal-title">{company.name}</h2>

        <div className="profile-grid">
          <div className="profile-item">
            <label>Sector</label>
            <p>{company.sector || "N/A"}</p>
          </div>

          <div className="profile-item">
            <label>Package</label>
            <p>
              {company.package != null
                ? `${company.package} LPA`
                : "N/A"}
            </p>
          </div>

          <div className="profile-item">
            <label>Eligibility</label>
            <p>{company.eligibility || "N/A"}</p>
          </div>

          <div className="profile-item">
            <label>Positions</label>
            <p>{company.positions ?? "N/A"}</p>
          </div>

          <div className="profile-item">
            <label>Status</label>
            <p>{company.status || "N/A"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewCompanyModal;
