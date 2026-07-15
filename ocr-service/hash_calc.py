import hashlib
from pathlib import Path

pdf_path = Path(r"c:\Users\pc\Desktop\mes Projets\pfa\ocr-service\tests\data\convention RSM Pref Police Agadir (2).pdf")
with open(pdf_path, "rb") as f:
    pdf_bytes = f.read()
file_hash = hashlib.sha256(pdf_bytes).hexdigest()
print(f"Hash: {file_hash}")
