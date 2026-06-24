import cv2
import numpy as np
from PIL import Image
import io

class ImageProcessor:
    @staticmethod
    def process_uploaded_image(uploaded_file) -> Image.Image:
        """
        Reads an uploaded Django file, processes it with OpenCV (e.g., resizing, standardizing format),
        and returns a PIL Image ready for the CLIP model.
        """
        # Read file bytes
        file_bytes = np.frombuffer(uploaded_file.read(), np.uint8)
        
        # Decode image using OpenCV
        img_cv = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
        
        if img_cv is None:
            raise ValueError("Invalid image file.")
            
        # Optional: Apply some OpenCV preprocessing like resizing if too large
        max_dim = 1024
        h, w = img_cv.shape[:2]
        if max(h, w) > max_dim:
            scale = max_dim / max(h, w)
            img_cv = cv2.resize(img_cv, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)

        # Convert from BGR (OpenCV default) to RGB (CLIP/PIL default)
        img_rgb = cv2.cvtColor(img_cv, cv2.COLOR_BGR2RGB)
        
        # Convert back to PIL Image
        pil_img = Image.fromarray(img_rgb)
        
        return pil_img
