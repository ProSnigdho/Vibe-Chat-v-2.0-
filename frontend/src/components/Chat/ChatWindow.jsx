import React, { useState } from 'react';
import { Avatar, Input, Button, Typography, Space, Card } from 'antd';
import { 
  SendOutlined, 
  SmileOutlined, 
  PaperClipOutlined, 
  AudioOutlined,
  SearchOutlined,
  MoreOutlined,
  PhoneOutlined,
  VideoCameraOutlined
} from '@ant-design/icons';
import useChatStore from '../../store/chatStore';
import api from '../../api';
import useWebSocket from '../../hooks/useWebSocket';
import useAuthStore from '../../store/authStore';

const { Text, Title } = Typography;

const ChatWindow = () => {
  const { activeConversation, messages, setMessages } = useChatStore();
  const { user } = useAuthStore();
  const [input, setInput] = useState('');
  const { sendMessage } = useWebSocket(activeConversation?.id);
  const scrollRef = React.useRef(null);

  React.useEffect(() => {
    if (activeConversation) {
      const fetchMessages = async () => {
        try {
          const res = await api.get(`conversations/${activeConversation.id}/messages/`);
          setMessages(res.data);
        } catch (err) {
          console.error("Failed to fetch messages", err);
        }
      };
      fetchMessages();
    }
  }, [activeConversation, setMessages]);

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input);
      setInput('');
    }
  };

  if (!activeConversation) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--dark-bg)' }}>
        <Space direction="vertical" align="center" size="large">
          <Avatar size={100} icon={<SmileOutlined />} style={{ background: 'var(--glass-bg)' }} />
          <Title level={3} style={{ color: 'white', margin: 0 }}>Select a Vibe to Start</Title>
          <Text style={{ color: 'var(--text-secondary)' }}>Pick a conversation from the left to start chatting.</Text>
        </Space>
      </div>
    );
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--dark-bg)', borderRight: '1px solid var(--glass-border)' }}>
      {/* Header */}
      <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {(() => {
            const participants = activeConversation?.participants || [];
            const otherUser = participants.find(p => p.id !== user?.id) || participants[0];
            
            if (!otherUser) {
              return <Text style={{ color: 'white' }}>Conversation</Text>;
            }

            return (
              <>
                <Avatar size={40} src={`https://i.pravatar.cc/150?u=${otherUser.id}`} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <Text strong style={{ color: 'white' }}>{otherUser.username}</Text>
                  <Text style={{ color: 'var(--secondary)', fontSize: '10px' }}>Active now</Text>
                </div>
              </>
            );
          })()}
        </div>
        <Space size="large" style={{ color: 'var(--text-secondary)' }}>
          <SearchOutlined />
          <PhoneOutlined />
          <VideoCameraOutlined />
          <MoreOutlined />
        </Space>
      </div>

      {/* Messages */}
      <div 
        ref={scrollRef}
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '24px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px' 
        }} 
        className="scrollbar-hidden"
      >
        {messages.map((msg, index) => {
          // Handle both API (msg.sender.id) and WebSocket (msg.sender_id)
          const senderId = msg.sender?.id || msg.sender_id;
          const isMe = senderId === user?.id;
          return (
            <div 
              key={msg.id || index} 
              style={{ 
                display: 'flex', 
                justifyContent: isMe ? 'flex-end' : 'flex-start',
                alignItems: 'flex-end',
                gap: '8px'
              }}
            >
              {!isMe && <Avatar size={32} src={`https://i.pravatar.cc/150?u=${senderId}`} />}
              <div style={{
                maxWidth: '70%',
                padding: '12px 16px',
                borderRadius: isMe ? '16px 16px 0 16px' : '16px 16px 16px 0',
                background: isMe ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
              }}>
                <Text style={{ color: 'white' }}>{msg.content}</Text>
                <div style={{ textAlign: 'right', marginTop: '4px' }}>
                  <Text style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)' }}>
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </Text>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div style={{ padding: '24px', background: 'rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '8px 16px', borderRadius: '16px' }}>
          <SmileOutlined style={{ color: 'var(--text-secondary)', fontSize: '20px' }} />
          <PaperClipOutlined style={{ color: 'var(--text-secondary)', fontSize: '20px' }} />
          <Input 
            variant="borderless"
            placeholder="Type your vibe..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onPressEnter={handleSend}
            style={{ color: 'white' }}
          />
          <Button 
            type="primary" 
            shape="circle" 
            icon={<SendOutlined />} 
            onClick={handleSend}
            style={{ width: '40px', height: '40px' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
