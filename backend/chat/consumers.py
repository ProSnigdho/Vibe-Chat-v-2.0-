import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import User
from .models import Conversation, Message

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'chat_{self.room_name}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        sender_id = data['sender_id']

        # Save message to database
        saved_msg = await self.save_message(sender_id, self.room_name, message)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender_id': sender_id,
                'timestamp': str(saved_msg.timestamp),
                'id': saved_msg.id
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        sender_id = event['sender_id']
        timestamp = event['timestamp']
        msg_id = event['id']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'sender_id': sender_id,
            'timestamp': timestamp,
            'id': msg_id
        }))

    @database_sync_to_async
    def save_message(self, sender_id, conversation_id, content):
        sender = User.objects.get(id=sender_id)
        conversation = Conversation.objects.get(id=conversation_id)
        return Message.objects.create(
            sender=sender,
            conversation=conversation,
            content=content
        )
