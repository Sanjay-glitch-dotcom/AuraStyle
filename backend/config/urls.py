from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    path('profile.html', TemplateView.as_view(template_name='profile.html'), name='profile'),
    path('auth.html', TemplateView.as_view(template_name='auth.html'), name='auth'),
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/', include('products.urls')),
    path('api/', include('core.urls')),
    path('api/search/', include('search.urls')),
]
