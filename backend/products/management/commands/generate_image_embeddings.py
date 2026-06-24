import requests
from io import BytesIO
from PIL import Image
from django.core.management.base import BaseCommand
from products.models import Product
from search.clip_model import CLIPEmbeddingEngine

class Command(BaseCommand):
    help = 'Downloads product images and generates image-based embeddings using CLIP.'

    def handle(self, *args, **kwargs):
        self.stdout.write(self.style.SUCCESS("Starting image embeddings generation..."))
        
        # Initialize the CLIP engine once
        engine = CLIPEmbeddingEngine()
        
        # Get products with an image URL
        products = Product.objects.exclude(image_url__isnull=True).exclude(image_url__exact='')
        total_products = products.count()
        self.stdout.write(f"Found {total_products} products with image URLs.")
        
        success_count = 0
        error_count = 0
        
        for i, product in enumerate(products, 1):
            if i % 10 == 0:
                self.stdout.write(f"Processed {i}/{total_products} products...")
                
            try:
                # 1. Download the image
                response = requests.get(product.image_url, timeout=10)
                response.raise_for_status()
                
                # 2. Open the image
                img = Image.open(BytesIO(response.content))
                
                # 3. Generate the embedding
                embedding = engine.get_image_embedding(img)
                
                # 4. Save to DB
                product.embedding = embedding
                product.save()
                
                success_count += 1
            except requests.exceptions.RequestException as e:
                # Network or HTTP error
                error_count += 1
                self.stderr.write(f"Failed to download image for Product {product.id} ({product.name}): {e}")
            except Exception as e:
                # Other errors (e.g. invalid image format)
                error_count += 1
                self.stderr.write(f"Error processing Product {product.id} ({product.name}): {e}")
                
        self.stdout.write(self.style.SUCCESS(f"Finished! Successfully updated {success_count} products. Errors: {error_count}"))
