"use client";
import Cookies from 'js-cookie';
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { LoginRequest } from "@/lib/api";
import { useRouter } from "next/navigation";

interface UseLoginReturn {
  isLoading: boolean;
  error: string | null;
  handleLogin: (credentials: LoginRequest) => Promise<void>;
  clearError: () => void;
}

export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isLoggingIn } = useAuth();
  const router = useRouter();

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await login(credentials);

      // Lấy đúng token và user từ response
      const { user, token } = response || {};
      if (token) {
        Cookies.set("token", token, { expires: 7, path: '/' });
      }
      if (user?.user_type) {
        Cookies.set("role", user.user_type, { expires: 7, path: '/' });
      }

      // Debug logging
      console.log("Login successful, user:", user);
      console.log("Token:", token);
      console.log("User type:", user?.user_type);
      console.log("Is admin:", user?.is_admin);
      console.log("User keys:", user ? Object.keys(user) : []);

      // Redirect based on user type và is_admin
      let redirectPath = "/authorized/dashboard";
      if (user?.user_type === "student") {
        redirectPath = "/authorized/student/dashboard";
      } else if (user?.user_type === "lecturer") {
        // Handle both boolean and string values for is_admin
        const isAdmin = Boolean(user?.account?.is_admin);
        console.log("useLogin - Is admin (parsed):", isAdmin);

        if (isAdmin) {
          redirectPath = "/authorized/admin/dashboard"; // Lecturer + is_admin = Admin
          console.log("useLogin - Redirecting to ADMIN dashboard");
        } else {
          redirectPath = "/authorized/lecturer/dashboard"; // Lecturer + !is_admin = Giáo viên
          console.log("useLogin - Redirecting to LECTURER dashboard");
        }
      }

      console.log("Redirecting to:", redirectPath);

      // Try router.push first
      try {
        router.push(redirectPath);
        console.log("Router.push executed successfully");
      } catch (routerError) {
        console.error("Router.push failed:", routerError);
        // Fallback to window.location
        window.location.href = redirectPath;
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Đăng nhập thất bại. Vui lòng thử lại.");
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Use global loading state from context
  const finalIsLoading = isLoading || isLoggingIn;

  const clearError = () => {
    setError(null);
  };

  return {
    isLoading: finalIsLoading,
    error,
    handleLogin,
    clearError,
  };
};
