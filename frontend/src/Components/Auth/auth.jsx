export const login = (token = "demo-token") => {
  localStorage.setItem("auth_token", token);
};

export const logout = () => {
  localStorage.removeItem("auth_token");
  window.location.replace("/login");
};

export const isAuthenticated = () => {
  return !!localStorage.getItem("auth_token");
};
