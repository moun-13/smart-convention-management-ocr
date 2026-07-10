"use client";

import AppSidebar from "@/components/AppSidebar";
import { canDeleteConvention, canEditConvention } from "@/lib/auth";
import { deleteConvention, getConvention } from "@/services/conventionService";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

interface NamedResource {
  nom?: string;
}

interface Partenaire {
  id: number;
  nom: string;
}

interface PieceJointe {
  id: number;
  nom_original: string;
  chemin: string;
}

interface ConventionDetailsData {
  id: number;
  numero: string;
  date_convention?: string;
  partenaires?: Partenaire[];
  pieces_jointes?: PieceJointe[];
  secteur?: NamedResource;
  programme?: NamedResource;
  domaine?: NamedResource;
  province?: NamedResource;
  typeConvention?: NamedResource;
  porteurProjet?: NamedResource;
  porteurDelegue?: NamedResource;
  session?: string;
  numero_decision?: string;
  contribution_region?: string | number;
  cout_total?: string | number;
  description?: string;
}

export default function ConventionDetails() {
  const { id } = useParams();
  const [convention, setConvention] = useState<ConventionDetailsData | null>(null);
  const router = useRouter();

  const allowEdit = canEditConvention();
  const allowDelete = canDeleteConvention();

  const loadConvention = useCallback(async () => {
    try {
      const data = await getConvention(Number(id));
      setConvention(data);
    } catch {}
  }, [id]);

  const handleDelete = async () => {
    if (!allowDelete) return;
    if (!confirm("Supprimer cette convention ?")) return;

    try {
      await deleteConvention(Number(id));
      router.push("/editor/conventions");
    } catch {
      alert("Erreur pendant la suppression");
    }
  };

  useEffect(() => {
    if (id) {
      void Promise.resolve().then(loadConvention);
    }
  }, [id, loadConvention]);

  if (!convention) {
    return (
      <div className="flex">
        <AppSidebar />
        <div className="flex-1 p-8 flex items-center justify-center">
          <p className="text-xl">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <AppSidebar />

      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              تفاصيل الاتفاقية
            </h1>

            <p className="text-gray-500 mt-2">
              رقم الاتفاقية : {convention.numero}
            </p>
          </div>

          <div className="flex gap-3">
            {allowEdit && (
              <Link
                href={`/editor/conventions/${id}/edit`}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded-lg"
              >
                تعديل
              </Link>
            )}

            {allowDelete && (
              <button suppressHydrationWarning
                type="button"
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
              >
                حذف
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <Info title="رقم الاتفاقية" value={convention.numero} />

            <Info
              title="الشركاء"
              value={
                convention.partenaires?.length
                  ? convention.partenaires.map((p) => p.nom).join("، ")
                  : "-"
              }
            />

            <Info
              title="التاريخ"
              value={
                convention.date_convention
                  ? new Date(convention.date_convention).toLocaleDateString("ar-EG")
                  : "-"
              }
            />

            <Info title="القطاع" value={convention.secteur?.nom} />
            <Info title="البرنامج" value={convention.programme?.nom} />
            <Info title="المجال" value={convention.domaine?.nom} />
            <Info title="الإقليم" value={convention.province?.nom} />
            <Info title="نوع الاتفاقية" value={convention.typeConvention?.nom} />
            <Info title="صاحب المشروع" value={convention.porteurProjet?.nom} />
            <Info title="صاحب المشروع المنتدب" value={convention.porteurDelegue?.nom} />
            <Info title="الدورة" value={convention.session} />
            <Info title="رقم القرار" value={convention.numero_decision} />
            <Info title="مساهمة الجهة" value={convention.contribution_region} />
            <Info title="التكلفة الإجمالية" value={`${convention.cout_total} DH`} />
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-bold mb-4">وصف الاتفاقية</h2>
            <div className="bg-slate-50 border rounded-xl p-6 leading-8 text-gray-700">
              {convention.description || "لا يوجد وصف"}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="text-xl font-bold mb-5">المرفقات</h2>

            {convention.pieces_jointes?.length ? (
              convention.pieces_jointes.map((piece) => (
                <div
                  key={piece.id}
                  className="flex justify-between items-center border rounded-xl p-5 mb-3 bg-slate-50"
                >
                  <div>{piece.nom_original}</div>

                  <div className="flex gap-3">
                    <a
                      href={`http://127.0.0.1:8000/storage/${piece.chemin}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                    >
                      عرض
                    </a>

                    <a
                      href={`http://127.0.0.1:8000/storage/${piece.chemin}`}
                      download={piece.nom_original}
                      target="_blank"
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                    >
                      تحميل
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-100 rounded-xl p-6 text-center text-gray-500">
                لا توجد مرفقات
              </div>
            )}
          </div>
        </div>

        <div className="mt-10">
          <button suppressHydrationWarning
            type="button"
            onClick={() => window.history.back()}
            className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-xl"
          >
            الرجوع
          </button>
        </div>
      </div>
    </div>
  );
}

function Info({ title, value }: { title: string; value: string | number | NamedResource | undefined }) {
  const displayValue = typeof value === "object" && value !== null ? value.nom : value;

  return (
    <div>
      <p className="text-gray-500 mb-1">{title}</p>
      <div className="border rounded-lg p-3 bg-gray-50">{displayValue || "-"}</div>
    </div>
  );
}
