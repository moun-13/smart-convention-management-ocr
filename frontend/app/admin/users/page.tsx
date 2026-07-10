"use client";

import AppSidebar from "@/components/AppSidebar";
import { canManageUsers } from "@/lib/auth";
import { deleteUser, getUsers } from "@/services/userService";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<UserRow[]>([]);

  const loadUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch {
    }
  };

  useEffect(() => {
    if (!canManageUsers()) {
      router.push("/editor/conventions");
      return;
    }

    void Promise.resolve().then(loadUsers);
  }, [router]);

  const handleDelete = async (id: number) => {
    if (!confirm("Supprimer cet utilisateur ?")) return;

    try {
      await deleteUser(id);
      loadUsers();
    } catch {
      alert("Erreur pendant la suppression");
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AppSidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>

          <Link
            href="/admin/users/add"
            className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg"
          >
          إضافة مستخدم
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow p-6">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-start">الاسم</th>
                <th className="p-3 text-start">البريد الإلكتروني</th>
                <th className="p-3 text-start">الدور</th>
                <th className="p-3 text-start">الإجراءات</th>
              </tr>
            </thead>

            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-8 text-gray-500">
                    Aucun utilisateur
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-3">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3 uppercase">{user.role}</td>
                    <td className="p-3">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/users/edit/${user.id}`}
                          className="bg-yellow-500 text-white px-3 py-1 rounded"
                        >
                          تعديل
                        </Link>

                        <button suppressHydrationWarning
                          type="button"
                          onClick={() => handleDelete(user.id)}
                          className="bg-red-600 text-white px-3 py-1 rounded"
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
