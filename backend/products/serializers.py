from rest_framework import serializers
from .models import Product, Category, Store

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ('id', 'name', 'website_url', 'logo_url')

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, required=False
    )
    store = StoreSerializer(read_only=True)
    similarity_score = serializers.FloatField(read_only=True, required=False)

    class Meta:
        model = Product
        fields = ('id', 'name', 'description', 'category', 'category_id', 'brand', 'price', 'image_url', 'store', 'external_url', 'external_product_id', 'similarity_score')
        # We generally do not expose the raw embedding vector via API to save bandwidth, unless specifically needed
