"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export const useLogout = () => {
  const router = useRouter();
  const { toast } = useToast();

  const logout = () => {
    // Clear authentication data
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");

    // Show logout toast
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
      duration: 3000,
    });

    // Redirect to login page
    router.push("/login");
  };

  return logout;
};

export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  const token = localStorage.getItem("adminToken");
  const user = localStorage.getItem("adminUser");
  return !!token && !!user;
};

export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminToken");
};

export const getAuthUser = () => {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem("adminUser");
  try {
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing adminUser from localStorage:", error);
    return null;
  }
};
