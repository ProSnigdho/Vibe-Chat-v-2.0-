from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer

class ConversationListView(generics.ListCreateAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.conversations.all()

    def perform_create(self, serializer):
        user = self.request.user
        other_user_id = self.request.data.get('other_user_id')
        
        if other_user_id:
            # Check for existing 1-on-1 conversation
            existing = Conversation.objects.filter(participants=user).filter(participants=other_user_id).first()
            if existing:
                # We can't easily "cancel" the create and return existing via perform_create
                # but we can set an attribute on the serializer instance to catch it in the view if needed.
                # However, for simplicity, we'll let the view handle the actual response logic.
                pass
        
        conversation = serializer.save()
        conversation.participants.add(user)
        if other_user_id:
            conversation.participants.add(other_user_id)

    def create(self, request, *args, **kwargs):
        other_user_id = request.data.get('other_user_id')
        if other_user_id:
            existing = Conversation.objects.filter(participants=request.user).filter(participants=other_user_id).first()
            if existing:
                serializer = self.get_serializer(existing)
                return Response(serializer.data)
        return super().create(request, *args, **kwargs)


class MessageListView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        conversation_id = self.kwargs['conversation_id']
        return Message.objects.filter(conversation_id=conversation_id)
