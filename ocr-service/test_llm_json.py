from Services.llm_extractor import extract_with_llm

with open("ocr.txt", "r", encoding="utf-8") as f:
    raw_text = f.read()

result = extract_with_llm(raw_text)

print(result)