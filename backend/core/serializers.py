from rest_framework import serializers
from .models import Favorite, SearchHistory
from products.serializers import ProductSerializer

class FavoriteSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Favorite
        fields = ('id', 'product', 'product_id', 'created_at')

class SearchHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SearchHistory
        fields = ('id', 'query_text', 'query_image_url', 'search_type', 'timestamp')
