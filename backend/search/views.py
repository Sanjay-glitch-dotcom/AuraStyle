from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .clip_model import CLIPEmbeddingEngine
from .image_processor import ImageProcessor
from .similarity import SimilarityEngine
from products.serializers import ProductSerializer
from core.models import SearchHistory
from products.models import Product
from rest_framework.permissions import IsAuthenticated, AllowAny

class TextSearchView(APIView):
    def post(self, request):
        query = request.data.get('query')
        if not query:
            return Response({"error": "Query text is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            # 1. Generate text embedding
            engine = CLIPEmbeddingEngine()
            embedding = engine.get_text_embedding(query)
            
            # 2. Find similar products with hybrid text re-ranking
            results = SimilarityEngine.search_similar_products(embedding, query_text=query)
            
            # 3. Log search history
            user = request.user if request.user.is_authenticated else None
            SearchHistory.objects.create(user=user, query_text=query, search_type='TEXT')
            
            # 4. Serialize and return
            serializer = ProductSerializer(results, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ImageSearchView(APIView):
    def post(self, request):
        image_file = request.FILES.get('image')
        if not image_file:
            return Response({"error": "Image file is required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            # 1. Process image
            pil_image = ImageProcessor.process_uploaded_image(image_file)
            
            # 2. Generate image embedding
            engine = CLIPEmbeddingEngine()
            embedding = engine.get_image_embedding(pil_image)
            
            # 3. Find similar products
            results = SimilarityEngine.search_similar_products(embedding)
            
            # 4. Log search history
            user = request.user if request.user.is_authenticated else None
            # Note: For production, we'd save the image to Cloudinary and log the URL.
            SearchHistory.objects.create(user=user, search_type='IMAGE')
            
            # 5. Serialize and return
            serializer = ProductSerializer(results, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class HybridSearchView(APIView):
    def post(self, request):
        query = request.data.get('query')
        image_file = request.FILES.get('image')
        
        if not query or not image_file:
            return Response({"error": "Both query text and image file are required"}, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            engine = CLIPEmbeddingEngine()
            
            # 1. Get Text Embedding
            text_emb = engine.get_text_embedding(query)
            
            # 2. Get Image Embedding
            pil_image = ImageProcessor.process_uploaded_image(image_file)
            image_emb = engine.get_image_embedding(pil_image)
            
            # 3. Combine Embeddings
            combined_emb = SimilarityEngine.combine_embeddings(text_emb, image_emb)
            
            # 4. Search with hybrid text re-ranking
            results = SimilarityEngine.search_similar_products(combined_emb, query_text=query)
            
            # 5. Log
            user = request.user if request.user.is_authenticated else None
            SearchHistory.objects.create(user=user, query_text=query, search_type='HYBRID')
            
            # 6. Serialize
            serializer = ProductSerializer(results, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class RecommendationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # A simple recommendation engine based on user's recent favorites or search history
        try:
            user = request.user
            # Get latest favorited product
            favorite = user.favorites.order_by('-created_at').first()
            if favorite and favorite.product.embedding is not None:
                # Find similar products to the favorite
                results = SimilarityEngine.search_similar_products(favorite.product.embedding, limit=10)
                # Exclude the favorited product itself
                results = [r for r in results if r.id != favorite.product.id]
                serializer = ProductSerializer(results, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            
            # Fallback: Just return trending/latest products
            products = Product.objects.all().order_by('-id')[:10]
            serializer = ProductSerializer(products, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AutocompleteView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        q = request.query_params.get('q', '').strip()
        if not q:
            return Response([], status=status.HTTP_200_OK)
            
        # Fast case-insensitive search by name
        products = Product.objects.filter(name__icontains=q)[:5]
        
        results = [
            {
                "id": p.id,
                "name": p.name,
                "category": p.category.name if p.category else "Uncategorized"
            }
            for p in products
        ]
        
        return Response(results, status=status.HTTP_200_OK)
