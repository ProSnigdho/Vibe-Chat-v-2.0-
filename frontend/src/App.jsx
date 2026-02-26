import React, { useEffect } from 'react';
import useAuthStore from './store/authStore';
import Sidebar from './components/Chat/Sidebar';
import ChatWindow from './components/Chat/ChatWindow';

import Login from './components/Auth/Login';

function App() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Login />;
  }


  return (
    <div className="chat-container">
      <Sidebar />
      <ChatWindow />
    </div>
  );
}

export default App;
