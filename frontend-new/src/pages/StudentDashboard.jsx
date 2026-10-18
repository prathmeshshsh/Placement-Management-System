import { useEffect, useState } from "react";
import StudentSidebar from "../components/StudentSidebar";
import api from "../services/api";
export default function StudentDashboard(){
 const [profile,setProfile]=useState(null),[applications,setApplications]=useState([]),[interviews,setInterviews]=useState([]),[error,setError]=useState("");
 useEffect(()=>{Promise.all([api.get("/students/me"),api.get("/applications/my"),api.get("/interviews/my")]).then(([p,a,i])=>{setProfile(p.data);setApplications(a.data);setInterviews(i.data)}).catch(e=>setError(e.response?.data?.detail||"Unable to load your live student data."))},[]);
 const count=(...statuses)=>applications.filter(a=>statuses.includes(a.current_status)).length;
 return <div className="dashboard-layout"><StudentSidebar/><main className="dashboard-content"><h1 className="page-title">Welcome{profile?`, ${profile.display_name}`:""}</h1><p>Placement progress from your account records.</p>{error&&<p role="alert">{error}</p>}{!profile&&!error&&<p>Loading your profile…</p>}<div className="kpi-grid"><div className="kpi-card"><h4>Applications</h4><span>{applications.length}</span></div><div className="kpi-card"><h4>Interviews</h4><span>{interviews.length}</span></div><div className="kpi-card"><h4>CGPA</h4><span>{profile?.cgpa ?? "Not set"}</span></div><div className="kpi-card"><h4>Offers</h4><span>{count("OFFERED","SELECTED")}</span></div></div><div className="glass-panel" style={{marginTop:24}}><h2>Upcoming interviews</h2>{interviews.length?interviews.map(i=><div className="top-student" key={i.id}><strong>Round {i.round_number}</strong><span>{i.starts_at?new Date(i.starts_at).toLocaleString():"Time not set"} · {i.status}</span></div>):<p>No interviews scheduled in your account.</p>}</div></main></div>
}
