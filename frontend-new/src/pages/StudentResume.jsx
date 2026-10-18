import { useNavigate } from "react-router-dom";
import StudentSidebar from "../components/StudentSidebar";
export default function StudentResume() {
  const navigate = useNavigate();
  return <div className="dashboard-layout"><StudentSidebar /><main className="dashboard-content"><h1 className="page-title">Resume Management</h1><div className="glass-panel"><h2>Upload your resume</h2><p>PDF resumes can be uploaded from your Edit Profile page. Uploads are stored by the backend and limited to 5 MB.</p><button className="dashboard-action" onClick={() => navigate("/student/edit-profile")}>Open Edit Profile</button></div></main></div>;
}
