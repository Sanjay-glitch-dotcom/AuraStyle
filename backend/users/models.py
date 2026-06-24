from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    profile_picture = models.URLField(max_length=500, blank=True, null=True)
    
    def __str__(self):
        return self.username

class Address(models.Model):
    user = models.ForeignKey(User, related_name='addresses', on_delete=models.CASCADE)
    title = models.CharField(max_length=100, default="Home") # e.g., Home, Work
    street_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default="India")
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.title} - {self.user.username}"
