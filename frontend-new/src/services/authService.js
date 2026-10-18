import api from "./api";

const ROLE_CONFIG = {
  Admin: { route: "/dashboard", roleCode: "ADMIN" },
  Student: { route: "/student-dashboard", roleCode: "STUDENT" },
  Company: { route: "/company-dashboard", roleCode: "HR_RECRUITER" },
};

export const login = async (email, password, selectedRole = "Admin") => {
  const roleConfig = ROLE_CONFIG[selectedRole];
  if (!roleConfig) throw new Error("Choose a valid account type.");

  let response;
  try {
    response = await api.post("/auth/login", {
      email: email.trim().toLowerCase(),
      password,
    });
  } catch (error) {
    const detail = error.response?.data?.detail;
    if (error.response?.status === 401) throw new Error("Invalid email or password, or the account is inactive.");
    if (error.response?.status === 422) throw new Error("Enter a valid email address and password.");
    if (!error.response) throw new Error("Cannot reach the backend. Make sure FastAPI is running at http://127.0.0.1:8000.");
    throw new Error(typeof detail === "string" ? detail : "Unable to sign in. Please try again.");
  }

  const data = response.data;
  if (!data?.access_token || !data?.user) throw new Error("The server returned an incomplete login response.");

  const actualRoles = Array.isArray(data.user.roles) ? data.user.roles : [];
  if (!actualRoles.includes(roleConfig.roleCode)) {
    throw new Error(`This account does not have the ${selectedRole} role. Choose the correct account type or ask an administrator to grant access.`);
  }

  const user = {
    id: data.user.id,
    email: data.user.email_normalized || email.trim().toLowerCase(),
    name: data.user.display_name || "User",
    role: roleConfig.roleCode,
    uiRole: selectedRole,
    route: roleConfig.route,
    accountStatus: data.user.account_status,
  };

  localStorage.setItem("accessToken", data.access_token);
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("role", user.uiRole);
  localStorage.setItem("currentUser", JSON.stringify(user));
  return user;
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("currentUser");
  }
};

export const getCurrentUser = () => {
  try {
    const raw = localStorage.getItem("currentUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};
