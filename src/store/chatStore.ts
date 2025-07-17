import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ChatState, Chatroom, Message } from '../types';
import toast from 'react-hot-toast';

// Mock AI responses
const aiResponses = [
  "I'm here to help! What would you like to know?",
  "That's an interesting question. Let me think about that...",
  "I can assist you with various tasks. What specific help do you need?",
  "Great question! Here's what I know about that topic...",
  "I'm always learning new things. Thanks for asking!",
  "Let me provide you with some helpful information...",
  "That's a thoughtful inquiry. Here's my perspective...",
  "I'd be happy to help you with that. Let me explain...",
];

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      chatrooms: [],
      currentChatroom: null,
      messages: [],
      isTyping: false,
      searchQuery: '',

      addChatroom: (title: string) => {
        const newChatroom: Chatroom = {
          id: crypto.randomUUID(),
          title,
          messageCount: 0,
          createdAt: new Date(),
        };
        
        set((state) => ({
          chatrooms: [newChatroom, ...state.chatrooms],
        }));
        
        toast.success('Chatroom created successfully!');
      },

      deleteChatroom: (id: string) => {
        set((state) => ({
          chatrooms: state.chatrooms.filter(room => room.id !== id),
          currentChatroom: state.currentChatroom?.id === id ? null : state.currentChatroom,
          messages: state.messages.filter(msg => msg.chatroomId !== id),
        }));
        
        toast.success('Chatroom deleted successfully!');
      },

      setCurrentChatroom: (chatroom: Chatroom | null) => {
        set({ currentChatroom: chatroom });
        
        if (chatroom) {
          const messages = get().messages.filter(msg => msg.chatroomId === chatroom.id);
          set({ messages });
        }
      },

      sendMessage: (content: string, image?: string) => {
        const { currentChatroom, messages } = get();
        if (!currentChatroom) return;

        const userMessage: Message = {
          id: crypto.randomUUID(),
          content,
          sender: 'user',
          timestamp: new Date(),
          image,
          chatroomId: currentChatroom.id,
        };

        set({ messages: [...messages, userMessage] });

        // Update chatroom with last message
        set((state) => ({
          chatrooms: state.chatrooms.map(room =>
            room.id === currentChatroom.id
              ? {
                  ...room,
                  lastMessage: content,
                  lastMessageTime: new Date(),
                  messageCount: room.messageCount + 1,
                }
              : room
          ),
        }));

        // Simulate AI typing
        set({ isTyping: true });
        
        // Throttle AI response (2-4 seconds)
        const delay = Math.random() * 2000 + 2000;
        
        setTimeout(() => {
          const aiMessage: Message = {
            id: crypto.randomUUID(),
            content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
            sender: 'ai',
            timestamp: new Date(),
            chatroomId: currentChatroom.id,
          };

          set((state) => ({
            messages: [...state.messages, aiMessage],
            isTyping: false,
          }));

          // Update chatroom with AI message
          set((state) => ({
            chatrooms: state.chatrooms.map(room =>
              room.id === currentChatroom.id
                ? {
                    ...room,
                    lastMessage: aiMessage.content,
                    lastMessageTime: new Date(),
                    messageCount: room.messageCount + 1,
                  }
                : room
            ),
          }));
        }, delay);
      },

      loadOlderMessages: (chatroomId: string) => {
        // Simulate loading older messages
        const mockMessages: Message[] = Array.from({ length: 10 }, (_, i) => ({
          id: crypto.randomUUID(),
          content: `Mock message ${i + 1}`,
          sender: i % 2 === 0 ? 'user' : 'ai',
          timestamp: new Date(Date.now() - (i + 1) * 3600000),
          chatroomId,
        }));

        set((state) => ({
          messages: [...mockMessages, ...state.messages],
        }));
      },

      setSearchQuery: (query: string) => set({ searchQuery: query }),

      setTyping: (typing: boolean) => set({ isTyping: typing }),
    }),
    {
      name: 'chat-storage',
      partialize: (state) => ({ 
        chatrooms: state.chatrooms,
        messages: state.messages,
      }),
    }
  )
);