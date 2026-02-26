import { useEffect, useRef } from 'react';
import useChatStore from '../store/chatStore';
import useAuthStore from '../store/authStore';

const useWebSocket = (conversationId) => {
    const socketRef = useRef(null);
    const addMessage = useChatStore((state) => state.addMessage);
    const user = useAuthStore((state) => state.user);

    useEffect(() => {
        if (!conversationId) return;

        const socket = new WebSocket(`ws://localhost:8000/ws/chat/${conversationId}/`);
        socketRef.current = socket;

        socket.onmessage = (e) => {
            const data = json.parse(e.data);
            addMessage(data);
        };

        socket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        return () => socket.close();
    }, [conversationId]);

    const sendMessage = (message) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                message,
                sender_id: 1, // temporary hardcoded for demo, should come from auth
            }));
        }
    };

    return { sendMessage };
};

export default useWebSocket;
