import { useCurrentUserContext } from "@/context/UserContext";
import { useGetUserById, useGetChatMessages } from "@/lib/react-query/queriesAndMutation";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import Loader from "../shared/loader";
import EmojiPicker from 'emoji-picker-react';

const scrollbarStyles = {
  scrollbarWidth: "thin",
  scrollbarColor: "#5c5c7b #09090a",
  "&::-webkit-scrollbar": {
    width: "3px",
  },
  "&::-webkit-scrollbar-track": {
    background: "#09090a",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#5c5c7b",
    borderRadius: "50px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    background: "#7878a3",
  },
};

interface Message {
  _id: string;
  message: string;
  sender: string;
  receiver: string;
  time: string;
  read: boolean;
}

interface ChatWindowProps {
  selectedChat: string;
}

const apiUrl = import.meta.env.VITE_API_URL;

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedChat }) => {
  const [chat, setChat] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // State to toggle the emoji picker
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { currentUser } = useCurrentUserContext();
  const { data: selectedUser, isPending: loadingSelectedUser } = useGetUserById(selectedChat);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const { data: chatMessages, isPending: loadingMessages } = useGetChatMessages(currentUser?._id, selectedUser?._id);
  const socketRef = useRef<Socket | null>(null);

  const scrollToBottom = useCallback(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    if (chatMessages) {
      setMessages(chatMessages);
    }
  }, [chatMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (!currentUser) return;

    socketRef.current = io(`${apiUrl}`, {
      transports: ["websocket", "polling"],
    });

    socketRef.current.on("connect", () => {
      socketRef.current?.emit("register", { socketId: socketRef.current.id, userId: currentUser._id });
    });

    socketRef.current.on("chat message", (msg: Message) => {
      setMessages(prevMessages => [...prevMessages, msg]);
    });

    socketRef.current.on("message as read", ({ messageId }: { messageId: string }) => {
      setMessages(prevMessages =>
        prevMessages.map(msg =>
          msg._id === messageId ? { ...msg, read: true } : msg
        )
      );
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [currentUser]);

  const handleChat = useCallback(() => {
    if (chat.trim() === "" || !currentUser || !selectedUser) return;

    const newChat: Message = {
      _id: Date.now().toString(), // This should be replaced with a proper ID from the server
      message: chat,
      sender: currentUser._id,
      receiver: selectedUser._id,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false
    };

    setChat("");
    setMessages(prevMessages => [...prevMessages, newChat]);
    socketRef.current?.emit("chat message", newChat);
  }, [chat, currentUser, selectedUser]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleChat();
    }
  }, [handleChat]);

  const toggleEmojiPicker = useCallback(() => {
    setShowEmojiPicker(prev => !prev); // Toggle the visibility of the emoji picker
  }, []);

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
  const addEmoji = useCallback((emoji) => {
    setChat(chat + emoji.emoji); // Add selected emoji to the chat input
    setShowEmojiPicker(false);
  }, [chat]);

  if (!selectedChat) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        Select a chat to start messaging
      </div>
    );
  }

  if (loadingSelectedUser || loadingMessages) return <Loader />;

  return (
    <div
      className="w-5/6 flex flex-col relative m-auto top-16 rounded"
      style={{ height: "calc(100vh - 4rem)" }}
    >
      <div className="bg-dark-3 p-4 flex items-center rounded">
        <div className="w-12 h-12 rounded-full bg-gray-500 mr-4 overflow-hidden">
          <img src={selectedUser.profilePicture} alt="" className="object-cover w-12 h-12"/>
        </div>
        <h2 className="text-white text-xl font-semibold">{selectedUser.username}</h2>
      </div>
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-dark-2"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        style={scrollbarStyles}
      >
        {messages.map((message) => (
          <div
            key={message._id}
            className={`flex ${
              message.sender === currentUser?._id
                ? "justify-end chat-end"
                : "justify-start chat-start"
            } fade-in `}
          >
            <div className={`max-w-xs p-3 text-wrap`}>
              <div
                className={`chat-bubble text-wrap ${
                  message.sender === currentUser?._id
                    ? "bg-primary-500 text-white"
                    : "bg-off-white text-black"
                }`}
              >
                <span className="text-wrap">{message.message}</span>
              </div>
              <span
                className={`text-xs text-gray-400 block mt-1 ${
                  message.sender === currentUser?._id ? "text-right" : "text-left"
                }`}
              >
                {message.time}
                {message.sender === currentUser?._id && (
                  <span className="ml-2">
                    {message.read ? "Read" : "Sent"}
                  </span>
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-dark-2 p-4">
        <div className="flex items-center bg-dark-4 rounded p-2 relative">
          <button
            className="mr-2 bg-gray-700 text-white rounded-full p-2"
            onClick={toggleEmojiPicker}
          >
            😊
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-12 left-0">
              <EmojiPicker onEmojiClick={addEmoji}/>
            </div>
          )}
          <input
            type="text"
            placeholder="Write your message here..."
            className="flex-1 bg-transparent text-white focus:outline-none text-wrap"
            onChange={(e) => setChat(e.target.value)}
            onKeyDown={handleKeyDown}
            value={chat}
          />
          <button
            className="ml-2 bg-yellow-500 text-dark-1 rounded-full p-2"
            onClick={handleChat}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
