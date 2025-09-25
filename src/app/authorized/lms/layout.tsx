"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BookOpen, 
  ShoppingCart, 
  FileText, 
  Trophy, 
  Users,
  BarChart3,
  Settings,
  Plus
} from "lucide-react";

export default function LMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

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
      icon: ShoppingCart
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
      icon: Users
    }
  ];

  const adminItems = [
    {
      title: "Tạo khóa học",
      href: "/authorized/lms/admin/courses/create",
      icon: Plus
    },
    {
      title: "Cài đặt",
      href: "/authorized/lms/admin/settings",
      icon: Settings
    }
  ];

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
            {menuItems.map((item) => {
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

          {!sidebarCollapsed && (
            <>
              <div className="mt-8 pt-4 border-t border-gray-200">
                <p className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                  Quản trị
                </p>
                <div className="space-y-1">
                  {adminItems.map((item) => {
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

        {/* Collapse Button */}
        <div className="absolute bottom-4 left-4">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
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