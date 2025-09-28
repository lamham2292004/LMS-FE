// src/lib/config.ts
interface ApiConfig {
  identity_service: string;
  lms_service: string;
  timeout: number;
}

export const API_CONFIG: ApiConfig = {
  identity_service: process.env.NEXT_PUBLIC_IDENTITY_API_URL || "http://localhost:8000/api",
  lms_service: process.env.NEXT_PUBLIC_LMS_API_URL || "http://localhost:8083",
  timeout: 30000,
};

export const APP_CONFIG = {
  app_name: "HPC Project - LMS",
  version: "1.0.0",
  environment: process.env.NODE_ENV || "development",
  
  // File upload limits
  max_file_size: 100 * 1024 * 1024, // 100MB
  allowed_file_types: ["image/jpeg", "image/png", "image/gif", "video/mp4"],
  
  // Pagination
  default_page_size: 20,
  max_page_size: 100,
  
  // UI Settings
  theme: {
    primary_color: "#ef4444", // red-500
    secondary_color: "#64748b", // slate-500
    success_color: "#10b981", // emerald-500
    warning_color: "#f59e0b", // amber-500
    error_color: "#ef4444", // red-500
  },
  
  // Course settings
  course: {
    default_duration: 60, // minutes
    max_quiz_attempts: 3,
    pass_score_percentage: 70,
  },
  
  // JWT settings (for reference)
  jwt: {
    token_key: "token",
    refresh_key: "refresh_token",
    expiry_buffer: 5 * 60 * 1000, // 5 minutes buffer for refresh
  }
};

export const getApiUrl = (service: keyof ApiConfig): string => {
  return API_CONFIG[service];
};

export const isDevelopment = (): boolean => {
  return APP_CONFIG.environment === "development";
};

export const isProduction = (): boolean => {
  return APP_CONFIG.environment === "production";
};