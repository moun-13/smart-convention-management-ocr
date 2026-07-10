"use client";

import AppSidebar from "@/components/AppSidebar";
import {
  canCreateConvention,
  canDeleteConvention,
  canEditConvention,
} from "@/lib/auth";
import { deleteConvention } from "@/services/conventionService";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Partenaire {
  id: number;
  nom: string;
}

interface ConventionRow {
  id: number;
  numero: string;
  date_convention: string;
  partenaires?: Partenaire[];
}

export default function ConventionsPage() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [conventions, setConventions] = useState<ConventionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const allowCreate = canCreateConvention();
  const allowEdit = canEditConvention();
  const allowDelete = canDeleteConvention();

  const handleDelete = async (id: number) => {
    if (!allowDelete) return;
    if (!confirm("Supprimer cette convention ?")) return;

    try {
      await deleteConvention(Number(id));
      setConventions((items) => items.filter((item) => item.id !== id));
    } catch {
      alert("Erreur pendant la suppression");
    }
  };

  useEffect(() => {
    const fetchConventions = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch("http://127.0.0.1:8000/api/conventions", {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to fetch conventions");
        }

        const responseData = await response.json();
        setConventions(responseData.data !== undefined ? responseData.data : responseData);
      } catch {
      } finally {
        setLoading(false);
      }
    };

    fetchConventions();
  }, [router]);

  const filteredConventions = useMemo(() => {
    return conventions.filter((item) => {
      const matchSearch = (item.numero || "")
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchDate = date === "" || item.date_convention === date;

      return matchSearch && matchDate;
    });
  }, [search, date, conventions]);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AppSidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">الاتفاقيات</h1>

        <div className="bg-white rounded-xl shadow p-5 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {allowCreate && (
              <Link
                href="/editor/add-convention"
                className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-3 rounded-lg flex items-center gap-2"
              >
                <Plus size={18} />
                إضافة اتفاقية
              </Link>
            )}

            <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input suppressHydrationWarning
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="بحث برقم الاتفاقية..."
                  className="border rounded-lg py-2 pr-10 pl-3 w-72"
                />
              </div>

              <input suppressHydrationWarning
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border rounded-lg px-3 py-2"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center w-40">رقم الاتفاقية</TableHead>
                <TableHead className="text-center w-52">الشريك</TableHead>
                <TableHead className="text-center w-40">التاريخ</TableHead>
                <TableHead className="text-center w-56">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center p-8">
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : (
                filteredConventions.map((convention) => (
                  <TableRow key={convention.id}>
                    <TableCell className="text-center font-medium">
                      {convention.numero}
                    </TableCell>

                    <TableCell className="text-center">
                      {convention.partenaires?.length
                        ? convention.partenaires.map((p) => p.nom).join("، ")
                        : "-"}
                    </TableCell>

                    <TableCell className="text-center">
                      {convention.date_convention}
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Link
                          href={`/editor/conventions/${convention.id}`}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                        >
                          عرض
                        </Link>

                        {allowEdit && (
                          <Link
                            href={`/editor/conventions/${convention.id}/edit`}
                            className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg"
                          >
                            تعديل
                          </Link>
                        )}

                        {allowDelete && (
                          <button suppressHydrationWarning
                            type="button"
                            onClick={() => handleDelete(convention.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                          >
                            حذف
                          </button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
