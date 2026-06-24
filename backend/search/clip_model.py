import torch
from transformers import CLIPProcessor, CLIPModel
from PIL import Image

class CLIPEmbeddingEngine:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(CLIPEmbeddingEngine, cls).__new__(cls)
            cls._instance.device = "cuda" if torch.cuda.is_available() else "cpu"
            cls._instance.model_id = "openai/clip-vit-base-patch32"
            
            print(f"Loading CLIP model '{cls._instance.model_id}' on {cls._instance.device}...")
            cls._instance.model = CLIPModel.from_pretrained(cls._instance.model_id).to(cls._instance.device)
            cls._instance.processor = CLIPProcessor.from_pretrained(cls._instance.model_id)
            print("CLIP model loaded successfully.")
        return cls._instance

    def get_text_embedding(self, text: str) -> list:
        inputs = self.processor(text=[text], return_tensors="pt", padding=True).to(self.device)
        with torch.no_grad():
            outputs = self.model.get_text_features(**inputs)
            
        # Extract pooler_output since Transformers 4.x returns BaseModelOutputWithPooling in some cases,
        # or it might return a tensor.
        text_features = outputs.pooler_output if hasattr(outputs, 'pooler_output') else outputs
        if hasattr(text_features, 'text_embeds'):
            text_features = text_features.text_embeds
            
        # Normalize the embedding
        text_features = text_features / text_features.norm(dim=-1, keepdim=True)
        return text_features.cpu().numpy().tolist()[0]

    def get_image_embedding(self, image: Image.Image) -> list:
        # Convert image to RGB if not already
        if image.mode != "RGB":
            image = image.convert("RGB")
            
        inputs = self.processor(images=image, return_tensors="pt").to(self.device)
        with torch.no_grad():
            outputs = self.model.get_image_features(**inputs)
            
        # Extract tensor
        image_features = outputs.pooler_output if hasattr(outputs, 'pooler_output') else outputs
        if hasattr(image_features, 'image_embeds'):
            image_features = image_features.image_embeds
            
        # Normalize the embedding
        image_features = image_features / image_features.norm(dim=-1, keepdim=True)
        return image_features.cpu().numpy().tolist()[0]
