"use client";

import { useState } from "react";
import { Sidebar, Navbar } from "@/features/layout";

export default function AuthorizedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <Navbar collapsed={collapsed} setCollapsed={setCollapsed} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
