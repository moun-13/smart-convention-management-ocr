"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { clearSession, getCurrentUser } from "@/lib/auth";
import { useEffect, useState } from "react";
import type { AuthUser } from "@/lib/auth";

export default function AppSidebar() {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const roleLabels: Record<AuthUser["role"], string> = {
    admin: "المدير",
    editor: "محرر",
    decideur: "صاحب القرار",
  };

  const canViewStats = user?.role === "admin" || user?.role === "decideur";
  const canCreateConvention = user?.role === "admin" || user?.role === "editor";
  const canManageUsers = user?.role === "admin";

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setUser(getCurrentUser());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  return (
    <div className="w-64 h-screen bg-blue-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-10">
        نظام إدارة الاتفاقيات
      </h1>

      <div className="space-y-4">
        {canViewStats && (
          <Link
            href="/editor/dashboard"
            className="block hover:bg-blue-800 p-3 rounded"
          >
            لوحة التحكم
          </Link>
        )}

        {canCreateConvention && (
          <Link
            href="/editor/add-convention"
            className="block hover:bg-blue-800 p-3 rounded"
          >
            إضافة اتفاقية
          </Link>
        )}

        <Link
          href="/editor/conventions"
          className="block hover:bg-blue-800 p-3 rounded"
        >
          الاتفاقيات
        </Link>

        {canManageUsers && (
          <Link
            href="/admin/users"
            className="block hover:bg-blue-800 p-3 rounded"
          >
            إدارة المستخدمين
          </Link>
        )}

        {user && (
          <div className="border-t border-blue-700 pt-4 text-sm text-blue-100">
            <div className="font-semibold">{roleLabels[user.role]}</div>
            <div className="mt-1">{user.name}</div>
          </div>
        )}

        <button suppressHydrationWarning
          type="button"
          onClick={handleLogout}
          className="block w-full text-start hover:bg-red-500 p-3 rounded"
        >
          تسجيل الخروج
        </button>
      </div>
    </div>
  );
}
