"use client";

import AppSidebar from "@/components/AppSidebar";
import { canManageUsers } from "@/lib/auth";
import { createUser, UserRole } from "@/services/userService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function AddUserPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "editor" as UserRole,
  });

  useEffect(() => {
    if (!canManageUsers()) {
      router.push("/editor/conventions");
    }
  }, [router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createUser(formData);
      alert("تمت إضافة المستخدم بنجاح");
      router.push("/admin/users");
    } catch {
      alert(" حدث خطأ أثناء إضافة المستخدم");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AppSidebar />

      <div className="flex-1 p-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow p-8 max-w-2xl"
        >
          <h1 className="text-3xl font-bold mb-8">إضافة مستخدم</h1>

          <div className="space-y-6">
            <div>
              <label>الاسم</label>
              <input suppressHydrationWarning
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label>البريد الإلكتروني</label>
              <input suppressHydrationWarning
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label>كلمة المرور</label>
              <input suppressHydrationWarning
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label>الدور</label>
              <select suppressHydrationWarning
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              >
                <option value="admin">admin</option>
                <option value="editor">editor</option>
                <option value="decideur">decideur</option>
              </select>
            </div>
          </div>

          <button suppressHydrationWarning
            type="submit"
            className="mt-8 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-lg"
          >
            حفظ
          </button>
        </form>
      </div>
    </div>
  );
}
