import re
from django.core.management.base import BaseCommand
from products.models import Product, Category, Store

class Command(BaseCommand):
    help = 'Cleans the database by correctly assigning categories based on product text and consolidating stores to Myntra.'

    def handle(self, *args, **kwargs):
        # Ensure categories exist
        cat_men, _ = Category.objects.get_or_create(name='Men')
        cat_women, _ = Category.objects.get_or_create(name='Women')
        cat_kids, _ = Category.objects.get_or_create(name='Kids')
        cat_shoes, _ = Category.objects.get_or_create(name='Footwear')
        cat_acc, _ = Category.objects.get_or_create(name='Accessories')
        cat_beauty, _ = Category.objects.get_or_create(name='Beauty & Personal Care')
        cat_sports, _ = Category.objects.get_or_create(name='Sports & Fitness')
        cat_other, _ = Category.objects.get_or_create(name='Other')

        myntra_store, _ = Store.objects.get_or_create(name='Myntra')

        products = Product.objects.all()
        updated_count = 0
        store_updated_count = 0

        self.stdout.write(f'Scanning {products.count()} products...')

        products_to_update = []
        
        from django.db import transaction
        with transaction.atomic():
            for p in products:
                text = f"{p.name} {p.description}".lower()
                assigned_cat = None

                # 1. Update store to Myntra
                if p.store_id != myntra_store.id:
                    p.store = myntra_store
                    store_updated_count += 1

                # 2. Strict mapping rules
                is_kids = bool(re.search(r'\b(kid|kids|boy|boys|girl|girls|infant|toddler|baby|children)\b', text))
                is_women = bool(re.search(r'\b(women|woman|womens|lady|ladies)\b', text))
                is_men = bool(re.search(r'\b(men|man|mens|male)\b', text))
                
                # Check Kids
                if is_kids:
                    assigned_cat = cat_kids
                
                # Check explicit Women
                elif is_women and not is_men:
                    assigned_cat = cat_women
                    
                # Check explicit Men
                elif is_men and not is_women:
                    assigned_cat = cat_men

                # Check Footwear
                elif re.search(r'\b(shoe|shoes|sneaker|sneakers|sandal|sandals|boot|boots|heel|heels|flip flops)\b', text):
                    assigned_cat = cat_shoes
                
                # Check Beauty
                elif re.search(r'\b(makeup|lipstick|mascara|perfume|cologne|serum|skincare|shampoo|lotion|cream|fragrance)\b', text):
                    assigned_cat = cat_beauty
                    
                # Check Accessories
                elif re.search(r'\b(bag|bags|backpack|wallet|purse|sunglasses|watch|watches|belt|jewelry|necklace|earrings|bracelet|ring)\b', text):
                    assigned_cat = cat_acc

                # Check Sports
                elif re.search(r'\b(track pants|trackpants|activewear|gym|yoga|sports bra)\b', text):
                    assigned_cat = cat_sports

                # Implicit Women clothing
                elif re.search(r'\b(dress|saree|kurti|blouse|skirt|lehenga|bra|panties|gown|crop|leggings|jeggings|tube top|tank top)\b', text):
                    assigned_cat = cat_women

                # Implicit Men clothing (Removed unisex items like t-shirt, shirt, jeans, trousers, jacket)
                elif re.search(r'\b(suit|kurta|sherwani|dhoti)\b', text):
                    assigned_cat = cat_men
                
                if not assigned_cat:
                    # Fallback if both men and women are mentioned, default to women for fashion
                    if is_women:
                        assigned_cat = cat_women
                    elif is_men:
                        assigned_cat = cat_men
                    else:
                        assigned_cat = cat_other

                p.category = assigned_cat
                products_to_update.append(p)
                updated_count += 1

            Product.objects.bulk_update(products_to_update, ['category', 'store'], batch_size=1000)

        self.stdout.write(self.style.SUCCESS(f'Successfully assigned categories to {updated_count} products.'))
        self.stdout.write(self.style.SUCCESS(f'Successfully updated {store_updated_count} products to the Myntra store.'))
