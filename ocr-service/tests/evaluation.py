import os
import json
import glob
import requests
from pathlib import Path

# Configuration
TEST_DATA_DIR = Path(__file__).parent / "data"
API_URL = "http://localhost:8001/extract"
REPORT_FILE = Path(__file__).parent / "report.json"

def calculate_precision(extracted, expected):
    """
    Compare les deux dictionnaires et retourne des métriques simples.
    On compare les chaînes en ignorant la casse et les espaces superflus.
    """
    fields_total = 0
    fields_extracted = 0
    fields_correct = 0
    fields_missing = 0
    errors = {}

    for key, expected_value in expected.items():
        # Ignorer certains champs si nécessaire (ex: Mots-clés bruts)
        if key == "raw_text":
            continue
            
        fields_total += 1
        extracted_value = extracted.get(key)
        
        # Gestion des valeurs manquantes ou None
        if not expected_value or expected_value == [] or expected_value == "":
            fields_total -= 1  # Si c'est censé être vide, on ne le compte pas comme un champ "à extraire" pour la métrique de base
            continue
            
        if extracted_value is None or extracted_value == "" or extracted_value == []:
            fields_missing += 1
            errors[key] = {"expected": expected_value, "extracted": extracted_value, "reason": "missing"}
            continue
            
        fields_extracted += 1
        
        # Comparaison simple
        str_exp = str(expected_value).strip().lower()
        str_ext = str(extracted_value).strip().lower()
        
        if str_exp == str_ext or str_exp in str_ext or str_ext in str_exp:
            fields_correct += 1
        else:
            errors[key] = {"expected": expected_value, "extracted": extracted_value, "reason": "mismatch"}

    precision = (fields_correct / fields_total) * 100 if fields_total > 0 else 0
    
    return {
        "total_fields": fields_total,
        "extracted_fields": fields_extracted,
        "missing_fields": fields_missing,
        "correct_fields": fields_correct,
        "precision": precision,
        "errors": errors
    }

def run_evaluation():
    print(f"=== Début de l'évaluation OCR ===")
    print(f"Dossier cible: {TEST_DATA_DIR}")
    
    pdf_files = glob.glob(str(TEST_DATA_DIR / "*.pdf"))
    if not pdf_files:
        print("Aucun fichier PDF trouvé dans le dossier 'tests/data/'.")
        print("Veuillez placer vos 4 conventions de test dans ce dossier.")
        return
        
    print(f"Trouvé {len(pdf_files)} fichier(s) PDF.")
    
    results_summary = {
        "documents": {},
        "global_precision": 0,
        "most_failed_fields": {}
    }
    
    total_precision = 0
    failed_fields_count = {}
    
    for pdf_path in pdf_files:
        file_name = Path(pdf_path).name
        base_name = Path(pdf_path).stem
        json_path = TEST_DATA_DIR / f"{base_name}_expected.json"
        
        print(f"\n--- Évaluation du fichier PDF ---")
        
        if not json_path.exists():
            print(f"ATTENTION: Fichier JSON attendu introuvable ({json_path.name}). Ignoré.")
            continue
            
        with open(json_path, 'r', encoding='utf-8') as f:
            expected_data = json.load(f)
            
        print("Envoi du fichier à l'API OCR...")
        try:
            with open(pdf_path, 'rb') as f:
                response = requests.post(
                    API_URL, 
                    files={'file': (file_name, f, 'application/pdf')},
                    timeout=900  # 15 minutes max par document
                )
            
            if response.status_code != 200:
                print(f"Erreur API ({response.status_code}): {response.text}")
                continue
                
            extracted_data = response.json()
            
            # Calcul des métriques
            metrics = calculate_precision(extracted_data, expected_data)
            
            print(f"Résultats du document:")
            print(f"- Précision : {metrics['precision']:.2f}%")
            print(f"- Champs corrects : {metrics['correct_fields']} / {metrics['total_fields']}")
            print(f"- Champs manquants : {metrics['missing_fields']}")
            print(f"- Erreurs : {len(metrics['errors'])}")
            
            results_summary["documents"][file_name] = metrics
            total_precision += metrics['precision']
            
            # Comptabiliser les erreurs par champ pour cibler les améliorations
            for field in metrics['errors']:
                failed_fields_count[field] = failed_fields_count.get(field, 0) + 1
                
        except Exception as e:
            print(f"Erreur lors du traitement: {e}")
            
    # Rapport global
    if len(results_summary["documents"]) > 0:
        results_summary["global_precision"] = total_precision / len(results_summary["documents"])
        
        # Trier les champs échoués par fréquence
        sorted_failures = dict(sorted(failed_fields_count.items(), key=lambda item: item[1], reverse=True))
        results_summary["most_failed_fields"] = sorted_failures
        
        with open(REPORT_FILE, 'w', encoding='utf-8') as f:
            json.dump(results_summary, f, ensure_ascii=False, indent=2)
            
        print("\n=============================================")
        print(f"SCORE GLOBAL : {results_summary['global_precision']:.2f}%")
        print("=============================================")
        print("Champs posant le plus de problèmes :")
        for field, count in sorted_failures.items():
            print(f"- Champ échoué {count} fois")
            
        print(f"\nRapport détaillé sauvegardé dans : {REPORT_FILE}")

if __name__ == "__main__":
    run_evaluation()
