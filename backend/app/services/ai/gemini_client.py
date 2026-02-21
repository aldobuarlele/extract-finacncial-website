import google.generativeai as genai
from app.core.config import settings
import json

class GeminiClient:
    def __init__(self):
        self.model_name = 'gemini-2.5-flash' 
        
        self.model = genai.GenerativeModel(
            model_name=self.model_name,
            generation_config={"response_mime_type": "application/json"}
        )
        print(f"DEBUG: GeminiClient switching to flagship model: {self.model_name}")

    async def extract_receipt_data(self, image_content: bytes, mime_type: str):
        prompt = """
        Analyze this document and extract information in JSON format:
        - merchant_name (string)
        - transaction_date (YYYY-MM-DD)
        - total_amount (number)
        - suggested_category (choose one: Food, Transport, Shopping, Bills, Others)

        Return ONLY a valid JSON object.
        """
        
        try:
            response = self.model.generate_content([
                prompt,
                {"mime_type": mime_type, "data": image_content}
            ])
            
            if response and response.text:
                return json.loads(response.text)
            return None
            
        except Exception as e:
            print(f"--- AI EXTRACTION ERROR ---")
            print(f"Detail: {str(e)}")
            
            if "404" in str(e):
                print("DEBUG: Checking available models for your API Key...")
                available_models = [m.name for m in genai.list_models()]
                print(f"DEBUG: Your available models: {available_models}")
                
            return None