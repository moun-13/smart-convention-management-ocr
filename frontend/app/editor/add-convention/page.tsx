"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createConvention } from "@/services/conventionService";
import AppSidebar from "@/components/AppSidebar";
import { useEffect, useState } from "react";
import { extractConvention } from "@/services/ocrService";
import { canCreateConvention } from "@/lib/auth";
import { useRouter } from "next/navigation";
import {
  getSecteurs,
  getDomaines,
  getProgrammes,
  getProvinces,
  getTypesConvention,
  getPorteursProjet,
  getPartenaires,
  uploadPieceJointe,
} from "@/services/conventionService";

export default function AddConventionPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    numero: "",
    date_convention: "",
    annee: "",
    session: "",
    cout_total: "",
    contribution_region: "",
    secteur_id: "",
    domaine_id: "",
    porteur_projet: "",
    numero_decision: "",
    partenaires: "",
    porteur_delegue_id: "",
    competence: "",
    date_debut: "",
    type_convention_id: "",
    province_id: "",
    programme_id: "",
    description: "",
    pdf: null as File | null,
  });

  const [secteurs, setSecteurs] = useState<any[]>([]);
  const [domaines, setDomaines] = useState<any[]>([]);
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [typesConvention, setTypesConvention] = useState<any[]>([]);
  const [porteursProjet, setPorteursProjet] = useState<any[]>([]);
  const [partenairesList, setPartenairesList] = useState<any[]>([]);

  const handleOCR = async (file: File) => {
    try {
      const result = await extractConvention(file)
      
      const parseOCRDate = (dateStr?: string) => {
        if (!dateStr) return "";
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
        const numericMatch = dateStr.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
        if (numericMatch) {
          const [, d, m, y] = numericMatch;
          return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
        }
        const months: Record<string, string> = {
          'يناير': '01', 'فبراير': '02', 'مارس': '03', 'أبريل': '04', 'ابريل': '04', 'ماي': '05', 'مايو': '05',
          'يونيو': '06', 'يوليوز': '07', 'يوليو': '07', 'غشت': '08', 'أغسطس': '08', 'شتنبر': '09', 'سبتمبر': '09',
          'أكتوبر': '10', 'اكتوبر': '10', 'نونبر': '11', 'نوفمبر': '11', 'دجنبر': '12', 'ديسمبر': '12'
        };
        for (const [arMonth, num] of Object.entries(months)) {
          if (dateStr.includes(arMonth)) {
            const dayMatch = dateStr.match(/\b(\d{1,2})\b/);
            const yearMatch = dateStr.match(/\b(\d{4})\b/);
            if (dayMatch && yearMatch) {
              return `${yearMatch[1]}-${num}-${dayMatch[1].padStart(2, '0')}`;
            }
          }
        }
          return dateStr;
        };

      const parseOCRNumber = (numStr?: string) => {
        if (!numStr) return "";
        const asciiStr = numStr.replace(/[٠-٩]/g, d => String.fromCharCode(d.charCodeAt(0) - 0x0660 + 48));
        let cleaned = asciiStr.replace(/[^\d.,]/g, '');
        cleaned = cleaned.replace(/,/g, '.');
        return cleaned;
      };

      const normalizeArabic = (text: string) => {
        if (!text) return "";
        return text
          .replace(/[أإآا]/g, 'ا')
          .replace(/ة/g, 'ه')
          .replace(/ى/g, 'ي')
          .replace(/[\u064B-\u0652]/g, '')
          .trim();
      };

      const findIdByName = (list: any[], searchText?: string) => {
        if (!searchText) return "";
        const normSearch = normalizeArabic(searchText);
        const found = list.find(item => {
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
      const foundDomaine = findIdByName(domaines, result["المجال"]);
      const foundProgramme = findIdByName(programmes, result["البرامج"]);
      const foundType = findIdByName(typesConvention, result["نوع_الاتفاقية"]);
      const foundPorteur = result["صاحب_المشروع"] || "";
      
      let foundPartenaires = "";
      if (Array.isArray(result["الأطراف"])) {
        foundPartenaires = result["الأطراف"].join("، ");
      } else if (typeof result["الأطراف"] === "string") {
        foundPartenaires = result["الأطراف"];
      }


      setFormData((prev) => ({
        ...prev,
        numero: result["رقم_الاتفاقية"] ?? prev.numero,
        date_convention: parsedDate || prev.date_convention,
        annee: result["السنة"] ?? prev.annee,
        session: result["الدورة"] ?? prev.session,
        description: result["موضوع_الاتفاقية"] ?? prev.description,
        numero_decision: result["رقم_القرار"] ?? prev.numero_decision,
        cout_total: parsedCout || prev.cout_total,
        contribution_region: parsedContribution || prev.contribution_region,
        domaine_id: foundDomaine || prev.domaine_id,
        programme_id: foundProgramme || prev.programme_id,
        type_convention_id: foundType || prev.type_convention_id,
        porteur_projet: foundPorteur || prev.porteur_projet,
        date_debut: parsedDateDebut || prev.date_debut,
        partenaires: foundPartenaires || prev.partenaires,
      }));

      alert("تم استخراج البيانات بنجاح");

    } catch {
      alert("فشل استخراج البيانات");
    }
  }

  useEffect(() => {
    if (!canCreateConvention()) {
      router.push("/editor/conventions");
      return;
    }

    const loadData = async () => {
      setSecteurs(await getSecteurs());
      setDomaines(await getDomaines());
      setProgrammes(await getProgrammes());
      setProvinces(await getProvinces());
      setTypesConvention(await getTypesConvention());
      setPorteursProjet(await getPorteursProjet());
      setPartenairesList(await getPartenaires());
    };

    loadData();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const files = target.files;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" && files ? files[0] : value,
    }));
  };

const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  try {
    const payload: any = { ...formData };
    
    if (payload.date_debut && !/^\d{4}-\d{2}-\d{2}$/.test(payload.date_debut)) {
      payload.date_debut = null;
    }
    
    if (!payload.cout_total || String(payload.cout_total).trim() === "" || isNaN(Number(payload.cout_total))) {
      delete payload.cout_total;
    }
    if (!payload.contribution_region || String(payload.contribution_region).trim() === "" || isNaN(Number(payload.contribution_region))) {
      delete payload.contribution_region;
    }
    if (!payload.annee || String(payload.annee).trim() === "") delete payload.annee;
    if (!payload.date_convention || String(payload.date_convention).trim() === "") delete payload.date_convention;

    const convention = await createConvention(payload);


    if (formData.pdf) {
      await uploadPieceJointe(convention.id, formData.pdf);
    }

    alert("تم حفظ الاتفاقية بنجاح");
    router.push(`/editor/conventions/${convention.id}`);

} catch (error: any) {
    if (error.response?.data?.errors) {
      const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
      alert("حدث خطأ أثناء الحفظ:\n" + errorMessages);
    } else if (error.response?.data?.message) {
      alert("حدث خطأ أثناء الحفظ: " + error.response.data.message);
    } else {
      alert("حدث خطأ أثناء الحفظ");
    }
  }
};


  return (
    <div className="flex bg-slate-100 min-h-screen">
      <AppSidebar />

      <div className="flex-1 p-8">
        <form
          onSubmit={onSubmit}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold mb-8">
            إضافة اتفاقية جديدة
          </h1>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="font-medium">رقم الاتفاقية</label>
              <input suppressHydrationWarning
                required
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                type="text"
                placeholder="2024/001"
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium">تاريخ الاتفاقية</label>
              <input suppressHydrationWarning
                required
                name="date_convention"
                value={formData.date_convention}
                onChange={handleChange}
                type="date"
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium">السنة</label>
              <input suppressHydrationWarning
                required
                name="annee"
                value={formData.annee}
                onChange={handleChange}
                type="text"
                placeholder="2025"
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium">الدورة</label>
              <input suppressHydrationWarning
                name="session"
                value={formData.session}
                onChange={handleChange}
                type="text"
                placeholder="  "
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium">التكلفة الإجمالية</label>
              <input suppressHydrationWarning
                name="cout_total"
                value={formData.cout_total}
                onChange={handleChange}
                type="text"
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium">مساهمة الجهة</label>
              <input suppressHydrationWarning
                name="contribution_region"
                value={formData.contribution_region}
                onChange={handleChange}
                type="text"
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium">القطاع</label>
              <select suppressHydrationWarning
                required
                name="secteur_id"
                value={formData.secteur_id}
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
              <label className="font-medium">المجال</label>
              <select suppressHydrationWarning
                name="domaine_id"
                value={formData.domaine_id}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              >
                <option value="">اختر المجال</option>
                {domaines.map((domaine) => (
                  <option key={domaine.id} value={domaine.id}>
                    {domaine.nom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-medium">صاحب المشروع</label>
              <input suppressHydrationWarning
                name="porteur_projet"
                value={formData.porteur_projet}
                onChange={handleChange}
                type="text"
                placeholder="أدخل صاحب المشروع"
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium">رقم المقرر</label>
              <input suppressHydrationWarning
                name="numero_decision"
                value={formData.numero_decision}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium">الشركاء</label>
              <input suppressHydrationWarning
                name="partenaires"
                value={formData.partenaires}
                onChange={handleChange}
                type="text"
                placeholder="أدخل الشركاء"
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium">صاحب المشروع المنتدب</label>
              <select suppressHydrationWarning
                name="porteur_delegue_id"
                value={formData.porteur_delegue_id}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              >
                <option value="">اختر صاحب المشروع المنتدب</option>
                {porteursProjet.map((porteur) => (
                  <option key={porteur.id} value={porteur.id}>
                    {porteur.nom}
                  </option>
                ))}
              </select>
            </div>



            <div>
              <label className="font-medium">تاريخ البداية (سريان الاتفاقية)</label>
              <input suppressHydrationWarning
                name="date_debut"
                value={formData.date_debut}
                onChange={handleChange}
                type="text"
                className="w-full border rounded-lg p-3 mt-2"
              />
            </div>

            <div>
              <label className="font-medium">نوع الاتفاقية</label>
              <select suppressHydrationWarning
                name="type_convention_id"
                value={formData.type_convention_id}
                onChange={handleChange}
                className="w-full border rounded-lg p-3 mt-2"
              >
                <option value="">اختر نوع الاتفاقية</option>
                {typesConvention.map((typeConv) => (
                  <option key={typeConv.id} value={typeConv.id}>
                    {typeConv.nom}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-medium">العمالة / الإقليم</label>
              <select suppressHydrationWarning
                name="province_id"
                value={formData.province_id}
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
              <label className="font-medium">البرنامج</label>
              <select suppressHydrationWarning
                name="programme_id"
                value={formData.programme_id}
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
            <label className="font-medium">ملاحظات / وصف</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="w-full border rounded-lg p-3 mt-2"
            ></textarea>
          </div>

          <div className="mt-8">
            <label className="font-medium">المرفقات</label>
            <input suppressHydrationWarning
              type="file"
              accept=".pdf"
              onChange={async (e) => {
                if (!e.target.files?.length) return;

                const file = e.target.files[0];

                setFormData((prev) => ({
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
              إرسال الاتفاقية
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
