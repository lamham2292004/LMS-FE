"use client";

import React from "react";
import styles from "./login.module.css";
import Link from "next/link";
import { FaGoogle, FaGithub, FaFacebook } from "react-icons/fa";
import { LoginForm } from "@/features/auth";

export default function LoginPage() {
  const handleLoginSuccess = () => {
    console.log("Đăng nhập thành công!");
  };

  return (
    <div className={styles.box}>
      <div className={styles.container}>
        <h1 className={styles.logo}>Your Logo</h1>
        <span className={styles.taglogin}>Login</span>

        {/* LoginForm Component - Tách biệt logic và UI */}
        <LoginForm onSuccess={handleLoginSuccess} />

        <span className={styles.tagforgot}>Forgot password?</span>

        <div className={styles.tagor}>Or continue with</div>

        <div className={styles.socialLogin}>
          <button className={styles.socialButton}>
            <FaGoogle className={styles.googleIcon} size={20} />
          </button>
          <button className={styles.socialButton}>
            <FaGithub className={styles.githubIcon} size={20} />
          </button>
          <button className={styles.socialButton}>
            <FaFacebook className={styles.facebookIcon} size={20} />
          </button>
        </div>

        <div className={styles.register}>
          Don't have an account yet?{" "}
          <Link href="/auth/register" className={styles.registerLink}>
            Register for free
          </Link>
        </div>
      </div>
    </div>
  );
}
