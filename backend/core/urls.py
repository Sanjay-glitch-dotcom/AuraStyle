from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FavoriteViewSet, SearchHistoryViewSet

router = DefaultRouter()
router.register(r'favorites', FavoriteViewSet, basename='favorite')
router.register(r'search-history', SearchHistoryViewSet, basename='search-history')

urlpatterns = [
    path('', include(router.urls)),
]
