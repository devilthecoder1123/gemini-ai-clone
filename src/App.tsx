import { Toaster } from "react-hot-toast";
import { Layout } from "./components/layout/Layout";
import { AuthForm } from "./components/auth/AuthForm";
import { Dashboard } from "./components/dashboard/Dashboard";
import { ChatInterface } from "./components/chat/ChatInterface";
import { useAuthStore } from "./store/authStore";
import { useChatStore } from "./store/chatStore";

function App() {
  const { user } = useAuthStore();
  const { currentChatroom } = useChatStore();

  const renderContent = () => {
    if (!user?.isAuthenticated) {
      return <AuthForm />;
    }

    if (currentChatroom) {
      return <ChatInterface />;
    }

    return <Dashboard />;
  };

  return (
    <Layout>
      {renderContent()}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "var(--toast-bg)",
            color: "var(--toast-color)",
          },
        }}
      />
    </Layout>
  );
}

export default App;
