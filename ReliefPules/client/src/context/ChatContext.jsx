import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { chatService } from '../services/chatService';

const ChatContext = createContext();

const WELCOME_MESSAGE = {
  role: 'assistant',
  content: `👋 **Hello, I am ReliefPulse AI — your emergency disaster assistant.**

I can provide immediate, life-saving guidance for:
- 🌊 **Floods & Rising Water Survival**
- 🌀 **Cyclone & Severe Weather Protocols**
- 🏥 **Emergency First Aid Instructions**
- 🏠 **Safe Shelter Geolocation & Relief Supplies**
- 🚨 **SOS Prioritization & Evacuation Guidance**

*How can I assist you or your family right now?*`,
  timestamp: new Date(),
};

export const ChatProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(() => {
    return sessionStorage.getItem('reliefpulse_chat_session') || `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  });

  const [messages, setMessages] = useState([WELCOME_MESSAGE]);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    sessionStorage.setItem('reliefpulse_chat_session', sessionId);
  }, [sessionId]);

  // Load chat history sessions list
  const loadSessions = useCallback(async () => {
    try {
      const data = await chatService.getChatHistory(sessionId);
      if (data.sessions) {
        setSessions(data.sessions);
      }
    } catch (err) {
      console.warn('Could not load chat history sessions:', err.message);
    }
  }, [sessionId]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Send message to Groq AI
  const sendMessage = async (userText) => {
    if (!userText.trim()) return;

    const userMessage = {
      role: 'user',
      content: userText.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const data = await chatService.sendMessage(userText, sessionId);
      const assistantMessage = {
        role: 'assistant',
        content: data.reply ? data.reply.content : data.message,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      loadSessions();
    } catch (err) {
      const errorMessage = {
        role: 'assistant',
        content: `⚠️ **Emergency Notice**: Unable to reach AI server right now (${err.message}). If you are in immediate danger, please dial **112 (All Emergencies)** or **1070 (Disaster Helpline)** immediately.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Start a fresh chat session
  const startNewChat = () => {
    const newSession = `session_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    setSessionId(newSession);
    setMessages([WELCOME_MESSAGE]);
    setError(null);
  };

  // Switch to a past chat session
  const selectSession = async (targetSessionId) => {
    if (targetSessionId === sessionId) return;
    setIsLoading(true);
    try {
      const data = await chatService.getChatSession(targetSessionId);
      if (data.chat && data.chat.messages) {
        setSessionId(targetSessionId);
        setMessages(data.chat.messages.length > 0 ? data.chat.messages : [WELCOME_MESSAGE]);
      }
    } catch (err) {
      setError('Failed to load past session: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a chat session
  const deleteSession = async (targetSessionId) => {
    try {
      await chatService.deleteChatSession(targetSessionId);
      setSessions((prev) => prev.filter((s) => s.sessionId !== targetSessionId));
      if (targetSessionId === sessionId) {
        startNewChat();
      }
    } catch (err) {
      setError('Could not delete session: ' + err.message);
    }
  };

  // Clear current active conversation
  const clearCurrentChat = () => {
    setMessages([WELCOME_MESSAGE]);
  };

  return (
    <ChatContext.Provider
      value={{
        sessionId,
        messages,
        sessions,
        isLoading,
        error,
        sendMessage,
        startNewChat,
        selectSession,
        deleteSession,
        clearCurrentChat,
        loadSessions,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error('useChat must be used within ChatProvider');
  return context;
};
