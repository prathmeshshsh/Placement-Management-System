import api from "./api";

const graduationYear = (value) => {
  const n = Number(value);
  return n >= 2000 ? n : new Date().getFullYear() + Math.max(0, 4 - (n || 4));
};

const mapStudent = (s, departments = []) => {
  const department = departments.find((d) => d.id === s.department_id);
  return {
    id: s.user_id,
    name: s.display_name,
    rollNo: s.roll_number,
    email: s.email,
    phone: s.phone || "",
    semester: s.semester ?? "",
    tenthPercentage: s.tenth_percentage ?? "",
    twelfthPercentage: s.twelfth_percentage ?? "",
    linkedinUrl: s.linkedin_url || "",
    githubUrl: s.github_url || "",
    portfolioUrl: s.portfolio_url || "",
    skills: s.skills || [],
    projects: s.projects || [],
    certifications: s.certifications || [],
    // Branch is the department, not the degree/program name.
    branch: s.department_code || department?.code || "Not set",
    departmentId: s.department_id,
    departmentName: s.department_name || department?.name || "",
    year: s.graduation_year,
    cgpa: s.cgpa ?? "",
    status: s.profile_status || "INCOMPLETE",
    program: s.program || "General",
    activeBacklogs: s.active_backlogs ?? 0,
    historicalBacklogs: s.historical_backlogs ?? 0,
  };
};

const getDepartments = async () => (await api.get("/departments")).data;

const ensureDepartment = async (branch, knownDepartments = null) => {
  const departments = knownDepartments || await getDepartments();
  const code = String(branch || "GENERAL").trim().toUpperCase().replace(/[^A-Z0-9_-]/g, "").slice(0, 40) || "GENERAL";
  let department = departments.find((d) => d.code.toUpperCase() === code);
  if (!department) {
    department = (await api.post("/departments", {
      code,
      name: String(branch || "General").trim(),
    })).data;
  }
  return department;
};

export const getStudents = async () => {
  const [studentResponse, departments] = await Promise.all([
    api.get("/students"),
    getDepartments(),
  ]);
  return studentResponse.data.map((student) => mapStudent(student, departments));
};

export const createStudent = async (student) => {
  const department = await ensureDepartment(student.branch || student.program);
  const result = (await api.post("/students", {
    email: student.email,
    display_name: student.name || student.display_name,
    roll_number: student.rollNo || student.roll_number,
    department_id: department.id,
    program: student.program || student.branch || "General",
    graduation_year: graduationYear(student.graduation_year || student.year || 4),
    cgpa: student.cgpa === "" || student.cgpa == null ? null : Number(student.cgpa),
    active_backlogs: Number(student.activeBacklogs || 0),
    historical_backlogs: Number(student.historicalBacklogs || 0),
    initial_password: student.initialPassword,
    phone: student.phone || null,
  })).data;
  return mapStudent(result, await getDepartments());
};

export const updateStudent = async (id, student) => {
  // Department changes must update department_id. Updating only `program`
  // leaves the student's actual department unchanged in the database.
  const department = await ensureDepartment(student.branch || student.program);
  const result = (await api.patch(`/students/${id}`, {
    display_name: student.name,
    roll_number: student.rollNo,
    department_id: department.id,
    program: student.program || "General",
    graduation_year: graduationYear(student.graduation_year || student.year || 4),
    cgpa: student.cgpa === "" || student.cgpa == null ? null : Number(student.cgpa),
    active_backlogs: Number(student.activeBacklogs || 0),
    historical_backlogs: Number(student.historicalBacklogs || 0),
    phone: student.phone || null,
  })).data;
  return mapStudent(result, await getDepartments());
};

export const deleteStudentApi = async (id) => {
  await api.delete(`/students/${id}`);
  return true;
};
