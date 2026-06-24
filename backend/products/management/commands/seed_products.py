import csv
import os
from django.core.management.base import BaseCommand
from products.models import Product, Category, Store
from search.clip_model import CLIPEmbeddingEngine

class Command(BaseCommand):
    help = 'Seeds the database with realistic fashion products from a CSV dataset and generates CLIP embeddings.'

    def add_arguments(self, parser):
        parser.add_argument('--csv', type=str, help='Path to the CSV dataset file')

    def handle(self, *args, **kwargs):
        csv_file = kwargs.get('csv') or r"E:\Sanjay\Internship\VenuraTech\Major-Project\Project\AuraStyle\myntra202305041052.csv"
        if not csv_file:
            self.stdout.write(self.style.ERROR('Please provide a CSV file using --csv <path_to_csv>'))
            self.stdout.write(self.style.NOTICE('Example: python manage.py seed_products --csv products.csv'))
            self.stdout.write('The CSV should contain the following columns:')
            self.stdout.write('name, description, brand, price, image_url, store_name, category_name, external_url')
            return
        
        if not os.path.exists(csv_file):
            self.stdout.write(self.style.ERROR(f'File not found: {csv_file}'))
            return

        self.stdout.write(self.style.NOTICE('Initializing CLIP Model... (This may take a few seconds)'))
        engine = CLIPEmbeddingEngine()

        self.stdout.write(f'Reading dataset from {csv_file}...')
        
        with open(csv_file, newline='', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            rows = list(reader)
            
        count = 0
        for row in rows:
                # Kaggle Dataset mapping
                store_name = row.get('store_name') or row.get('seller') or 'Myntra'
                store, _ = Store.objects.get_or_create(name=store_name)
                
                category_name = row.get('category_name') or 'Uncategorized'
                category, _ = Category.objects.get_or_create(name=category_name)
                
                name = row.get('name')
                if not name:
                    continue

                # The Kaggle dataset 'img' column has multiple URLs separated by semicolons
                raw_img = row.get('image_url') or row.get('img', '')
                image_url = raw_img.split(';')[0].strip() if raw_img else ''
                
                # External URL mapping
                external_url = row.get('external_url') or row.get('purl', '')
                
                # Description mapping (fallback to name if missing)
                description = row.get('description') or name

                price_str = str(row.get('price') or row.get('mrp') or '0')
                # Clean price string (remove currency symbols, commas)
                price_str = ''.join(c for c in price_str if c.isdigit() or c == '.')
                try:
                    price = float(price_str) if price_str else 0.0
                except ValueError:
                    price = 0.0

                product, created = Product.objects.get_or_create(
                    name=name,
                    defaults={
                        'description': description,
                        'brand': row.get('brand', 'Unknown'),
                        'price': price,
                        'image_url': image_url,
                        'store': store,
                        'category': category,
                        'external_url': external_url
                    }
                )

                if created or product.embedding is None:
                    try:
                        self.stdout.write(f'  Generating embedding for: {product.name}')
                        embedding = engine.get_text_embedding(product.description)
                        product.embedding = embedding
                        product.save()
                        count += 1
                    except Exception as e:
                        self.stdout.write(self.style.ERROR(f'  Error generating embedding for {product.name}: {e}'))

        self.stdout.write(self.style.SUCCESS(f'Successfully seeded {count} new products with embeddings from dataset!'))
