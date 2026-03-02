import React from 'react';
import { Space, Avatar, Input, List, Badge, Typography, Modal, Select, message } from 'antd';
import { SearchOutlined, PlusOutlined, MoreOutlined, LogoutOutlined } from '@ant-design/icons';
import useChatStore from '../../store/chatStore';
import api from '../../api';
import useAuthStore from '../../store/authStore';

const { Text } = Typography;

const Sidebar = () => {
  const { conversations, activeConversation, setActiveConversation, setConversations } = useChatStore();
  const { user, logout } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState(null);

  const handleLogout = () => {
    logout();
    message.success("Logged out successfully");
  };

  React.useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get('conversations/');
        setConversations(res.data);
      } catch (err) {
        console.error("Failed to fetch conversations", err);
      }
    };
    fetchConversations();
  }, [setConversations]);

  const handleStartChat = async () => {
    try {
      const res = await api.post('conversations/', { other_user_id: selectedUser });
      
      // Only add to list if it's not already there
      const exists = conversations.find(c => c.id === res.data.id);
      if (!exists) {
        setConversations([...conversations, res.data]);
      }
      
      setIsModalOpen(false);
      setActiveConversation(res.data);
      message.success("Chat started!");
    } catch (err) {
      message.error("Failed to start chat");
    }
  };

  const openNewChatModal = async () => {
    setIsModalOpen(true);
    try {
      const res = await api.get('users/');
      const currentUser = useAuthStore.getState().user;
      setUsers(res.data.filter(u => u.id !== currentUser?.id));
    } catch (err) {
      console.error("Failed to fetch users");
    }
  };

  return (
    <div className="glass-panel" style={{ width: 'var(--sidebar-width)', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Avatar size={44} src={`https://i.pravatar.cc/150?u=${user?.id}`} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text strong style={{ color: 'white' }}>{user?.username || 'Guest'}</Text>
            <Text style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>{user?.email || 'Vibe User'}</Text>
          </div>
        </div>
        <Space>
           <LogoutOutlined 
             onClick={handleLogout}
             style={{ color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '18px' }} 
             title="Logout"
           />
        </Space>
      </div>

      {/* Search */}
      <div style={{ padding: '0 20px 20px' }}>
        <Input 
          prefix={<SearchOutlined style={{ color: 'rgba(255,255,255,0.3)' }} />}
          suffix={<PlusOutlined onClick={openNewChatModal} style={{ color: 'var(--primary)', cursor: 'pointer' }} />}
          placeholder="Start new chat..."
          style={{ height: '40px', borderRadius: '10px' }}
        />
      </div>

      <Modal 
        title="Start a New Conversation" 
        open={isModalOpen} 
        onOk={handleStartChat} 
        onCancel={() => setIsModalOpen(false)}
        okText="Start Chat"
      >
        <Select
          style={{ width: '100%', marginTop: '20px' }}
          placeholder="Select a user"
          onChange={value => setSelectedUser(value)}
          options={users.map(u => ({ label: u.username, value: u.id }))}
        />
      </Modal>

      {/* Chat List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 10px' }} className="scrollbar-hidden">
        <List
          dataSource={conversations}
          renderItem={(item) => {
            const otherParticipant = item.participants.find(p => p.id !== user?.id) || item.participants[0];
            
            return (
              <List.Item
                onClick={() => setActiveConversation(item)}
                style={{
                  border: 'none',
                  padding: '16px 10px',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  backgroundColor: activeConversation?.id === item.id ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  marginBottom: '4px'
                }}
              >
                <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '12px' }}>
                  <Avatar size={48} src={`https://i.pravatar.cc/150?u=${otherParticipant.id}`} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong style={{ color: 'white' }}>{otherParticipant.username}</Text>
                      <Text style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>9:52 AM</Text>
                    </div>
                    <Text ellipsis style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                      {item.last_message?.content || "No messages yet"}
                    </Text>
                  </div>
                </div>
              </List.Item>
            );
          }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
