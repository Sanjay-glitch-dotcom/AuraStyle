from django.db import models
from pgvector.django import VectorField, HnswIndex

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name

class Store(models.Model):
    name = models.CharField(max_length=100, unique=True)
    website_url = models.URLField(max_length=255, blank=True, null=True)
    logo_url = models.URLField(max_length=500, blank=True, null=True)
    affiliate_code = models.CharField(max_length=100, blank=True, null=True)
    status = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class Product(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField()
    category = models.ForeignKey(Category, related_name='products', on_delete=models.SET_NULL, null=True)
    brand = models.CharField(max_length=100, blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    image_url = models.URLField(max_length=500, blank=True, null=True)
    
    # Store Affiliate Fields
    store = models.ForeignKey(Store, related_name='products', on_delete=models.CASCADE, null=True, blank=True)
    external_url = models.URLField(max_length=1000, blank=True, null=True)
    external_product_id = models.CharField(max_length=255, blank=True, null=True)
    
    # OpenAI CLIP embeddings are typically 512 dimensions (ViT-B/32)
    embedding = VectorField(dimensions=512, blank=True, null=True)

    class Meta:
        indexes = [
            HnswIndex(
                name='embedding_index',
                fields=['embedding'],
                m=16,
                ef_construction=64,
                opclasses=['vector_cosine_ops']
            )
        ]

    def __str__(self):
        return self.name
