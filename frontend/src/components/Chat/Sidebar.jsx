import React from 'react';
import { Space, Avatar, Input, List, Badge, Typography, Modal, Select, message, Upload, Button } from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  MoreOutlined, 
  LogoutOutlined, 
  UserOutlined, 
  CameraOutlined,
  SettingOutlined
} from '@ant-design/icons';
import useChatStore from '../../store/chatStore';
import api from '../../api';
import useAuthStore from '../../store/authStore';

const { Text } = Typography;

const Sidebar = () => {
  const { conversations, activeConversation, setActiveConversation, setConversations } = useChatStore();
  const { user, logout, setUser } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState(null);
  
  const [profileData, setProfileData] = React.useState({
    username: '',
    email: '',
    bio: '',
    avatarPreview: null,
    avatarFile: null
  });

  const SERVER_URL = 'http://localhost:8000';

  const getFullUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${SERVER_URL}${path}`;
  };

  React.useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || '',
        email: user.email || '',
        bio: user.profile?.bio || '',
        avatarPreview: getFullUrl(user.profile?.avatar),
        avatarFile: null
      });
    }
  }, [user]);

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

  const handleProfileUpdate = async () => {
    const formData = new FormData();
    formData.append('username', profileData.username);
    formData.append('email', profileData.email);
    formData.append('bio', profileData.bio);
    if (profileData.avatarFile) {
      formData.append('avatar', profileData.avatarFile);
    }

    try {
      const res = await api.patch('auth/profile/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const updatedUser = {
        ...user,
        id: res.data.user_id, // Ensure ID is consistent
        username: res.data.username,
        email: res.data.email,
        profile: res.data
      };
      
      setUser(updatedUser);
      setIsProfileModalOpen(false);
      message.success("Profile updated successfully!");
    } catch (err) {
      console.error("Profile update error:", err);
      const errorDetail = err.response?.data ? JSON.stringify(err.response.data) : "Update failed";
      message.error(errorDetail);
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
        <div 
          onClick={() => setIsProfileModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <Avatar 
            size={44} 
            src={getFullUrl(user?.profile?.avatar)} 
            icon={!user?.profile?.avatar && <UserOutlined />}
            style={{ backgroundColor: 'var(--primary)' }}
          />
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

      {/* Profile Modal */}
      <Modal
        title={<Text strong style={{ color: 'white' }}>Profile Settings</Text>}
        open={isProfileModalOpen}
        onOk={handleProfileUpdate}
        onCancel={() => setIsProfileModalOpen(false)}
        okText="Save Changes"
        cancelText="Discard"
        className="glass-modal"
        centered
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', alignItems: 'center', padding: '20px 0' }}>
          <div style={{ position: 'relative' }}>
            <Avatar 
              size={100} 
              src={profileData.avatarPreview} 
              icon={!profileData.avatarPreview && <UserOutlined />}
              style={{ border: '3px solid var(--primary)', padding: '2px', background: 'transparent' }}
            />
            <Upload
              showUploadList={false}
              beforeUpload={(file) => {
                const reader = new FileReader();
                reader.onload = e => setProfileData(prev => ({ ...prev, avatarPreview: e.target.result, avatarFile: file }));
                reader.readAsDataURL(file);
                return false;
              }}
            >
              <Button 
                shape="circle" 
                size="small" 
                icon={<CameraOutlined />} 
                style={{ position: 'absolute', bottom: 5, right: 5, background: 'var(--primary)', color: 'white', border: 'none' }}
              />
            </Upload>
          </div>
          
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <Text style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>USERNAME</Text>
              <Input 
                placeholder="Username" 
                value={profileData.username} 
                onChange={e => setProfileData(p => ({...p, username: e.target.value}))}
                style={{ marginTop: '4px' }}
              />
            </div>
            <div>
              <Text style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>EMAIL</Text>
              <Input 
                placeholder="Email" 
                value={profileData.email} 
                onChange={e => setProfileData(p => ({...p, email: e.target.value}))}
                style={{ marginTop: '4px' }}
              />
            </div>
            <div>
              <Text style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>BIO</Text>
              <Input.TextArea 
                placeholder="Tell us about yourself..." 
                value={profileData.bio} 
                onChange={e => setProfileData(p => ({...p, bio: e.target.value}))}
                style={{ marginTop: '4px' }}
                rows={3}
              />
            </div>
          </div>
        </div>
      </Modal>

      {/* Search */}
      <div style={{ padding: '0 20px 20px' }}>
        <Input 
          prefix={<SearchOutlined style={{ color: 'rgba(255,255,255,0.3)' }} />}
          suffix={<PlusOutlined onClick={openNewChatModal} style={{ color: 'var(--primary)', cursor: 'pointer' }} />}
          placeholder="Search or start new chat..."
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
            const avatarUrl = getFullUrl(otherParticipant.profile?.avatar);
            
            return (
              <List.Item
                onClick={() => setActiveConversation(item)}
                style={{
                  border: 'none',
                  padding: '12px 10px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  backgroundColor: activeConversation?.id === item.id ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                  marginBottom: '4px',
                  transition: 'all 0.3s'
                }}
              >
                <div style={{ display: 'flex', width: '100%', alignItems: 'center', gap: '12px' }}>
                  <Avatar 
                    size={48} 
                    src={avatarUrl} 
                    icon={!avatarUrl && <UserOutlined />}
                  />
                  <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong style={{ color: 'white' }}>{otherParticipant.username}</Text>
                      <Text style={{ color: 'var(--text-secondary)', fontSize: '10px' }}>
                        {item.last_message ? new Date(item.last_message.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ''}
                      </Text>
                    </div>
                    <Text ellipsis style={{ color: 'var(--text-secondary)', fontSize: '13px', display: 'block' }}>
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
