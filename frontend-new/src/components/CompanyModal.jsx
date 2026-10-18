import { useEffect, useState } from "react";

const empty = { name: "", sector: "IT", package: "", eligibility: "", positions: "", status: "Active", recruiterName: "", recruiterEmail: "", recruiterPassword: "" };

export default function CompanyModal({ isOpen, onClose, onSave, editingCompany }) {
  const [formData, setFormData] = useState(empty);
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (editingCompany) setFormData({ ...empty, ...editingCompany, recruiterName: "", recruiterEmail: "", recruiterPassword: "" });
    else setFormData(empty);
  }, [editingCompany, isOpen]);
  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = async () => {
    if (!formData.name.trim() || formData.package === "" || formData.eligibility === "" || formData.positions === "") { alert("Please complete all company fields."); return; }
    if (!editingCompany && (!formData.recruiterName.trim() || !formData.recruiterEmail.trim() || formData.recruiterPassword.length < 8)) { alert("Recruiter name, email, and a password of at least 8 characters are required."); return; }
    setSaving(true);
    try { await onSave({ ...formData, id: editingCompany?.id }); onClose(); }
    catch (error) { alert(error?.response?.data?.detail || error?.message || "Could not save company"); }
    finally { setSaving(false); }
  };
  if (!isOpen) return null;
  return <div className="modal-overlay"><div className="student-modal company-modal"><h2>{editingCompany ? "Edit Company" : "Add Company"}</h2>
    <h3>Company Details</h3>
    <input name="name" placeholder="Company Name" value={formData.name} onChange={handleChange} />
    <input name="package" type="number" min="0" step="0.1" placeholder="Highest Package (LPA)" value={formData.package} onChange={handleChange} />
    <input name="eligibility" type="number" min="0" max="10" step="0.1" placeholder="Minimum CGPA" value={formData.eligibility} onChange={handleChange} />
    <input name="positions" type="number" min="0" placeholder="Available Positions" value={formData.positions} onChange={handleChange} />
    <select name="sector" value={formData.sector} onChange={handleChange}><option value="IT">IT</option><option value="Consulting">Consulting</option><option value="Finance">Finance</option><option value="Core">Core</option><option value="Other">Other</option></select>
    <select name="status" value={formData.status} onChange={handleChange}><option value="Active">Active</option><option value="Closed">Closed</option></select>
    {!editingCompany && <><h3>Recruiter Login Credentials</h3><input name="recruiterName" placeholder="Recruiter Full Name" value={formData.recruiterName} onChange={handleChange} /><input name="recruiterEmail" type="email" placeholder="Recruiter Email" value={formData.recruiterEmail} onChange={handleChange} autoComplete="email" /><input name="recruiterPassword" type="password" placeholder="Initial Password (min. 8 characters)" value={formData.recruiterPassword} onChange={handleChange} autoComplete="new-password" /></>}
    <div className="modal-actions"><button className="cancel-btn" onClick={onClose} disabled={saving}>Cancel</button><button className="save-btn" onClick={handleSubmit} disabled={saving}>{saving ? "Saving..." : editingCompany ? "Update Company" : "Create Company + Recruiter"}</button></div>
  </div></div>;
}
