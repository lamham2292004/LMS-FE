"use client";

import { ProtectedRoute } from "@/features/auth";
import { ShoppingCart } from "@/features/lms/components/ShoppingCart";

export default function CartPage() {
  return (
    <ProtectedRoute>
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <ShoppingCart />
      </div>
    </ProtectedRoute>
  );
}