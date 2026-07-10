export type UserRole = "admin" | "editor" | "decideur";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export const getCurrentUser = (): AuthUser | null => {
  if (typeof window === "undefined") return null;

  const rawUser = localStorage.getItem("user");
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser) as AuthUser;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

export const hasRole = (roles: UserRole[]): boolean => {
  const user = getCurrentUser();
  return !!user && roles.includes(user.role);
};

export const canManageUsers = () => hasRole(["admin"]);
export const canViewStats = () => hasRole(["admin", "decideur"]);
export const canCreateConvention = () => hasRole(["admin", "editor"]);
export const canEditConvention = () => hasRole(["admin", "editor"]);
export const canDeleteConvention = () => hasRole(["admin"]);

export const clearSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
