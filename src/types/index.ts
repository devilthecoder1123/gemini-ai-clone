export interface Country {
  name: {
    common: string;
  };
  cca2: string;
  idd: {
    root: string;
    suffixes: string[];
  };
  flag: string;
}

export interface User {
  id: string;
  phone: string;
  countryCode: string;
  isAuthenticated: boolean;
}

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  image?: string;
  chatroomId: string;
}

export interface Chatroom {
  id: string;
  title: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  messageCount: number;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isOtpSent: boolean;
  login: (phone: string, countryCode: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export interface ChatState {
  chatrooms: Chatroom[];
  currentChatroom: Chatroom | null;
  messages: Message[];
  isTyping: boolean;
  searchQuery: string;
  addChatroom: (title: string) => void;
  deleteChatroom: (id: string) => void;
  setCurrentChatroom: (chatroom: Chatroom | null) => void;
  sendMessage: (content: string, image?: string) => void;
  loadOlderMessages: (chatroomId: string) => void;
  setSearchQuery: (query: string) => void;
  setTyping: (typing: boolean) => void;
}

export interface AppState {
  darkMode: boolean;
  toggleDarkMode: () => void;
}