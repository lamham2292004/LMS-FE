"use client";

import React, { useState } from "react";
import { LoginRequest } from "@/lib/api";
import { useLogin } from "../hooks/useLogin";
import styles from "./LoginForm.module.css";

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState<LoginRequest>({
    username: "",
    password: "",
    user_type: "student",
  });

  const { isLoading, error, handleLogin, clearError } = useLogin();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username.trim() || !formData.password.trim()) {
      return;
    }

    await handleLogin(formData);

    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.formGroup}>
        <label htmlFor="user_type" className={styles.label}>
          Loại tài khoản
        </label>
        <select
          id="user_type"
          name="user_type"
          value={formData.user_type}
          onChange={handleInputChange}
          className={styles.select}
          disabled={isLoading}
        >
          <option value="student">Sinh viên</option>
          <option value="lecturer">Giảng viên</option>
          <option value="admin">Quản trị viên</option>
        </select>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="username" className={styles.label}>
          Tên đăng nhập
        </label>
        <input
          id="username"
          name="username"
          type="text"
          value={formData.username}
          onChange={handleInputChange}
          className={styles.input}
          placeholder="Nhập tên đăng nhập"
          disabled={isLoading}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password" className={styles.label}>
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleInputChange}
          className={styles.input}
          placeholder="Nhập mật khẩu"
          disabled={isLoading}
          required
        />
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={
          isLoading || !formData.username.trim() || !formData.password.trim()
        }
      >
        {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>
    </form>
  );
};
