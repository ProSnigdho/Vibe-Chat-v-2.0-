import React, { useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import useAuthStore from './store/authStore';
import Sidebar from './components/Chat/Sidebar';
import ChatWindow from './components/Chat/ChatWindow';
import RightPanel from './components/Chat/RightPanel';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';

function App() {
  const { isAuthenticated } = useAuthStore();
  const [showSignup, setShowSignup] = useState(false);

  const customTheme = {
    algorithm: theme.darkAlgorithm,
    token: {
      colorPrimary: '#8e2de2',
      borderRadius: 12,
      colorBgContainer: 'transparent',
    },
    components: {
      Layout: {
        colorBgHeader: 'transparent',
        colorBgBody: 'transparent',
      },
      Card: {
        colorBgContainer: 'rgba(255, 255, 255, 0.03)',
      },
      Input: {
        colorBgContainer: 'rgba(255, 255, 255, 0.05)',
        colorBorder: 'rgba(255, 255, 255, 0.1)',
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <ConfigProvider theme={customTheme}>
        {showSignup ? (
          <Signup onSwitchToLogin={() => setShowSignup(false)} />
        ) : (
          <Login onSwitchToSignup={() => setShowSignup(true)} />
        )}
      </ConfigProvider>
    );
  }

  return (
    <ConfigProvider theme={customTheme}>
      <div style={{ display: 'flex', width: '100vw', height: '100vh', background: 'var(--dark-bg)' }}>
        <Sidebar />
        <ChatWindow />
        <RightPanel />
      </div>
    </ConfigProvider>
  );
}

export default App;
