from django.urls import path
from .views import TextSearchView, ImageSearchView, HybridSearchView, RecommendationView, AutocompleteView

urlpatterns = [
    path('text/', TextSearchView.as_view(), name='search_text'),
    path('image/', ImageSearchView.as_view(), name='search_image'),
    path('hybrid/', HybridSearchView.as_view(), name='search_hybrid'),
    path('recommendations/', RecommendationView.as_view(), name='recommendations'),
    path('autocomplete/', AutocompleteView.as_view(), name='autocomplete'),
]
