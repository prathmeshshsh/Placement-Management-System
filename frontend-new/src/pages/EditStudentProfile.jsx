import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
import api from "../services/api";

const asLines = (value) => Array.isArray(value) ? value.join("\n") : (value || "");
const asList = (value) => String(value || "").split("\n").map((x) => x.trim()).filter(Boolean);

export default function EditStudentProfile() {
  const [profile, setProfile] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [resume, setResume] = useState(null);
  const [resumeMessage, setResumeMessage] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    Promise.all([api.get("/students/me"), api.get("/departments")])
      .then(([p, d]) => {
        setProfile({ ...p.data, skills: asLines(p.data.skills), projects: asLines(p.data.projects), certifications: asLines(p.data.certifications) });
        setDepartments(d.data);
      })
      .catch((e) => setError(e.response?.data?.detail || "Unable to load profile."));
  }, []);

  const change = (key, value) => setProfile((p) => ({ ...p, [key]: value }));
  const save = async () => {
    setSaving(true); setError("");
    try {
      await api.patch("/students/me", {
        display_name: profile.display_name,
        email: profile.email,
        roll_number: profile.roll_number,
        department_id: profile.department_id,
        program: profile.program || "General",
        graduation_year: Number(profile.graduation_year),
        semester: profile.semester === "" ? null : Number(profile.semester),
        cgpa: profile.cgpa === "" || profile.cgpa == null ? null : Number(profile.cgpa),
        tenth_percentage: profile.tenth_percentage === "" ? null : Number(profile.tenth_percentage),
        twelfth_percentage: profile.twelfth_percentage === "" ? null : Number(profile.twelfth_percentage),
        active_backlogs: Number(profile.active_backlogs || 0),
        historical_backlogs: Number(profile.historical_backlogs || 0),
        phone: profile.phone || null,
        linkedin_url: profile.linkedin_url || null,
        github_url: profile.github_url || null,
        portfolio_url: profile.portfolio_url || null,
        skills: asList(profile.skills),
        projects: asList(profile.projects),
        certifications: asList(profile.certifications),
      });
      nav("/student/profile");
    } catch (e) { setError(e.response?.data?.detail || "Could not save profile."); }
    finally { setSaving(false); }
  };

  const uploadResume = async () => {
    if (!resume) { setResumeMessage("Choose a PDF file first."); return; }
    const data = new FormData(); data.append("file", resume);
    setResumeMessage("");
    try {
      const result = await api.post("/students/me/resume", data, { headers: { "Content-Type": "multipart/form-data" } });
      setResumeMessage(`Uploaded ${result.data.filename} successfully.`); setResume(null);
    } catch (e) { setResumeMessage(e.response?.data?.detail || "Resume upload failed."); }
  };

  const field = (key, label, options = {}) => <label className="profile-edit-field" key={key}>{label}{options.select ? <select value={profile[key] ?? ""} onChange={(e) => change(key, e.target.value)}>{options.select.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select> : options.textarea ? <textarea rows={4} value={profile[key] ?? ""} placeholder={options.placeholder || "Enter one item per line"} onChange={(e) => change(key, e.target.value)} /> : <input type={options.type || "text"} min={options.min} max={options.max} step={options.step} value={profile[key] ?? ""} onChange={(e) => change(key, e.target.value)} readOnly={options.readOnly} />}</label>;

  return <div className="dashboard-layout"><StudentSidebar /><main className="dashboard-content"><h1 className="page-title">Edit Profile</h1><p>Keep your personal, academic and professional details up to date.</p>{error && <p role="alert" className="form-error">{error}</p>}{profile && <div className="glass-panel profile-edit-form">
    <h2>Personal Information</h2><div className="profile-edit-grid">
      {field("display_name", "Full Name")}{field("roll_number", "Roll Number")}{field("email", "Email", { type: "email" })}{field("phone", "Phone Number", { type: "tel" })}
    </div>
    <h2>Academic Information</h2><div className="profile-edit-grid">
      {field("department_id", "Branch", { select: departments.map((d) => ({ value: d.id, label: d.name })) })}{field("semester", "Semester", { type: "number", min: 1, max: 12 })}{field("cgpa", "CGPA", { type: "number", min: 0, max: 10, step: "0.01" })}{field("graduation_year", "Graduation Year", { type: "number", min: 2000, max: 2100 })}{field("tenth_percentage", "10th Percentage", { type: "number", min: 0, max: 100, step: "0.01" })}{field("twelfth_percentage", "12th Percentage", { type: "number", min: 0, max: 100, step: "0.01" })}{field("active_backlogs", "Current Backlogs", { type: "number", min: 0 })}
    </div>
    <h2>Skills</h2>{field("skills", "Skills (one per line)", { textarea: true, placeholder: "Python\nSQL\nReact" })}
    <h2>Projects</h2>{field("projects", "Projects (one per line)", { textarea: true, placeholder: "Project name - short description" })}
    <h2>Certifications</h2>{field("certifications", "Certifications (one per line)", { textarea: true, placeholder: "Certification name" })}
    <h2>Resume PDF Upload</h2><div className="resume-upload"><input type="file" accept="application/pdf,.pdf" onChange={(e) => setResume(e.target.files?.[0] || null)} /><button type="button" className="table-btn" onClick={uploadResume}>Upload PDF</button>{resumeMessage && <p role="status">{resumeMessage}</p>}<small>PDF only, maximum 5 MB.</small></div>
    <h2>Professional Links</h2><div className="profile-edit-grid">{field("linkedin_url", "LinkedIn Profile", { type: "url" })}{field("github_url", "GitHub Profile", { type: "url" })}{field("portfolio_url", "Portfolio Website", { type: "url" })}</div>
    <div className="modal-actions"><button className="cancel-btn" onClick={() => nav("/student/profile")}>Cancel</button><button className="save-btn" disabled={saving} onClick={save}>{saving ? "Saving…" : "Save Profile"}</button></div>
  </div>}</main></div>;
}
