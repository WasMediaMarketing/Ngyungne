import type { IUserInput, IUserUpdate, IUser } from "@/types/user.types";

// Helper function to clean user data before sending to API
const cleanUserData = (userData: any) => {
  if (!userData) return {};
  const { id, _id, createdAt, updatedAt, ...cleanedData } = userData;
  return cleanedData;
};

const getAuthToken = () => {
  return localStorage.getItem("adminToken");
};

// Get all users
// Get all users
export async function getUsers(): Promise<IUser[]> {
  try {
    const token = getAuthToken();
    const response = await fetch("/api/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const { data } = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

// Get user by ID
export async function getUserById(userId: string): Promise<IUser> {
  try {
    const token = getAuthToken();
    const response = await fetch(`/api/user/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    const { data } = await response.json(); // Extract data
    return data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

// Create new user
export async function createUser(userData: IUserInput): Promise<IUser> {
  try {
    const cleanedData = cleanUserData(userData);
    console.log("Creating user with data:", cleanedData);

    const token = getAuthToken();
    console.log("Using auth token:", token ? "Token exists" : "No token found");

    const response = await fetch("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cleanedData),
    });

    console.log("Response status:", response.status);

    const responseData = await response.json();
    console.log("Response data:", responseData);

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to create user");
    }

    return responseData;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

// Update user
export async function updateUser(
  userId: string,
  userData: Partial<IUserUpdate>
): Promise<IUser> {
  try {
    const token = getAuthToken();
    const cleanedData = cleanUserData(userData);

    const response = await fetch(`/api/user/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(cleanedData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// Delete user
export async function deleteUser(userId: string): Promise<any> {
  try {
    const token = getAuthToken();
    const response = await fetch(`/api/user/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
}

export async function deleteMultipleUsers(userIds: string[]): Promise<any> {
  try {
    const token = getAuthToken();
    const response = await fetch(`/api/user?userIds=${userIds.join(",")}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to delete users");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting users:", error);
    throw error;
  }
}
