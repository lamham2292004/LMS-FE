"use client";

import {
  LayoutDashboard,
  FileText,
  Calendar,
  Bell,
  CheckSquare,
  Users,
  BookOpen,
  MessageSquare,
  Shield,
  Settings,
  HelpCircle,
  LogOut,
  GraduationCap,
} from "lucide-react";
import Link from "next/link";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  collapsed: boolean;
}

export default function Sidebar({ collapsed }: SidebarProps) {
  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      {/* User section */}
      <div className={styles.userSection}>
        <div className={styles.avatar}>U</div>
        <span className={styles.username}>Username</span>
      </div>

      {/* Menu wrapper scrollable */}
      <div className={styles.menuWrapper}>
        <nav className={styles.menu}>
          <p className={styles.menuGroup}>DASHBOARD</p>
          <Link href="/dashboard" className={styles.menuItem}>
            <LayoutDashboard size={18} className={styles.icon} />
            <span>Analytics</span>
          </Link>
          <Link href="/documents" className={styles.menuItem}>
            <FileText size={18} className={styles.icon} />
            <span>Documents</span>
          </Link>
          <Link href="/calendar" className={styles.menuItem}>
            <Calendar size={18} className={styles.icon} />
            <span>Calendar</span>
          </Link>
          <Link href="/notifications" className={styles.menuItem}>
            <Bell size={18} className={styles.icon} />
            <span>Notifications</span>
          </Link>
          <Link href="/tasks" className={styles.menuItem}>
            <CheckSquare size={18} className={styles.icon} />
            <span>Tasks</span>
          </Link>

          <p className={styles.menuGroup}>RELATIONSHIPS</p>
          <Link href="/departments" className={styles.menuItem}>
            <Users size={18} className={styles.icon} />
            <span>Departments</span>
          </Link>
          <Link href="/blog" className={styles.menuItem}>
            <BookOpen size={18} className={styles.icon} />
            <span>Blog</span>
          </Link>
          <Link href="/authorized/lms" className={styles.menuItem}>
            <GraduationCap size={18} className={styles.icon} />
            <span>LMS</span>
          </Link>
          <Link href="/chats" className={styles.menuItem}>
            <MessageSquare size={18} className={styles.icon} />
            <span>Chats</span>
          </Link>

          <p className={styles.menuGroup}>CONFIGURATION</p>
          <Link href="/admin" className={styles.menuItem}>
            <Shield size={18} className={styles.icon} />
            <span>Admin</span>
          </Link>
          <Link href="/settings" className={styles.menuItem}>
            <Settings size={18} className={styles.icon} />
            <span>Settings</span>
          </Link>
        </nav>
      </div>

      {/* Bottom menu cố định đáy */}
      <div className={styles.bottomMenu}>
        <Link href="/support" className={styles.menuItem}>
          <HelpCircle size={18} className={styles.icon} />
          <span>Support</span>
        </Link>
        <Link href="/logout" className={`${styles.menuItem} ${styles.logout}`}>
          <LogOut size={18} className={styles.icon} />
          <span>Logout</span>
        </Link>
      </div>
    </aside>
  );
}
