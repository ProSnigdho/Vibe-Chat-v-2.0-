from rest_framework import generics, permissions
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer

class ConversationListView(generics.ListCreateAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return self.request.user.conversations.all()

    def perform_create(self, serializer):
        # Specific logic for creating a 1-on-1 chat could be added here
        serializer.save()

class MessageListView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        conversation_id = self.kwargs['conversation_id']
        return Message.objects.filter(conversation_id=conversation_id)
