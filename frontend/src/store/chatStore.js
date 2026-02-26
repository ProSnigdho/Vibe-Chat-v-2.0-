import { create } from 'zustand';

const useChatStore = create((set) => ({
    conversations: [],
    activeConversation: null,
    messages: [],
    setConversations: (conversations) => set({ conversations }),
    setActiveConversation: (conversation) => set({ activeConversation: conversation, messages: [] }),
    setMessages: (messages) => set({ messages }),
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    updateConversation: (updatedConv) => set((state) => ({
        conversations: state.conversations.map(c => c.id === updatedConv.id ? updatedConv : c)
    })),
}));

export default useChatStore;
