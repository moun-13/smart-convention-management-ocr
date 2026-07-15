import requests
import json
from pathlib import Path

pdf_path = Path(r"c:\Users\pc\Desktop\mes Projets\pfa\ocr-service\tests\data\convention RSM Pref Police Agadir (2).pdf")
url = "http://localhost:8001/extract"

print("Sending request to API...")
try:
    with open(pdf_path, "rb") as f:
        files = {"file": (pdf_path.name, f, "application/pdf")}
        response = requests.post(url, files=files, timeout=600)  # 10 mins timeout
        
    print(f"Status Code: {response.status_code}")
    print("Response JSON:")
    try:
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    except Exception as e:
        print("Response Text:", response.text)
except Exception as e:
    print(f"Error making request: {e}")
