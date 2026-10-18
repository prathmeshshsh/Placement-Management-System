import api from "./api";
export const getAnalytics = async () => {
  const [studentsRes, companiesRes, placementsRes, applicationsRes]=await Promise.all([api.get("/students"),api.get("/companies"),api.get("/placements"),api.get("/applications")]);
  const students=studentsRes.data, companies=companiesRes.data, placements=placementsRes.data, applications=applicationsRes.data;
  const placed=applications.filter(a=>["SELECTED","OFFERED"].includes(a.current_status));
  const packages=placements.map(p=>Number(p.package_lpa||0)).filter(n=>n>0);
  const recruiters=companies.map(c=>({company:c.display_name||c.legal_name,hires:placed.filter(a=>a.company_id===c.id).length}));
  return {totalStudents:students.length,placedStudents:placed.length,placementRate:students.length?((placed.length/students.length)*100).toFixed(1):"0.0",highestPackage:packages.length?Math.max(...packages):0,averagePackage:packages.length?(packages.reduce((a,b)=>a+b,0)/packages.length).toFixed(1):"0.0",branchStats:[],packageDistribution:[{name:"< 10 LPA",value:packages.filter(x=>x<10).length},{name:"10-20 LPA",value:packages.filter(x=>x>=10&&x<=20).length},{name:"> 20 LPA",value:packages.filter(x=>x>20).length}],placementTrend:[],topRecruiters:recruiters};
};
