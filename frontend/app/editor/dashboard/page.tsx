"use client";

import AppSidebar from "@/components/AppSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { canViewStats } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    conventions: 0,
    secteurs: 0,
    domaines: 0,
    programmes: 0,
    provinces: 0,
    partenaires: 0,
    porteursProjet: 0,
    typesConvention: 0,
  });

  useEffect(() => {
    if (!canViewStats()) {
      router.push("/editor/conventions");
      return;
    }

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          "http://127.0.0.1:8000/api/dashboard/statistiques",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        if (response.status === 403) {
          router.push("/editor/conventions");
          return;
        }

        const data = await response.json();
        setStats(data);
      } catch {
      }
    };

    fetchStats();
  }, [router]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AppSidebar />

      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          لوحة التحكم
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-gray-500">إجمالي الاتفاقيات</h2>
              <p className="text-2xl font-bold mt-3">{stats.conventions}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-gray-500">القطاعات</h2>
              <p className="text-2xl font-bold mt-3">{stats.secteurs}</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="text-gray-500">الشركاء</h2>
              <p className="text-2xl font-bold mt-3">{stats.partenaires}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
