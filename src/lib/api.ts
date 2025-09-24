import { API_CONFIG, STORAGE_KEYS } from "./config";

// API Configuration
const API_BASE_URL = API_CONFIG.baseUrl;

// API Response Types
export interface ApiResponse<T = any> {
  data?: T;
  user?: T;
  token?: string;
  message: string;
  status?: number;
}

import {
  LoginRequest,
  LoginResponse,
  UserProfile,
} from "@/features/auth/types";

// Re-export types for backward compatibility
export type { LoginRequest, LoginResponse, UserProfile };

// HTTP Client
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.token =
      typeof window !== "undefined"
        ? localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN)
        : null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Authentication Methods
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    console.log("API Client - Login credentials:", credentials);

    const response = await this.request<LoginResponse>("/v1/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });

    console.log("API Client - Raw response:", response);

    // Handle both formats: response.data.token OR response.token
    if (response.data?.token || response.token) {
      const token = response.data?.token || response.token;
      this.setToken(token!);
      console.log("API Client - Token set successfully:", token);
    } else {
      console.log("API Client - No token in response");
    }

    return response;
  }

  async logout(): Promise<ApiResponse> {
    try {
      await this.request("/v1/logout", { method: "POST" });
    } finally {
      this.clearToken();
    }

    return { message: "Đăng xuất thành công" };
  }

  async getProfile(): Promise<ApiResponse<UserProfile>> {
    return this.request<UserProfile>("/v1/me");
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await this.request<{ token: string }>("/v1/refresh", {
      method: "POST",
    });

    if (response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  // Token Management
  setToken(token: string): void {
    this.token = token;
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    }
  }

  getToken(): string | null {
    return this.token;
  }

  clearToken(): void {
    this.token = null;
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
