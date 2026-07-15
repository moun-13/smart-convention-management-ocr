import os
import json
import glob
import requests
from pathlib import Path

# Configuration
TEST_DATA_DIR = Path(__file__).parent / "data"
API_URL = "http://localhost:8001/extract"

def generate_expected_jsons():
    print(f"=== Génération des fichiers JSON de base (Ground Truth) ===")
    
    pdf_files = glob.glob(str(TEST_DATA_DIR / "*.pdf"))
    if not pdf_files:
        print("Aucun fichier PDF trouvé.")
        return
        
    for pdf_path in pdf_files:
        file_name = Path(pdf_path).name
        base_name = Path(pdf_path).stem
        json_path = TEST_DATA_DIR / f"{base_name}_expected.json"
        
        if json_path.exists():
            print(f"[{file_name}] Le fichier JSON existe déjà, ignoré.")
            continue
            
        print(f"\nTraitement d'un fichier PDF...")
        try:
            with open(pdf_path, 'rb') as f:
                response = requests.post(API_URL, files={'file': (file_name, f, 'application/pdf')})
            
            if response.status_code != 200:
                print(f"Erreur API ({response.status_code}): {response.text}")
                continue
                
            extracted_data = response.json()
            
            # Nettoyer les champs inutiles pour la vérité terrain
            if "raw_text" in extracted_data:
                del extracted_data["raw_text"]
                
            with open(json_path, 'w', encoding='utf-8') as f:
                json.dump(extracted_data, f, ensure_ascii=False, indent=2)
                
            print("OK: Fichier généré avec succès.")
            
        except Exception as e:
            print(f"Erreur lors du traitement de {file_name}: {e}")
            
    print("\nTerminé ! Veuillez maintenant ouvrir les fichiers _expected.json et les corriger manuellement pour qu'ils représentent la réalité.")

if __name__ == "__main__":
    generate_expected_jsons()
