"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getConvention,
  updateConvention,
  getSecteurs,
  getDomaines,
  getProgrammes,
  getProvinces,
  getTypesConvention,
  getPorteursProjet,
  getPartenaires,
  uploadPieceJointe,
} from "@/services/conventionService";
import { extractConvention } from "@/services/ocrService";
import AppSidebar from "@/components/AppSidebar";
import { canEditConvention } from "@/lib/auth";

export default function EditConventionPage() {
  const { id } = useParams();
  const router = useRouter();

  const [formData, setFormData] = useState<any>(null);

  const [secteurs, setSecteurs] = useState<any[]>([]);
  const [domaines, setDomaines] = useState<any[]>([]);
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [typesConvention, setTypesConvention] = useState<any[]>([]);
  const [porteursProjet, setPorteursProjet] = useState<any[]>([]);
  const [partenairesList, setPartenairesList] = useState<any[]>([]);

  useEffect(() => {
    if (!canEditConvention()) {
      router.push("/editor/conventions");
      return;
    }

    const loadData = async () => {
      try {
        const [
          convention,
          secteursData,
          domainesData,
          programmesData,
          provincesData,
          typesData,
          porteursData,
          partenairesData,
        ] = await Promise.all([
          getConvention(Number(id)),
          getSecteurs(),
          getDomaines(),
          getProgrammes(),
          getProvinces(),
          getTypesConvention(),
          getPorteursProjet(),
          getPartenaires(),
        ]);

        if (convention && convention.partenaires) {
          convention.partenaires = convention.partenaires.map((p: any) => p.nom).join('، ');
        } else {
          convention.partenaires = "";
        }
        
        convention.domaine = convention.domaine?.nom || "";
        convention.type_convention = convention.type_convention?.nom || "";
        convention.porteur_projet = convention.porteur_projet?.nom || "";
        convention.porteur_delegue = convention.porteur_delegue?.nom || "";
        
        delete convention.domaine_id;
        delete convention.type_convention_id;
        delete convention.porteur_projet_id;
        delete convention.porteur_delegue_id;

        setFormData(convention);
        setSecteurs(secteursData);
        setDomaines(domainesData);
        setProgrammes(programmesData);
        setProvinces(provincesData);
        setTypesConvention(typesData);
        setPorteursProjet(porteursData);
        setPartenairesList(partenairesData);
      } catch {
      }
    };

    if (id) {
      loadData();
    }
  }, [id, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOCR = async (file: File) => {
    try {
      const result = await extractConvention(file);

      const parseOCRDate = (dateStr?: string) => {
        if (!dateStr) return "";
        let normalized = dateStr.replace(/[٠-٩]/g, d => String.fromCharCode(d.charCodeAt(0) - 0x0660 + 48));
        if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) return normalized;
        if (/^\d{4}$/.test(normalized)) return `${normalized}-01-01`;
        const numericMatch = normalized.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
        if (numericMatch) {
          const [, d, m, y] = numericMatch;
          return `${y}-${m.padStart(2, "0")}-${d.padStart(2, "0")}`;
        }
        const months: Record<string, string> = {
          يناير: "01", فبراير: "02", مارس: "03", أبريل: "04", ابريل: "04", ماي: "05", مايو: "05",
          يونيو: "06", يوليوز: "07", يوليو: "07", غشت: "08", أغسطس: "08", شتنبر: "09", سبتمبر: "09",
          أكتوبر: "10", اكتوبر: "10", نونبر: "11", نوفمبر: "11", دجنبر: "12", ديسمبر: "12",
        };
        for (const [arMonth, num] of Object.entries(months)) {
          if (normalized.includes(arMonth)) {
            const dayMatch = normalized.match(/\b(\d{1,2})\b/);
            const yearMatch = normalized.match(/\b(\d{4})\b/);
            if (dayMatch && yearMatch) {
              return `${yearMatch[1]}-${num}-${dayMatch[1].padStart(2, '0')}`;
            }
          }
        }
        return normalized;
      };

      const parseOCRNumber = (numStr?: string) => {
        if (!numStr) return "";
        const asciiStr = numStr.replace(/[٠-٩]/g, d => String.fromCharCode(d.charCodeAt(0) - 0x0660 + 48));
        const match = asciiStr.match(/[\d\s.,]+/);
        if (!match) return "";
        
        let cleaned = match[0].trim();
        const decMatch = cleaned.match(/[,.](\d{1,2})$/);
        if (decMatch) {
            cleaned = cleaned.slice(0, -decMatch[0].length);
            cleaned = cleaned.replace(/[^\d]/g, '');
            cleaned = cleaned + '.' + decMatch[1];
        } else {
            cleaned = cleaned.replace(/[^\d]/g, '');
        }
        return cleaned;
      };

      const normalizeArabic = (text: string) => {
        if (!text) return "";
        return text
          .replace(/[أإآا]/g, "ا")
          .replace(/ة/g, "ه")
          .replace(/ى/g, "ي")
          .replace(/[\u064B-\u0652]/g, "")
          .trim();
      };

      const findIdByName = (list: any[], searchText?: string) => {
        if (!searchText) return "";
        const normSearch = normalizeArabic(searchText);
        const found = list.find((item) => {
          if (!item.nom) return false;
          const normItem = normalizeArabic(item.nom);
          return normSearch.includes(normItem) || normItem.includes(normSearch);
        });
        return found ? found.id : "";
      };

      const parsedDate = parseOCRDate(result["تاريخ_البداية"]);
      const parsedDateDebut = parseOCRDate(result["سريان_الاتفاقية"]);
      const parsedCout = parseOCRNumber(result["المبلغ_الإجمالي"]);
      const parsedContribution = parseOCRNumber(result["مساهمة_الجهة"]);
      const foundProgramme = findIdByName(programmes, result["البرامج"]);

      let foundPartenaires = "";
      if (Array.isArray(result["الأطراف"])) {
        foundPartenaires = result["الأطراف"].join("، ");
      } else if (typeof result["الأطراف"] === "string") {
        foundPartenaires = result["الأطراف"];
      }

      setFormData((prev: any) => ({
        ...prev,
        numero: result["رقم_الاتفاقية"] ?? prev.numero,
        date_convention: parsedDate || prev.date_convention,
        annee: result["السنة"] ?? prev.annee,
        session: result["الدورة"] ?? prev.session,
        description: result["موضوع_الاتفاقية"] ?? prev.description,
        numero_decision: result["رقم_القرار"] ?? prev.numero_decision,
        cout_total: parsedCout || prev.cout_total,
        contribution_region: parsedContribution || prev.contribution_region,
        domaine: result["المجال"] ?? prev.domaine,
        programme_id: foundProgramme || prev.programme_id,
        type_convention: result["نوع_الاتفاقية"] ?? prev.type_convention,
        porteur_projet: result["صاحب_المشروع"] ?? prev.porteur_projet,
        date_debut: parsedDateDebut || prev.date_debut,
        partenaires: foundPartenaires || prev.partenaires,
        etat_convention: result["حالة_الاتفاقية"] ?? prev.etat_convention,
        competence: result["الاختصاص"] ?? prev.competence,
      }));

      alert("تم استخراج البيانات بنجاح");
    } catch {
      alert("فشل استخراج البيانات");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload: any = { ...formData };

      if (payload.date_debut && !/^\d{4}-\d{2}-\d{2}$/.test(payload.date_debut)) {
        payload.date_debut = null;
      }

      if (
        !payload.cout_total ||
        String(payload.cout_total).trim() === "" ||
        isNaN(Number(payload.cout_total))
      ) {
        delete payload.cout_total;
      }
      if (
        !payload.contribution_region ||
        String(payload.contribution_region).trim() === "" ||
        isNaN(Number(payload.contribution_region))
      ) {
        delete payload.contribution_region;
      }
      if (!payload.annee || String(payload.annee).trim() === "") delete payload.annee;
      if (!payload.date_convention || String(payload.date_convention).trim() === "")
        delete payload.date_convention;
        
      if (payload.partenaires && typeof payload.partenaires === 'string') {
        payload.partenaires = payload.partenaires.split(/[،,]/).map((p: string) => p.trim()).filter(Boolean);
      } else if (!payload.partenaires) {
        payload.partenaires = [];
      }

      if(payload.secteur) delete payload.secteur;
      if(payload.programme) delete payload.programme;
      if(payload.province) delete payload.province;
      if(payload.piecesJointes) delete payload.piecesJointes;
      if(payload.pieces_jointes) delete payload.pieces_jointes;
      if(payload.statut) delete payload.statut;
      if(payload.validated_by) delete payload.validated_by;
      if(payload.validated_at) delete payload.validated_at;

      await updateConvention(Number(id), payload);

      if (formData.pdf) {
        await uploadPieceJointe(Number(id), formData.pdf);
      }

      alert("تم تعديل الاتفاقية بنجاح");
      router.push(`/editor/conventions/${id}`);
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join("\n");
        alert("حدث خطأ أثناء التعديل:\n" + errorMessages);
      } else if (error.response?.data?.message) {
        alert("حدث خطأ أثناء التعديل: " + error.response.data.message);
      } else {
        alert("حدث خطأ أثناء التعديل");
      }
    }
  };

  if (!formData) {
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
    <div className="flex bg-slate-100 min-h-screen">
      <AppSidebar />

      <div className="flex-1 p-8">
        <form onSubmit={onSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-slate-800">
            تعديل الاتفاقية
          </h1>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="font-medium text-gray-700">رقم الاتفاقية</label>
              <input suppressHydrationWarning
                required
                name="numero"
                value={formData.numero || ""}
                onChange={handleChange}
                type="text"
                placeholder="2024/001"
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">تاريخ الاتفاقية</label>
              <input suppressHydrationWarning
                required
                name="date_convention"
                value={formData.date_convention || ""}
                onChange={handleChange}
                type="date"
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">السنة</label>
              <input suppressHydrationWarning
                required
                name="annee"
                value={formData.annee || ""}
                onChange={handleChange}
                type="text"
                placeholder="2025"
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">الدورة</label>
              <input suppressHydrationWarning
                name="session"
                value={formData.session || ""}
                onChange={handleChange}
                type="text"
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">التكلفة الإجمالية</label>
              <input suppressHydrationWarning
                name="cout_total"
                value={formData.cout_total || ""}
                onChange={handleChange}
                type="text"
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">مساهمة الجهة</label>
              <input suppressHydrationWarning
                name="contribution_region"
                value={formData.contribution_region || ""}
                onChange={handleChange}
                type="text"
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">القطاع</label>
              <select suppressHydrationWarning
                required
                name="secteur_id"
                value={formData.secteur_id || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              >
                <option value="">اختر القطاع</option>
                {secteurs.map((secteur) => (
                  <option key={secteur.id} value={secteur.id}>
                    {secteur.nom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-medium text-gray-700">المجال</label>
              <input suppressHydrationWarning
                name="domaine"
                value={formData.domaine || ""}
                onChange={handleChange}
                type="text"
                placeholder="أدخل المجال"
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">صاحب المشروع</label>
              <input suppressHydrationWarning
                name="porteur_projet"
                value={formData.porteur_projet || ""}
                onChange={handleChange}
                type="text"
                placeholder="أدخل صاحب المشروع"
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">رقم المقرر</label>
              <input suppressHydrationWarning
                name="numero_decision"
                value={formData.numero_decision || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">الشركاء</label>
              <input suppressHydrationWarning
                name="partenaires"
                value={formData.partenaires || ""}
                onChange={handleChange}
                type="text"
                placeholder="أدخل الشركاء (مفصولين بفاصلة)"
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">صاحب المشروع المنتدب</label>
              <input suppressHydrationWarning
                name="porteur_delegue"
                value={formData.porteur_delegue || ""}
                onChange={handleChange}
                type="text"
                placeholder="أدخل صاحب المشروع المنتدب"
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">
                تاريخ البداية (سريان الاتفاقية)
              </label>
              <input suppressHydrationWarning
                name="date_debut"
                value={formData.date_debut || ""}
                onChange={handleChange}
                type="text"
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">نوع الاتفاقية</label>
              <input suppressHydrationWarning
                name="type_convention"
                value={formData.type_convention || ""}
                onChange={handleChange}
                type="text"
                placeholder="أدخل نوع الاتفاقية"
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium text-gray-700">العمالة / الإقليم</label>
              <select suppressHydrationWarning
                name="province_id"
                value={formData.province_id || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              >
                <option value="">اختر العمالة / الإقليم</option>
                {provinces.map((province) => (
                  <option key={province.id} value={province.id}>
                    {province.nom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-medium text-gray-700">البرنامج</label>
              <select suppressHydrationWarning
                name="programme_id"
                value={formData.programme_id || ""}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              >
                <option value="">اختر البرنامج</option>
                {programmes.map((programme) => (
                  <option key={programme.id} value={programme.id}>
                    {programme.nom}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="mt-8">
            <label className="font-medium text-gray-700">ملاحظات / وصف</label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              rows={5}
              className="w-full border rounded-lg p-3 mt-2"
            ></textarea>
          </div>

          <div className="mt-8">
            <label className="font-medium text-gray-700">إضافة مرفقات جديدة</label>
            <input suppressHydrationWarning
              type="file"
              accept=".pdf"
              onChange={async (e) => {
                if (!e.target.files?.length) return;

                const file = e.target.files[0];
                setFormData((prev: any) => ({
                  ...prev,
                  pdf: file,
                }));

                await handleOCR(file);
              }}
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          <div className="mt-10 flex justify-center">
            <button suppressHydrationWarning
              type="submit"
              className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl"
            >
              حفظ التعديلات
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
