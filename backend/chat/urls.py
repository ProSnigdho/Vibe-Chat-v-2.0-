from django.urls import path
from .views import ConversationListView, MessageListView

urlpatterns = [
    path('', ConversationListView.as_view(), name='conversation_list'),
    path('<int:conversation_id>/messages/', MessageListView.as_view(), name='message_list'),
]
