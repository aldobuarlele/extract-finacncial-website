import google.generativeai as genai
from app.core.config import settings
import json

class GeminiClient:
    def __init__(self):
        if not settings.GEMINI_API_KEY:
            raise ValueError("GEMINI_API_KEY tidak ditemukan")
            
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model_name = 'gemini-2.5-flash' 
        
        self.model = genai.GenerativeModel(
            model_name=self.model_name,
            generation_config={"response_mime_type": "application/json"}
        )
        print(f"DEBUG: GeminiClient initialized with model: {self.model_name}")

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
            
            usage = {
                "prompt_tokens": response.usage_metadata.prompt_token_count,
                "completion_tokens": response.usage_metadata.candidates_token_count,
                "total_tokens": response.usage_metadata.total_token_count
            }
            
            if response and response.text:
                return json.loads(response.text), usage
            return None, None
            
        except Exception as e:
            print(f"--- AI EXTRACTION ERROR ---")
            print(f"Detail: {str(e)}")
            return None, None