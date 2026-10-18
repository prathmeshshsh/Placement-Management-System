import { useEffect, useState } from "react";
import CompanySidebar from "../components/CompanySidebar";
import api from "../services/api";

export default function CompanyProfile() {
  const [company, setCompany] = useState(null);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    Promise.all([api.get("/companies/mine"), api.get("/auth/me")]).then(([c, u]) => {
      if (Array.isArray(c.data)) throw new Error("Your recruiter account is linked to multiple companies. Contact an administrator to choose the active company.");
      setCompany(c.data); setForm({ legal_name: c.data.legal_name || "", display_name: c.data.display_name || "", industry: c.data.industry || "", website: c.data.website || "", package_lpa: c.data.package_lpa ?? "", eligibility_cgpa: c.data.eligibility_cgpa ?? "", positions: c.data.positions ?? "" }); setUser(u.data);
    }).catch(e => setError(e.response?.data?.detail || e.message || "No company profile is linked to this recruiter account."));
  }, []);
  const change = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const save = async () => {
    setSaving(true); setError(""); setMessage("");
    try {
      const result = await api.patch(`/companies/${company.id}`, { ...form, package_lpa: form.package_lpa === "" ? null : Number(form.package_lpa), eligibility_cgpa: form.eligibility_cgpa === "" ? null : Number(form.eligibility_cgpa), positions: form.positions === "" ? null : Number(form.positions) });
      setCompany(result.data); setEditing(false); setMessage("Company details updated successfully.");
    } catch (e) { setError(e.response?.data?.detail || "Could not update company details."); }
    finally { setSaving(false); }
  };
  const field = (key, label, type = "text") => <label className="profile-edit-field" key={key}>{label}<input type={type} value={form?.[key] ?? ""} onChange={e => change(key, e.target.value)} /></label>;
  return <div className="dashboard-layout"><CompanySidebar /><main className="dashboard-content"><h1 className="page-title">Company Profile</h1>{error && <p role="alert" className="form-error">{error}</p>}{message && <p role="status">{message}</p>}{company && <div className="glass-panel" style={{ maxWidth: 1000 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}><div><h2>{company.display_name}</h2><p>{company.legal_name}</p></div>{!editing && <button className="dashboard-action" onClick={() => { setForm({ legal_name: company.legal_name || "", display_name: company.display_name || "", industry: company.industry || "", website: company.website || "", package_lpa: company.package_lpa ?? "", eligibility_cgpa: company.eligibility_cgpa ?? "", positions: company.positions ?? "" }); setEditing(true); setMessage(""); }}>Edit Company Details</button>}</div>
    {editing ? <><div className="profile-edit-grid" style={{ marginTop: 20 }}>{field("display_name", "Company Display Name")}{field("legal_name", "Legal Name")}{field("industry", "Industry")}{field("website", "Website", "url")}{field("package_lpa", "Highest Package (LPA)", "number")}{field("eligibility_cgpa", "Minimum CGPA", "number")}{field("positions", "Available Positions", "number")}</div><div className="modal-actions"><button className="cancel-btn" onClick={() => setEditing(false)} disabled={saving}>Cancel</button><button className="save-btn" onClick={save} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button></div></> : <div className="profile-grid">{[["Industry",company.industry],["Website",company.website],["Status",company.status],["Package (LPA)",company.package_lpa],["Eligibility CGPA",company.eligibility_cgpa],["Positions",company.positions],["Recruiter account",user?.email_normalized]].map(([k,v])=><div className="info-box" key={k}><span>{k}</span><h3>{v ?? "Not set"}</h3></div>)}</div>}
  </div>}{!company&&!error&&<p>Loading company profile…</p>}</main></div>;
}
