"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { apiClient, UserProfile, LoginRequest, ApiResponse } from "@/lib/api";

interface AuthContextType {
  user: UserProfile | null;
  userRole: "student" | "lecturer" | "admin" | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLecturer: boolean;
  isStudent: boolean;
  isLoading: boolean;
  isLoggingIn: boolean;
  login: (credentials: LoginRequest) => Promise<ApiResponse>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Computed values - Logic phân quyền mới
  const userRole = user
    ? user.user_type === "student"
      ? "student"
      : Boolean(user.account?.is_admin)
      ? "admin"
      : "lecturer"
    : null;
  const isAuthenticated = !!user;
  const isAdmin = userRole === "admin";
  const isLecturer = userRole === "lecturer";
  const isStudent = userRole === "student";

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (apiClient.isAuthenticated()) {
          const response = await apiClient.getProfile();
          if (response.data) {
            setUser(response.data);
          }
        }
      } catch (error) {
        console.error("Failed to check authentication:", error);
        apiClient.clearToken();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<ApiResponse> => {
    try {
      setIsLoggingIn(true);
      const response = await apiClient.login(credentials);

      console.log("AuthContext - Full response:", response);
      console.log("AuthContext - Response data:", response.data);
      console.log("AuthContext - Response keys:", Object.keys(response));
      if (response.data) {
        console.log("AuthContext - Data keys:", Object.keys(response.data));
      }

      // Handle both formats: response.data OR response.user
      const userData = response.data || response.user;
      if (userData) {
        setUser(userData);
        console.log("AuthContext - User set successfully:", userData);
      } else {
        console.log("AuthContext - No user data in response");
      }

      return response;
    } catch (error) {
      console.error("AuthContext - Login error:", error);
      throw error;
    } finally {
      setIsLoggingIn(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      apiClient.clearToken();
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const response = await apiClient.getProfile();
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    userRole,
    isAuthenticated,
    isAdmin,
    isLecturer,
    isStudent,
    isLoading,
    isLoggingIn,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};