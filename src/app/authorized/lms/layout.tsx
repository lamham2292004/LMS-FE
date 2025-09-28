// src/app/authorized/lms/layout.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/features/auth";
import { 
  BookOpen, 
  ShoppingCart, 
  FileText, 
  Trophy, 
  Users,
  BarChart3,
  Settings,
  Plus,
  PenTool
} from "lucide-react";

export default function LMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, userRole } = useAuth();

  const menuItems = [
    {
      title: "Tổng quan",
      href: "/authorized/lms",
      icon: BarChart3
    },
    {
      title: "Khóa học",
      href: "/authorized/lms/courses",
      icon: BookOpen
    },
    {
      title: "Giỏ hàng",
      href: "/authorized/lms/cart",
      icon: ShoppingCart,
      studentOnly: true
    },
    {
      title: "Bài kiểm tra",
      href: "/authorized/lms/tests",
      icon: FileText
    },
    {
      title: "Chứng chỉ",
      href: "/authorized/lms/certificates",
      icon: Trophy
    },
    {
      title: "Học viên",
      href: "/authorized/lms/students",
      icon: Users,
      adminOnly: true
    }
  ];

  const adminItems = [
    {
      title: "Quản lý khóa học",
      href: "/authorized/lms/management",
      icon: PenTool,
      lecturerOrAdmin: true
    },
    {
      title: "Tạo khóa học",
      href: "/authorized/lms/admin/courses/create",
      icon: Plus,
      lecturerOrAdmin: true
    },
    {
      title: "Cài đặt",
      href: "/authorized/lms/admin/settings",
      icon: Settings,
      adminOnly: true
    }
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter(item => {
    if (item.studentOnly && userRole !== 'student') return false;
    if (item.adminOnly && userRole !== 'admin') return false;
    return true;
  });

  const filteredAdminItems = adminItems.filter(item => {
    if (item.adminOnly && userRole !== 'admin') return false;
    if (item.lecturerOrAdmin && !['lecturer', 'admin'].includes(userRole || '')) return false;
    return true;
  });

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`bg-white border-r border-gray-200 transition-all duration-300 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      }`}>
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            {!sidebarCollapsed && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900">LMS Portal</h2>
                <p className="text-sm text-gray-500">Học tập trực tuyến</p>
              </div>
            )}
          </div>
        </div>

        <nav className="p-4">
          <div className="space-y-1">
            {filteredMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || 
                          (item.href !== "/authorized/lms" && pathname.startsWith(item.href));
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-red-50 text-red-700 border-r-2 border-red-500"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? "text-red-500" : "text-gray-400"}`} />
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium">{item.title}</span>
                  )}
                </Link>
              );
            })}
          </div>

          {!sidebarCollapsed && filteredAdminItems.length > 0 && (
            <>
              <div className="mt-8 pt-4 border-t border-gray-200">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  {userRole === 'admin' ? 'Quản trị' : 'Giảng dạy'}
                </p>
                <div className="space-y-1">
                  {filteredAdminItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || 
                              pathname.startsWith(item.href);
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                          isActive
                            ? "bg-red-50 text-red-700"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? "text-red-500" : "text-gray-400"}`} />
                        <span className="text-sm font-medium">{item.title}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </nav>

        {/* User Info & Collapse Button */}
        <div className="absolute bottom-4 left-4 right-4">
          {!sidebarCollapsed && user && (
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <div className="text-sm font-medium text-gray-900 truncate">
                {user.full_name}
              </div>
              <div className="text-xs text-gray-500 capitalize">
                {userRole}
              </div>
            </div>
          )}
          
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-center"
          >
            {sidebarCollapsed ? "→" : "←"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}