import React from 'react';
import useChatStore from '../../store/chatStore';
import { Search, MoreVertical, MessageSquare } from 'lucide-react';

const Sidebar = () => {
  const { conversations, activeConversation, setActiveConversation } = useChatStore();

  return (
    <div className="sidebar">
      <header style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', backgroundColor: 'var(--bg-main)' }}>
        <div className="avatar" style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#ccc' }}></div>
        <div className="actions" style={{ display: 'flex', gap: '20px', alignItems: 'center', color: '#54656f' }}>
          <MessageSquare size={20} />
          <MoreVertical size={20} />
        </div>
      </header>
      
      <div className="search-container" style={{ padding: '8px 12px' }}>
        <div style={{ backgroundColor: 'var(--bg-main)', borderRadius: '8px', display: 'flex', alignItems: 'center', padding: '6px 14px' }}>
          <Search size={18} color="#667781" />
          <input 
            type="text" 
            placeholder="Search or start new chat" 
            style={{ border: 'none', background: 'transparent', marginLeft: '12px', outline: 'none', width: '100%' }}
          />
        </div>
      </div>

      <div className="conversation-list" style={{ flex: 1, overflowY: 'auto' }}>
        {conversations.map((conv) => (
          <div 
            key={conv.id} 
            onClick={() => setActiveConversation(conv)}
            style={{ 
              display: 'flex', 
              padding: '12px 16px', 
              cursor: 'pointer',
              backgroundColor: activeConversation?.id === conv.id ? '#f0f2f5' : 'transparent'
            }}
          >
            <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#ccc', marginRight: '15px' }}></div>
            <div style={{ flex: 1, borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 500 }}>{conv.participants[0].username}</span>
                <span style={{ fontSize: '12px', color: '#667781' }}>12:45 PM</span>
              </div>
              <div style={{ fontSize: '14px', color: '#667781', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {conv.last_message?.content || "Start a conversation"}
              </div>
            </div>
          </div>
        ))}
        {conversations.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#667781' }}>
            No conversations yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
