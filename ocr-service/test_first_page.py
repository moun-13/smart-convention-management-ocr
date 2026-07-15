import os
import sys
from pathlib import Path
from utils.pdf_to_image import convert_pdf_to_images
from Services.preprocess import preprocess
from Services.ocr import run_ocr
from Services.postprocess import clean_output
from Services.nlp import extract_entities

pdf_path = Path(r"c:\Users\pc\Desktop\mes Projets\pfa\ocr-service\tests\data\convention RSM Pref Police Agadir (2).pdf")
with open(pdf_path, "rb") as f:
    pdf_bytes = f.read()

# Only convert the first page to save time
images = convert_pdf_to_images(pdf_bytes)
print(f"Extracted {len(images)} images, using only the first page.")
img = preprocess(images[0])
text = run_ocr([img])

print("--- OCR TEXT ---")
print(text)
print("----------------")

entities = extract_entities(text)
result = clean_output(text, entities)

print("--- POSTPROCESS RESULT ---")
import json
print(json.dumps(result, ensure_ascii=False, indent=2))
