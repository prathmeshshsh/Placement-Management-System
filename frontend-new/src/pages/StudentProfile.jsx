import { useEffect, useState } from "react";
import StudentSidebar from "../components/StudentSidebar";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
export default function StudentProfile() {
  const [p, setP] = useState(null); const [departments, setDepartments] = useState([]); const [error, setError] = useState(""); const navigate = useNavigate();
  useEffect(() => { Promise.all([api.get("/students/me"), api.get("/departments")]).then(([profile, depts]) => { setP(profile.data); setDepartments(depts.data); }).catch(e => setError(e.response?.data?.detail || "Unable to load profile.")); }, []);
  const branch = departments.find((d) => d.id === p?.department_id)?.name || "Not set";
  const items = p ? [["Email",p.email],["Phone Number",p.phone],["Roll Number",p.roll_number],["Branch",branch],["Program",p.program],["Semester",p.semester],["Graduation Year",p.graduation_year],["CGPA",p.cgpa],["10th Percentage",p.tenth_percentage],["12th Percentage",p.twelfth_percentage],["Current Backlogs",p.active_backlogs],["Historical Backlogs",p.historical_backlogs],["LinkedIn",p.linkedin_url],["GitHub",p.github_url],["Portfolio",p.portfolio_url],["Profile Status",p.profile_status]] : [];
  return <div className="dashboard-layout"><StudentSidebar/><main className="dashboard-content"><h1 className="page-title">Student Profile</h1>{error&&<p role="alert">{error}</p>}{p&&<div className="glass-panel"><div className="profile-header"><div><h2>{p.display_name}</h2><p>{p.program} · Graduation {p.graduation_year}</p></div><button className="dashboard-action" onClick={()=>navigate("/student/edit-profile")}>Edit Profile</button></div><div className="profile-grid">{items.map(([k,v])=><div className="info-box" key={k}><span>{k}</span><h3>{v === null || v === undefined || v === "" ? "Not set" : v}</h3></div>)}</div><section style={{marginTop:20}}><h3>Skills</h3><p>{(p.skills||[]).join(", ") || "No skills added yet"}</p><h3>Projects</h3><ul>{(p.projects||[]).map((x,i)=><li key={i}>{x}</li>)}</ul><h3>Certifications</h3><ul>{(p.certifications||[]).map((x,i)=><li key={i}>{x}</li>)}</ul></section></div>}{!p&&!error&&<p>Loading profile…</p>}</main></div>;
}
