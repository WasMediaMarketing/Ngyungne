"use client";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AdminLoginForm } from "@/components/login-form";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

// Mock the next/navigation module
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock the useToast hook
jest.mock("@/components/ui/use-toast", () => ({
  useToast: jest.fn(),
}));

describe("AdminLoginForm", () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Mock implementations
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn() });
    (useToast as jest.Mock).mockReturnValue({ toast: jest.fn() });
  });

  it("renders correctly", () => {
    render(<AdminLoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("handles form submission correctly", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({ token: "fake-token", user: { role: "admin" } }),
      })
    ) as jest.Mock;

    render(<AdminLoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "password123" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/user/login",
        expect.any(Object)
      );
      expect(useRouter().push).toHaveBeenCalledWith("/admin/dashboard");
    });
  });

  it("displays an error message on login failure", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: "Invalid credentials" }),
      })
    ) as jest.Mock;

    render(<AdminLoginForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Login Failed",
          description: "Invalid credentials",
          variant: "destructive",
        })
      );
    });
  });
});
