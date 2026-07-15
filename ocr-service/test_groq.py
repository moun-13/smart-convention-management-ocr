import os
from dotenv import load_dotenv
from openai import OpenAI
import json

load_dotenv()
client = OpenAI(
    api_key=os.getenv("GROQ_API_KEY"),
    base_url="https://api.groq.com/openai/v1"
)

try:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        temperature=0.1,
        response_format={"type": "json_object"},
        messages=[
            {"role": "system", "content": "Return a JSON object."},
            {"role": "user", "content": "Hello"}
        ]
    )
    print("Success:")
    print(response.choices[0].message.content)
except Exception as e:
    print("Error:", e)
