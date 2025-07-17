import React, { useState } from "react";
import {
  Plus,
  Search,
  MessageSquare,
  Trash2,
  Moon,
  Sun,
  LogOut,
} from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { useChatStore } from "../../store/chatStore";
import { useAuthStore } from "../../store/authStore";
import { useAppStore } from "../../store/appStore";
import { useDebounce } from "../../hooks/useDebounce";
import { formatDistanceToNow } from "date-fns";

export const Dashboard: React.FC = () => {
  const [newChatroomTitle, setNewChatroomTitle] = useState("");
  const [showNewChatroomForm, setShowNewChatroomForm] = useState(false);

  const {
    chatrooms,
    searchQuery,
    addChatroom,
    deleteChatroom,
    setCurrentChatroom,
    setSearchQuery,
  } = useChatStore();

  const { logout } = useAuthStore();
  const { darkMode, toggleDarkMode } = useAppStore();

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const filteredChatrooms = chatrooms.filter((room) =>
    room.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

  const handleCreateChatroom = () => {
    if (newChatroomTitle.trim()) {
      addChatroom(newChatroomTitle.trim());
      setNewChatroomTitle("");
      setShowNewChatroomForm(false);
    }
  };

  const handleDeleteChatroom = (e: React.MouseEvent, chatroomId: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this chatroom?")) {
      deleteChatroom(chatroomId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Gemini Chat
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your conversations
            </p>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </Button>

            <Button variant="outline" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Search and Create */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder="Search chatrooms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Button
            onClick={() => setShowNewChatroomForm(true)}
            className="shrink-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* New Chatroom Form */}
        {showNewChatroomForm && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Create New Chatroom
            </h3>
            <div className="flex gap-3">
              <Input
                placeholder="Enter chatroom title..."
                value={newChatroomTitle}
                onChange={(e) => setNewChatroomTitle(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleCreateChatroom()}
                className="flex-1"
              />
              <Button onClick={handleCreateChatroom}>Create</Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowNewChatroomForm(false);
                  setNewChatroomTitle("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Chatrooms List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md">
          {filteredChatrooms.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No chatrooms found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {searchQuery
                  ? "No chatrooms match your search."
                  : "Create your first chatroom to get started."}
              </p>
              {!searchQuery && (
                <Button onClick={() => setShowNewChatroomForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Chatroom
                </Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredChatrooms.map((chatroom) => (
                <div
                  key={chatroom.id}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors group"
                  onClick={() => setCurrentChatroom(chatroom)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                          <MessageSquare className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {chatroom.title}
                          </h3>
                          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>{chatroom.messageCount} messages</span>
                            {chatroom.lastMessageTime && (
                              <>
                                <span>•</span>
                                <span>
                                  {formatDistanceToNow(
                                    chatroom.lastMessageTime,
                                    { addSuffix: true }
                                  )}
                                </span>
                              </>
                            )}
                          </div>
                          {chatroom.lastMessage && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-xs">
                              {chatroom.lastMessage}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleDeleteChatroom(e, chatroom.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
