# Gemini Frontend Clone

A fully functional, responsive, and visually appealing frontend for a Gemini-style conversational AI chat application. Built with React, TypeScript, Tailwind CSS, and Zustand for state management.

## 🚀 Live Demo

[View Live Application](https://gemini-ai-clonefk.netlify.app/)

## ✨ Features

### Authentication

- **OTP-based Login/Signup** with country code selection
- **Country API Integration** using restcountries.com
- **Form Validation** with React Hook Form + Zod
- **Simulated OTP** verification (use `123456` for demo)

### Dashboard

- **Chatroom Management** - Create, delete, and organize chatrooms
- **Search Functionality** with debounced input
- **Toast Notifications** for user feedback
- **Responsive Design** for all screen sizes

### Chat Interface

- **Real-time Messaging** with simulated AI responses
- **Typing Indicators** - "Gemini is typing..." animation
- **Message Timestamps** with relative time formatting
- **Image Upload Support** with preview and base64 encoding
- **Copy to Clipboard** functionality on message hover
- **Infinite Scroll** for message history with pagination
- **Auto-scroll** to latest messages

### UX Features

- **Dark Mode Toggle** with persistent preference
- **Mobile Responsive** design with touch-friendly interactions
- **Loading Skeletons** for better perceived performance
- **Keyboard Accessibility** throughout the application
- **Local Storage** for data persistence
- **Throttled AI Responses** to simulate realistic conversation

## 🛠 Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **State Management**: Zustand with persistence
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Date Formatting**: date-fns
- **Build Tool**: Vite

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn
- Modern web browser

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/gemini-frontend-clone.git
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

### Environment Setup

No environment variables required - the app uses:

- REST Countries API for country data
- Local storage for data persistence
- Simulated backends for authentication and AI responses

## 🏗 Project Structure

```
src/
├── components/
│   ├── auth/
│   │   └── AuthForm.tsx          # OTP login/signup flow
│   ├── chat/
│   │   └── ChatInterface.tsx     # Main chat interface
│   ├── dashboard/
│   │   └── Dashboard.tsx         # Chatroom management
│   ├── layout/
│   │   └── Layout.tsx            # App layout wrapper
│   └── ui/                       # Reusable UI components
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Select.tsx
│       └── LoadingSkeleton.tsx
├── hooks/
│   ├── useCountries.ts           # Country data fetching
│   └── useDebounce.ts            # Debounced input handling
├── store/
│   ├── authStore.ts              # Authentication state
│   ├── chatStore.ts              # Chat and chatroom state
│   └── appStore.ts               # App-wide settings
├── types/
│   └── index.ts                  # TypeScript type definitions
├── App.tsx                       # Main app component
├── main.tsx                      # App entry point
└── index.css                     # Global styles
```

## 🔧 Key Implementation Details

### Form Validation

**Implementation**: React Hook Form + Zod schemas

- **Location**: `src/components/auth/AuthForm.tsx`
- **Features**: Real-time validation, type-safe schemas, error handling
- **Code Example**:

```typescript
const loginSchema = z.object({
  countryCode: z.string().min(1, "Please select a country"),
  phone: z.string().min(6, "Phone number must be at least 6 digits"),
});

const loginForm = useForm<LoginFormData>({
  resolver: zodResolver(loginSchema),
  mode: "onChange", // Real-time validation
});
```

### Throttling AI Responses

**Implementation**: setTimeout with random delays

- **Location**: `src/store/chatStore.ts` in `sendMessage` function
- **Logic**: 2-4 second random delay to simulate AI thinking
- **Code Example**:

```typescript
// Throttle AI response (2-4 seconds)
const delay = Math.random() * 2000 + 2000;

setTimeout(() => {
  const aiMessage: Message = {
    id: crypto.randomUUID(),
    content: aiResponses[Math.floor(Math.random() * aiResponses.length)],
    sender: "ai",
    timestamp: new Date(),
    chatroomId: currentChatroom.id,
  };
  // Update state with AI message
}, delay);
```

### Infinite Scroll & Pagination

**Implementation**: Scroll event listener with mock data loading

- **Location**: `src/components/chat/ChatInterface.tsx`
- **Features**: Loads 10 older messages when scrolled to top
- **Code Example**:

```typescript
const handleScroll = () => {
  const container = messagesContainerRef.current;
  if (container && container.scrollTop === 0 && !isLoadingOlder) {
    setIsLoadingOlder(true);

    setTimeout(() => {
      if (currentChatroom) {
        loadOlderMessages(currentChatroom.id); // Loads 10 mock messages
      }
      setIsLoadingOlder(false);
    }, 1000);
  }
};
```

### Debounced Search

**Implementation**: Custom useDebounce hook

- **Location**: `src/hooks/useDebounce.ts`
- **Usage**: `src/components/dashboard/Dashboard.tsx`
- **Delay**: 300ms to reduce API calls and improve performance
- **Code Example**:

```typescript
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};
```

## 🎯 State Management Architecture

### Zustand Stores

- **authStore.ts**: User authentication, OTP verification, login/logout
- **chatStore.ts**: Messages, chatrooms, AI responses, search functionality
- **appStore.ts**: Dark mode, global app settings

### Persistence

- Uses Zustand's `persist` middleware
- Stores data in localStorage
- Selective persistence (only essential data)

## 🎨 Design System

### Color Palette

- **Primary**: Blue (#3b82f6) for main actions
- **Secondary**: Teal (#14b8a6) for secondary elements
- **Accent**: Orange (#f97316) for highlights
- **Success**: Green (#22c55e) for positive feedback
- **Warning**: Amber (#f59e0b) for caution
- **Error**: Red (#ef4444) for errors

### Typography

- **Font**: Inter for clean, modern readability
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)
- **Scale**: Consistent sizing with proper line heights

### Responsive Breakpoints

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 📱 Mobile Responsiveness

- **Mobile-first** approach with progressive enhancement
- **Touch-friendly** interactions (44px minimum touch targets)
- **Adaptive layouts** that work on all screen sizes
- **Optimized typography** and spacing for mobile devices

## ♿ Accessibility Features

- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **ARIA Labels**: Proper labeling for screen readers
- **Focus Management**: Clear focus indicators and logical tab order
- **Color Contrast**: WCAG AA compliant contrast ratios
- **Semantic HTML**: Proper heading hierarchy and landmarks

## 🧪 Testing Instructions

### Authentication Flow

1. Select a country from the dropdown
2. Enter a phone number (minimum 6 digits)
3. Click "Send OTP"
4. Enter OTP: `123456`
5. Click "Verify OTP"

### Chat Functionality

1. Create a new chatroom from the dashboard
2. Send messages and observe AI responses (2-4 second delay)
3. Upload images using the paperclip icon
4. Hover over messages to copy them
5. Scroll to top to load older messages

### Search & Filtering

1. Use the search bar on the dashboard
2. Type to filter chatrooms (300ms debounce)
3. Clear search to see all chatrooms
