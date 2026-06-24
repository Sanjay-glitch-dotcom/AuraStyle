from django.db import models
from django.conf import settings
from products.models import Product

class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='favorites', on_delete=models.CASCADE)
    product = models.ForeignKey(Product, related_name='favorited_by', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'product')

    def __str__(self):
        return f"{self.user.username} - {self.product.name}"

class SearchHistory(models.Model):
    SEARCH_TYPES = (
        ('TEXT', 'Text'),
        ('IMAGE', 'Image'),
        ('HYBRID', 'Hybrid'),
        ('VOICE', 'Voice')
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='search_history', on_delete=models.SET_NULL, null=True, blank=True)
    query_text = models.CharField(max_length=255, blank=True, null=True)
    query_image_url = models.URLField(max_length=500, blank=True, null=True)
    search_type = models.CharField(max_length=10, choices=SEARCH_TYPES, default='TEXT')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username if self.user else 'Anonymous'} - {self.search_type} search at {self.timestamp}"
