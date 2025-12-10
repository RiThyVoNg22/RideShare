import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from './ToastProvider';
import { chatAPI } from '../services/api';
import { X, Send, MessageSquare, User } from 'lucide-react';

interface Message {
  _id?: string;
  senderId: string;
  senderName: string;
  receiverId: string;
  message: string;
  read: boolean;
  timestamp: string | Date;
}

interface Chat {
  _id: string;
  bookingId: string;
  participants: any[];
  vehicleName: string;
  lastMessage?: string;
  lastMessageTime?: string | Date;
  messages: Message[];
}

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  chat: Chat | null;
  onMessageSent?: () => void;
}

const ChatModal: React.FC<ChatModalProps> = ({ isOpen, onClose, chat, onMessageSent }) => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (isOpen && chat) {
      // Set chatId immediately if available
      if (chat._id) {
        const id = chat._id?.toString ? chat._id.toString() : chat._id;
        chatIdRef.current = id;
      }
      loadMessages();
    } else if (!isOpen) {
      // Reset when closed
      setMessages([]);
      setNewMessage('');
      chatIdRef.current = null;
    }
  }, [isOpen, chat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadMessages = async () => {
    if (!chat) return;
    
    try {
      setLoading(true);
      
      // Normalize chat ID - handle both string and ObjectId object
      const chatId = chat._id?.toString ? chat._id.toString() : chat._id;
      const bookingId = chat.bookingId?.toString ? chat.bookingId.toString() : chat.bookingId;
      
      let response;
      
      // Always try bookingId first if available (more reliable)
      if (bookingId) {
        try {
          response = await chatAPI.getChatByBooking(bookingId);
          // If successful, update chatIdRef
          if (response.success && response.chat?._id) {
            const loadedChatId = response.chat._id?.toString ? response.chat._id.toString() : response.chat._id;
            chatIdRef.current = loadedChatId;
          }
        } catch (bookingError: any) {
          // If bookingId fails, try chatId
          if (chatId && typeof chatId === 'string' && /^[0-9a-fA-F]{24}$/.test(chatId)) {
            response = await chatAPI.getChatById(chatId);
          } else {
            throw bookingError;
          }
        }
      } else if (chatId && typeof chatId === 'string' && /^[0-9a-fA-F]{24}$/.test(chatId)) {
        // Only use chatId if it's valid
        response = await chatAPI.getChatById(chatId);
      } else {
        throw new Error('Chat ID or Booking ID is required');
      }
      
      if (response.success && response.chat) {
        setMessages(response.chat.messages || []);
        const loadedChatId = response.chat._id?.toString ? response.chat._id.toString() : response.chat._id;
        if (loadedChatId) {
          chatIdRef.current = loadedChatId;
        }
        
        // Mark messages as read after successfully loading
        if (loadedChatId) {
          chatAPI.markAsRead(loadedChatId).catch(console.error);
        }
      } else {
        throw new Error('Failed to load chat');
      }
    } catch (error: any) {
      console.error('Error loading messages:', error);
      // Show user-friendly error
      const errorMsg = error.message || 'Failed to load messages';
      if (!errorMsg.includes('404') && !errorMsg.includes('Not Found')) {
        showToast(errorMsg, 'error');
      }
      // Still show empty state, don't block the UI
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;
    
    // Ensure we have a valid chatId
    if (!chatIdRef.current) {
      // Try to reload messages to get chatId
      await loadMessages();
      if (!chatIdRef.current) {
        showToast('Chat not ready. Please try again.', 'error');
        return;
      }
    }

    const messageText = newMessage.trim();
    setNewMessage('');
    setSending(true);

    try {
      const chatId = chatIdRef.current.toString();
      const response = await chatAPI.sendMessage(chatId, messageText);
      if (response.success) {
        // Add new message to list
        const newMsg: Message = {
          senderId: currentUser?._id || '',
          senderName: `${currentUser?.firstName} ${currentUser?.lastName}`,
          receiverId: '',
          message: messageText,
          read: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, newMsg]);
        
        // Refresh messages to get server timestamp
        setTimeout(() => {
          loadMessages();
          if (onMessageSent) onMessageSent();
        }, 500);
      }
    } catch (error: any) {
      showToast(error.message || 'Failed to send message', 'error');
      setNewMessage(messageText); // Restore message on error
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const getOtherParticipant = () => {
    if (!chat || !currentUser) return null;
    return chat.participants?.find(
      (p: any) => p._id?.toString() !== currentUser._id?.toString() || 
                 p.toString() !== currentUser._id?.toString()
    );
  };

  if (!isOpen || !chat) return null;

  const otherParticipant = getOtherParticipant();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-orange rounded-full flex items-center justify-center text-white font-bold">
              {chat.vehicleName?.charAt(0) || 'V'}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{chat.vehicleName}</h3>
              <p className="text-sm text-gray-500">
                {otherParticipant 
                  ? `${otherParticipant.firstName || ''} ${otherParticipant.lastName || ''}`.trim() || 'Other user'
                  : 'Chat'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-primary-orange border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading messages...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isOwn = msg.senderId?.toString() === currentUser?._id?.toString() ||
                           msg.senderId === currentUser?._id;
              return (
                <div
                  key={idx}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      isOwn
                        ? 'bg-primary-orange text-white'
                        : 'bg-white text-gray-900 border border-gray-200'
                    }`}
                  >
                    {!isOwn && (
                      <p className="text-xs font-semibold mb-1 opacity-75">
                        {msg.senderName}
                      </p>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{msg.message}</p>
                    <p className={`text-xs mt-1 ${isOwn ? 'text-white opacity-75' : 'text-gray-500'}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white">
          <div className="flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-orange"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="btn btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatModal;

