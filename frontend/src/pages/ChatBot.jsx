import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Send, 
  Loader2, 
  MessageSquare, 
  Bot,
  User,
  Mic,
  MicOff,
  Paperclip,
  X,
  Sparkles,
  ChevronLeft,
  Clock
} from 'lucide-react';
import toast from 'react-hot-toast';
import conversationService from '../services/conversation.service';
import { AppLayout } from '../components/Layout';
import { Button, IconButton } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import useAuthStore from '../store/authStore';

// =============================================================================
// MESSAGE BUBBLE COMPONENT
// =============================================================================
const MessageBubble = ({ message, isUser }) => {
  const { user } = useAuthStore();

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''} animate-fade-in`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <Avatar name={user?.name} size="sm" />
        ) : (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <Bot className="w-4 h-4 text-white" />
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col gap-1 max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`
            px-4 py-3 rounded-2xl text-sm leading-relaxed
            ${isUser 
              ? 'bg-primary-600 text-white rounded-br-md' 
              : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-bl-md'
            }
          `}
        >
          {/* Image preview if exists */}
          {message.imagePreview && (
            <img 
              src={message.imagePreview} 
              alt="Uploaded" 
              className="max-w-full rounded-lg mb-2 max-h-48 object-cover"
            />
          )}
          
          {/* Message text with formatting */}
          <div className="whitespace-pre-wrap">
            {message.content}
          </div>
        </div>

        {/* Timestamp */}
        <span className={`text-xs text-neutral-400 ${isUser ? 'text-right' : 'text-left'}`}>
          {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }) : ''}
        </span>
      </div>
    </div>
  );
};

// =============================================================================
// TYPING INDICATOR
// =============================================================================
const TypingIndicator = () => (
  <div className="flex gap-3 animate-fade-in">
    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0">
      <Bot className="w-4 h-4 text-white" />
    </div>
    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl rounded-bl-md px-4 py-3">
      <div className="flex gap-1">
        <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  </div>
);

// =============================================================================
// WELCOME MESSAGE
// =============================================================================
const WelcomeMessage = () => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mb-4">
      <Sparkles className="w-8 h-8 text-white" />
    </div>
    <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
      KrishiBandhu AI Assistant
    </h2>
    <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mb-6">
      Ask me anything about farming, crops, weather, government schemes, or agricultural practices. I'm here to help!
    </p>
    <div className="flex flex-wrap justify-center gap-2">
      {['Crop recommendations', 'Weather forecast', 'Pest control', 'Government schemes'].map((suggestion) => (
        <span 
          key={suggestion} 
          className="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full text-xs text-neutral-600 dark:text-neutral-400"
        >
          {suggestion}
        </span>
      ))}
    </div>
  </div>
);

// =============================================================================
// CHAT INPUT COMPONENT
// =============================================================================
const ChatInput = ({ 
  value, 
  onChange, 
  onSend, 
  disabled,
  onVoiceClick,
  isListening,
  imagePreview,
  onImageSelect,
  onImageRemove
}) => {
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image must be less than 5MB');
        return;
      }
      onImageSelect(file);
    }
  };

  return (
    <div className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 p-4">
      {/* Image Preview */}
      {imagePreview && (
        <div className="mb-3 relative inline-block">
          <img 
            src={imagePreview} 
            alt="Upload preview" 
            className="h-20 rounded-xl object-cover"
          />
          <button
            onClick={onImageRemove}
            className="absolute -top-2 -right-2 w-6 h-6 bg-neutral-900 dark:bg-white rounded-full flex items-center justify-center"
          >
            <X className="w-3 h-3 text-white dark:text-neutral-900" />
          </button>
        </div>
      )}

      {/* Input Container */}
      <div className="flex items-end gap-2">
        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {/* Attachment Button */}
        <IconButton
          icon={Paperclip}
          onClick={() => fileInputRef.current?.click()}
          className="flex-shrink-0"
        />

        {/* Text Input */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            disabled={disabled}
            rows={1}
            className="
              w-full px-4 py-3 pr-12
              bg-neutral-100 dark:bg-neutral-800
              border-0 rounded-2xl
              text-sm text-neutral-900 dark:text-neutral-100
              placeholder:text-neutral-400 dark:placeholder:text-neutral-500
              focus:outline-none focus:ring-2 focus:ring-primary-500/20
              resize-none
              disabled:opacity-50
              min-h-[48px] max-h-32
            "
            style={{ height: 'auto' }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
            }}
          />
        </div>

        {/* Voice Button */}
        <IconButton
          icon={isListening ? MicOff : Mic}
          onClick={onVoiceClick}
          className={`flex-shrink-0 ${isListening ? 'text-red-500 bg-red-50 dark:bg-red-900/20' : ''}`}
        />

        {/* Send Button */}
        <Button
          onClick={onSend}
          disabled={disabled || (!value.trim() && !imagePreview)}
          size="icon"
          className="flex-shrink-0 w-12 h-12 rounded-2xl"
        >
          {disabled ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </Button>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN CHAT BOT COMPONENT
// =============================================================================
const ChatBot = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  
  const resumeData = location.state?.resumeConversation || null;

  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState(null);
  const [conversationTitle, setConversationTitle] = useState('New Chat');
  const [isInitializing, setIsInitializing] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isListening, setIsListening] = useState(false);
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize conversation
  useEffect(() => {
    const init = async () => {
      try {
        if (resumeData) {
          const response = await conversationService.resumeConversation(resumeData.id);
          if (response.success) {
            setConversationId(response.conversation.id);
            setConversationTitle(response.conversation.title);
            setMessages(response.conversation.messages.map(msg => ({
              role: msg.role,
              content: msg.content,
              timestamp: msg.timestamp
            })));
          }
        } else {
          const response = await conversationService.createConversation();
          if (response.success) {
            setConversationId(response.conversation.id);
            setMessages([{
              role: 'assistant',
              content: response.conversation.welcomeMessage || 
                `Namaste ${user?.name || ''}! I am your KrishiBandhu AI Assistant. How can I help you with your farming today?`,
              timestamp: new Date()
            }]);
          }
        }
      } catch (error) {
        console.error('Failed to initialize chat:', error);
        toast.error('Failed to start chat');
      } finally {
        setIsInitializing(false);
      }
    };

    init();
  }, []);

  // Handle send message
  const handleSendMessage = async () => {
    const text = inputMessage.trim();
    if (!text && !selectedImage) return;
    if (!conversationId) {
      toast.error('Chat not initialized');
      return;
    }

    const userMessage = {
      role: 'user',
      content: text || 'Image sent for analysis',
      timestamp: new Date(),
      imagePreview: imagePreview
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    setSelectedImage(null);
    setImagePreview(null);

    try {
      const response = await conversationService.sendMessage(conversationId, text);
      
      if (response.success) {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: response.response,
          timestamp: new Date()
        }]);
        
        if (response.conversation?.title) {
          setConversationTitle(response.conversation.title);
        }
      }
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to get response');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image selection
  const handleImageSelect = (file) => {
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  // Handle voice input
  const handleVoiceClick = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setIsListening(!isListening);
      toast.success(isListening ? 'Voice input stopped' : 'Listening...');
    } else {
      toast.error('Voice input not supported in this browser');
    }
  };

  return (
    <AppLayout>
      <div className="h-[calc(100vh-7rem)] flex flex-col bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between px-4 lg:px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="lg:hidden p-2 rounded-xl text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-neutral-900 dark:text-white">
                {conversationTitle || 'KrishiBandhu AI'}
              </h2>
              <p className="text-xs text-primary-600 dark:text-primary-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-primary-500 rounded-full" />
                Online
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <IconButton
              icon={Clock}
              onClick={() => navigate('/history')}
              className="hidden sm:flex"
            />
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 lg:px-6 py-6">
          {isInitializing ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-primary-500 mx-auto mb-3" />
                <p className="text-sm text-neutral-500">Starting conversation...</p>
              </div>
            </div>
          ) : messages.length === 0 ? (
            <WelcomeMessage />
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              {messages.map((message, index) => (
                <MessageBubble
                  key={index}
                  message={message}
                  isUser={message.role === 'user'}
                />
              ))}
              {isLoading && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <ChatInput
          value={inputMessage}
          onChange={setInputMessage}
          onSend={handleSendMessage}
          disabled={isLoading || isInitializing}
          onVoiceClick={handleVoiceClick}
          isListening={isListening}
          imagePreview={imagePreview}
          onImageSelect={handleImageSelect}
          onImageRemove={() => {
            setSelectedImage(null);
            setImagePreview(null);
          }}
        />
      </div>
    </AppLayout>
  );
};

export default ChatBot;
