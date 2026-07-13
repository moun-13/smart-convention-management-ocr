import os
import json
from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()

client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

SYSTEM_PROMPT = """
Tu es un expert en analyse des conventions administratives marocaines rédigées en arabe et en français.

Ta mission est d'analyser le texte OCR brut d'une convention et d'extraire les informations demandées.

IMPORTANT :

1. Ne jamais inventer une information.
2. Si une information est absente, retourner "" (ou [] pour une liste).
3. Corriger mentalement les erreurs OCR évidentes lorsque le contexte le permet.
4. Les conventions peuvent contenir des fautes OCR, des mots coupés ou des caractères erronés.
5. Utiliser le contexte du document entier pour comprendre les informations.
6. Si plusieurs valeurs existent, choisir la plus pertinente.
7. Répondre UNIQUEMENT avec un JSON valide.
8. Aucun commentaire.
9. Aucun texte avant ou après le JSON.

Les champs à extraire sont :

{
  "رقم_الاتفاقية":"",
  "تاريخ_البداية":"",
  "السنة":"",
  "الدورة":"",
  "نوع_الاتفاقية":"",
  "موضوع_الاتفاقية":"",
  "الأطراف":[],
  "الشريك":"",
  "صاحب_المشروع":"",
  "سريان_الاتفاقية":"",
  "المبلغ_الإجمالي":"",
  "مساهمة_الجهة":"",
  "حالة_الاتفاقية":"",
  "رقم_القرار":"",
  "المجال":"",
  "البرامج":"",
  "الاختصاص":"",
  "المرفقات":[]
}

=========================
RÈGLES D'EXTRACTION
=========================

رقم_الاتفاقية
- Chercher :
  اتفاقية رقم
  رقم الاتفاقية
  Référence
  RSM/2026/...
- Ne pas retourner un numéro de loi.

تاريخ_البداية
- Retourner la date de signature.
- Format :
  06 مارس 2023

السنة
- Retourner l'année de la convention.
- Ne pas prendre les années des lois citées dans le préambule.

الدورة
- Chercher :
  الدورة العادية
  الدورة الاستثنائية

نوع_الاتفاقية
Choisir uniquement parmi :

- شراكة
- إطار
- اتفاقية إطار
- تعاون
- تمويل
- أخرى

موضوع_الاتفاقية
Retourner uniquement la phrase décrivant l'objet de la convention.

Ne pas retourner tout le paragraphe.

الأطراف
Retourner la liste des parties signataires.

Exemple :

[
"جهة سوس ماسة",
"وكالة التنمية الرقمية"
]

الشريك
Retourner uniquement le partenaire principal.

صاحب_المشروع
Chercher :

صاحب المشروع
صاحب المشروع المنتدب
Maître d'ouvrage

سريان_الاتفاقية
Chercher :

مدة الاتفاقية
مدة سريان الاتفاقية
ثلاث سنوات
خمس سنوات

Retourner par exemple :

3 سنوات

المبلغ_الإجمالي

Retourner uniquement le montant global.

Exemple :

15000000 درهم

مساهمة_الجهة

Retourner uniquement la contribution financière de la région.

حالة_الاتفاقية

Choisir uniquement :

سارية المفعول
قيد التنفيذ
منتهية
موقوفة

رقم_القرار

Chercher :

مقرر مجلس الجهة
قرار رقم

المجال

Choisir le domaine principal uniquement.

Exemples :

التحول الرقمي
التعليم
الصحة
النقل
البيئة
الفلاحة
الأمن
الثقافة
الرياضة

البرامج

Chercher les programmes officiels.

Exemple :

برنامج التنمية الجهوية

الاختصاص

Retourner uniquement l'objet de la compétence si présent.

المرفقات

Retourner uniquement les annexes réellement mentionnées.

=========================

Le JSON retourné doit être strictement valide.
"""


def extract_with_llm(raw_text, current_result):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        temperature=0.1,
        response_format={
            "type":"json_object"
        },
    messages=[
        {
            "role": "system",
            "content": SYSTEM_PROMPT
        },
        {
            "role": "user",
        "content": f"""
Le texte OCR est :

{raw_text}

Le moteur Regex + NLP a déjà extrait :

{json.dumps(current_result, ensure_ascii=False, indent=2)}
Consignes :

1. Analyse le texte OCR.
2. Complète uniquement les champs vides.
3. Ne modifie pas les champs déjà remplis, sauf si la valeur est manifestement incorrecte.
4. Retourne uniquement un JSON valide.
"""
    }
]

    )
    return json.loads(
        response.choices[0].message.content
    )

