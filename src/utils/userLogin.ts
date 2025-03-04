/**
 * Utility functions for authentication
 */

/**
 * Get the authentication token from localStorage
 */
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminToken");
}

/**
 * Get the authenticated user from localStorage
 */
export function getAuthUser(): any | null {
  if (typeof window === "undefined") return null;

  const userJson = localStorage.getItem("adminUser");
  if (!userJson) return null;

  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
}

/**
 * Check if the current user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

/**
 * Check if the current user is an admin
 */
export function isUserAdmin(): boolean {
  const user = getAuthUser();
  return user?.role === "admin";
}

/**
 * Clear authentication data (logout)
 */
export function clearAuth(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("adminToken");
  localStorage.removeItem("adminUser");
}

/**
 * Get authorization headers for API requests
 */
export function getAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
