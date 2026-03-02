import React from 'react';
import { Typography, Space, Image, Skeleton, Divider } from 'antd';
import { FileOutlined, LinkOutlined, DownloadOutlined, MessageOutlined } from '@ant-design/icons';
import useChatStore from '../../store/chatStore';

const { Text, Title } = Typography;

const RightPanel = () => {
  const { activeConversation } = useChatStore();

  if (!activeConversation) {
    return (
      <div className="glass-panel" style={{ width: 'var(--right-panel-width)', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <MessageOutlined style={{ fontSize: '40px', color: 'rgba(255,255,255,0.1)', marginBottom: '16px' }} />
        <Text style={{ color: 'rgba(255,255,255,0.3)', textAlign: 'center' }}>Select a chat to view media and files</Text>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ width: 'var(--right-panel-width)', padding: '24px', overflowY: 'auto' }}>
      <Title level={5} style={{ color: 'white', marginBottom: '24px' }}>Shared Media</Title>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '32px' }}>
        {/* Placeholder for real media logic */}
        <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
          <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>No media shared yet</Text>
        </div>
      </div>

      <Title level={5} style={{ color: 'white', marginBottom: '20px' }}>Shared Files</Title>
      <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
          <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>No files found</Text>
      </div>

      <Divider style={{ borderColor: 'rgba(255,255,255,0.05)' }} />

      <Title level={5} style={{ color: 'white', marginBottom: '20px' }}>Shared Links</Title>
      <div style={{ textAlign: 'center', padding: '20px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
          <Text style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>No links shared yet</Text>
      </div>
    </div>
  );
};

export default RightPanel;
