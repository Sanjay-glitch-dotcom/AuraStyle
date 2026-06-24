from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, RegisterSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.views import APIView
from rest_framework import status

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    queryset = User.objects.all()
    permission_classes = (IsAuthenticated,)
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            # Simple JWT handles token blacklisting if configured, 
            # but usually frontend just deletes the token. 
            # We can return success.
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

from rest_framework import viewsets
from .models import Address
from .serializers import AddressSerializer

class AddressViewSet(viewsets.ModelViewSet):
    serializer_class = AddressSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        return Address.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # If this is set to default, unset other defaults
        is_default = serializer.validated_data.get('is_default', False)
        if is_default:
            Address.objects.filter(user=self.request.user).update(is_default=False)
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        is_default = serializer.validated_data.get('is_default', False)
        if is_default:
            Address.objects.filter(user=self.request.user).update(is_default=False)
        serializer.save()

class DeleteAccountView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        password = request.data.get('password')
        if not password:
            return Response({"detail": "Password is required."}, status=status.HTTP_400_BAD_REQUEST)
            
        user = request.user
        if not user.check_password(password):
            return Response({"detail": "Incorrect password. Please try again."}, status=status.HTTP_400_BAD_REQUEST)
            
        # Delete user (this will cascade delete related data)
        user.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
