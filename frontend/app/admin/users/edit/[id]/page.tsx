"use client";

import AppSidebar from "@/components/AppSidebar";
import { canManageUsers } from "@/lib/auth";
import { getUser, updateUser, UserRole } from "@/services/userService";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "editor" as UserRole,
  });

  const loadUser = useCallback(async () => {
    try {
      const data = await getUser(Number(id));
      setFormData({
        name: data.name || "",
        email: data.email || "",
        password: "",
        role: data.role || "editor",
      });
    } catch {
      alert("Erreur pendant le chargement de l'utilisateur");
    }
  }, [id]);

  useEffect(() => {
    if (!canManageUsers()) {
      router.push("/editor/conventions");
      return;
    }

    if (id) {
      void Promise.resolve().then(loadUser);
    }
  }, [id, loadUser, router]);

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
      const payload = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        ...(formData.password ? { password: formData.password } : {}),
      };

      await updateUser(Number(id), payload);
      alert("تم تعديل المستخدم بنجاح");
      router.push("/admin/users");
    } catch {
      alert(" حدث خطأ أثناء تعديل المستخدم  ");
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
          <h1 className="text-3xl font-bold mb-8">تعديل المستخدم</h1>

          <div className="space-y-6">
            <div>
              <label>الاسم </label>
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
              <label>كلمة المرور الاختيارية</label>
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
            className="mt-8 bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg"
          >
            تعديل
          </button>
        </form>
      </div>
    </div>
  );
}
