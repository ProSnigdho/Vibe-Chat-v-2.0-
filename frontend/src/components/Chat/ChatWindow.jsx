import React, { useState } from 'react';
import useChatStore from '../../store/chatStore';
import { Send, Smile, Paperclip, Mic } from 'lucide-react';

const ChatWindow = () => {
  const { activeConversation, messages } = useChatStore();
  const [input, setInput] = useState('');

  if (!activeConversation) {
    return (
      <div className="chat-window" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: '#667781' }}>
          <h3>Vibe Chat</h3>
          <p>Send and receive messages without keeping your phone online.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <header style={{ padding: '10px 16px', backgroundColor: 'var(--bg-main)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', zIndex: 1 }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#ccc', marginRight: '15px' }}></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500 }}>{activeConversation.participants[0].username}</div>
          <div style={{ fontSize: '12px', color: '#667781' }}>online</div>
        </div>
      </header>

      <main style={{ flex: 1, overflowY: 'auto', padding: '20px 40px', display: 'flex', flexDirection: 'column', gap: '8px', zIndex: 1 }}>
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            style={{ 
              maxWidth: '65%', 
              padding: '6px 10px', 
              borderRadius: '8px',
              fontSize: '14.5px',
              alignSelf: msg.sender.id === 1 ? 'flex-end' : 'flex-start',
              backgroundColor: msg.sender.id === 1 ? 'var(--bubble-out)' : 'var(--bubble-in)',
              boxShadow: '0 1px 0.5px rgba(11,20,26,.13)',
              position: 'relative'
            }}
          >
            {msg.content}
            <span style={{ fontSize: '11px', color: '#667781', marginLeft: '12px', verticalAlign: 'bottom' }}>12:46 PM</span>
          </div>
        ))}
      </main>

      <footer style={{ padding: '10px 16px', backgroundColor: '#f0f2f5', display: 'flex', alignItems: 'center', gap: '15px', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: '15px', color: '#54656f' }}>
          <Smile size={24} />
          <Paperclip size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <input 
            type="text" 
            placeholder="Type a message" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: 'none', outline: 'none', background: '#fff' }}
          />
        </div>
        <div style={{ color: '#54656f' }}>
          {input ? <Send size={24} /> : <Mic size={24} />}
        </div>
      </footer>
    </div>
  );
};

export default ChatWindow;
