import { getAuthUser, isAuthenticated, getAuthToken } from "@/utils/auth";

describe("Auth Utilities", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe("getAuthUser", () => {
    it("returns null when no user is stored", () => {
      expect(getAuthUser()).toBeNull();
    });

    it("returns the user object when a valid user is stored", () => {
      const user = { id: "1", name: "Test User", role: "admin" };
      localStorage.setItem("adminUser", JSON.stringify(user));
      expect(getAuthUser()).toEqual(user);
    });

    it("returns null and logs an error when stored user data is invalid", () => {
      localStorage.setItem("adminUser", "invalid json");
      const consoleSpy = jest.spyOn(console, "error").mockImplementation();
      expect(getAuthUser()).toBeNull();
      expect(consoleSpy).toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe("isAuthenticated", () => {
    it("returns false when no token or user is stored", () => {
      expect(isAuthenticated()).toBe(false);
    });

    it("returns true when both token and user are stored", () => {
      localStorage.setItem("adminToken", "fake-token");
      localStorage.setItem("adminUser", JSON.stringify({ id: "1" }));
      expect(isAuthenticated()).toBe(true);
    });

    it("returns false when only token is stored", () => {
      localStorage.setItem("adminToken", "fake-token");
      expect(isAuthenticated()).toBe(false);
    });

    it("returns false when only user is stored", () => {
      localStorage.setItem("adminUser", JSON.stringify({ id: "1" }));
      expect(isAuthenticated()).toBe(false);
    });
  });

  describe("getAuthToken", () => {
    it("returns null when no token is stored", () => {
      expect(getAuthToken()).toBeNull();
    });

    it("returns the token when it is stored", () => {
      localStorage.setItem("adminToken", "fake-token");
      expect(getAuthToken()).toBe("fake-token");
    });
  });
});
