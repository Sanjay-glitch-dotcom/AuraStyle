from rest_framework import viewsets, permissions
from .models import Product, Category
from .serializers import ProductSerializer, CategorySerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

from rest_framework.pagination import LimitOffsetPagination

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    pagination_class = LimitOffsetPagination

    def get_queryset(self):
        queryset = Product.objects.all()
        category = self.request.query_params.get('category', None)
        if category:
            # Match exactly to prevent 'Men' from matching 'Women'
            queryset = queryset.filter(category__name__iexact=category)
        
        # Remove order_by('?') because it causes SQLite to timeout on large datasets with embeddings
        queryset = queryset.order_by('-id')
            
        return queryset
