# Rapport d'Évaluation OCR (Après vos corrections)

Le script d'évaluation a comparé les extractions du système avec la vérité absolue que vous venez d'établir.

## Résultats de l'Évaluation

- **Score global de précision :** **86.75 %** 
- **Précision par document :**
  - `Convention_ADD VF (1).pdf` : **100.00 %**
  - `اتفاقية مع القوات المساعدة 2023 (1) (1).pdf` : **88.89 %**
  - `convention RSM Pref Police Agadir (2).pdf` : **86.67 %**
  - `convention_data tika (1).pdf` : **71.43 %**

## Les champs les plus problématiques :

1. **`رقم_الاتفاقية` (Échoue 3 fois)**
   - *Problème 1 (Agadir / Forces Aux) :* Les numéros de type `ج.س.م/2022` ou `24/2023/ج.س.م` contiennent des lettres arabes. Les expressions régulières (`regex`) du système ne cherchent actuellement que des chiffres.
   - *Problème 2 (Tika) :* Le système a confondu le numéro de la convention avec le numéro de la loi `111.14` (loi organique). Le numéro réel est complexe : `RSM/2026/SO/07/N°X`.

2. **`الأطراف` (Échoue 1 fois sur Tika)**
   - *Problème :* Le système a extrait du texte aléatoire (`ذات الطابع الشخصيء...`) au lieu de la `اللجنة الوطنية لمراقبة حماية المعطيات`. Le NER n'a pas reconnu cette entité longue.

3. **`حالة_الاتفاقية` (Échoue 1 fois sur Tika)**
   - *Problème :* Au lieu d'utiliser l'Enum `سارية المفعول`, le système a récupéré une phrase de tribunal (`تعذر ذلك يتم الجوء الي المحاكم المختصه`).

4. **`تاريخ_البداية` (Échoue 1 fois sur Tika)**
   - *Problème :* La date `06 يوليوز 2026` n'a pas été trouvée.

5. **`الاختصاص` (Échoue 1 fois sur Agadir)**
   - *Problème :* Le LLM extrait une partie de la phrase mais pas exactement la compétence ciblée par vos corrections.

6. **`المجال` (Échoue 1 fois sur Forces Aux)**
   - *Problème :* L'OCR a halluciné un caractère bizarre à la fin du mot `اللوجستیکی` (transformé en symbole indien).

---

## Propositions d'Améliorations Ciblées

Pour remonter à > 95% sans réécrire l'architecture, je propose les ajustements suivants :

### 1. Fiabiliser `رقم_الاتفاقية` (`postprocess.py` + `llm_extractor.py`)
- Ajouter un pattern Regex qui accepte des lettres arabes, latines et le symbole "N°" (`RSM`, `N°X`, `ج.س.م`).
- Bloquer explicitement l'extraction du nombre `111.14` (qui est la loi des régions) ou `113.14` (communes) dans la regex.
- Ajouter une règle stricte au LLM : "Ne jamais extraire 111.14 ou 112.14 ou 67.17 comme numéro de convention."

### 2. Fiabiliser les `الأطراف` et `تاريخ_البداية` (`llm_extractor.py`)
- Mieux guider le LLM pour nettoyer la liste des partenaires (supprimer les phrases comme "représentée par...").
- Forcer le LLM à chercher dans la dernière page pour trouver la date de signature si `تاريخ_البداية` n'est pas dans l'introduction.

### 3. Corriger `حالة_الاتفاقية` (`postprocess.py`)
- Interdire au moteur d'extraire des phrases longues (> 3 mots) pour ce champ, car il s'agit d'une énumération stricte (`سارية المفعول`, `قيد التنفيذ`, etc.).

### 4. Gérer l'erreur OCR sur `المجال` (`merge.py`)
- Ajouter un petit script de nettoyage rapide dans la fusion (merge) pour corriger ce symbole OCR très connu qui remplace parfois le "ي" final.

> [!IMPORTANT]
> Êtes-vous d'accord avec cette nouvelle stratégie basée sur les vraies erreurs de l'OCR ? Cliquez sur "Proceed" pour que j'applique ces corrections dans le code !
