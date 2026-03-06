from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Profile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class ProfileSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username')
    email = serializers.EmailField(source='user.email')
    user_id = serializers.IntegerField(source='user.id', read_only=True)

    class Meta:
        model = Profile
        fields = ['user_id', 'username', 'email', 'avatar', 'bio', 'online_status', 'last_seen', 'role']

    def update(self, instance, validated_data):
        # Handle nested User update
        user_data = validated_data.pop('user', None)
        if user_data:
            user = instance.user
            user.username = user_data.get('username', user.username)
            user.email = user_data.get('email', user.email)
            user.save()
        
        # Handle Profile fields
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.bio = validated_data.get('bio', instance.bio)
        instance.role = validated_data.get('role', instance.role)
        instance.save()
        return instance

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    role = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'role']

    def create(self, validated_data):
        role_data = validated_data.pop('role', 'user')
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data.get('email', '')
        )
        Profile.objects.create(user=user, role=role_data)
        return user
