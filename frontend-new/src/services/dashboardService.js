import api from "./api";
export const getDashboardData = async () => {
  const [studentsRes, companiesRes, placementsRes, applicationsRes] = await Promise.all([api.get("/students"), api.get("/companies"), api.get("/placements"), api.get("/applications")]);
  const students=studentsRes.data, companies=companiesRes.data, placements=placementsRes.data, applications=applicationsRes.data;
  const placed=applications.filter(a=>["SELECTED","OFFERED"].includes(a.current_status)).length;
  const activeJobs=placements.filter(p=>["OPEN","PUBLISHED"].includes(p.status)).length;
  const packageValues=placements.map(p=>Number(p.package_lpa||0)).filter(n=>n>0);
  return { dashboardStats:{students:students.length,companies:companies.length,placements:activeJobs,applications:applications.length}, dashboardKPIs:{placementRate:students.length?((placed/students.length)*100).toFixed(1):"0.0",avgPackage:packageValues.length?(packageValues.reduce((a,b)=>a+b,0)/packageValues.length).toFixed(1):"0.0",highestPackage:packageValues.length?Math.max(...packageValues):0,recruiters:companies.length}, placementTrendData:[],companyHiringData:[],recentActivities:[],upcomingEvents:[] };
};
