const Chat = require('../models/Chat');
const { getGroqChatResponse } = require('../services/groqService');

// @desc    Send a message to ReliefPulse AI & persist history in MongoDB
// @route   POST /api/chat/message
// @access  Public (supports optional authenticated user or guest sessionId)
const sendMessage = async (req, res, next) => {
  try {
    let message = req.body.message;
    if (!message && req.body.query) message = req.body.query;
    if (!message && req.body.text) message = req.body.text;
    if (!message && Array.isArray(req.body.messages) && req.body.messages.length > 0) {
      const userMsgs = req.body.messages.filter((m) => m && m.role === 'user');
      const lastUser = userMsgs.length > 0 ? userMsgs[userMsgs.length - 1] : req.body.messages[req.body.messages.length - 1];
      message = lastUser?.content;
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message content cannot be empty.',
      });
    }

    const currentSessionId = req.body.sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const userId = req.user ? req.user._id : null;
    const language = req.body.language || req.body.lang || 'en';

    // Find existing chat session or create a new one
    let chat = await Chat.findOne({
      $or: [
        ...(userId ? [{ userId, sessionId: currentSessionId }] : []),
        { sessionId: currentSessionId },
      ],
    });

    if (!chat) {
      // Create new chat session
      chat = new Chat({
        userId,
        sessionId: currentSessionId,
        title: message.trim().substring(0, 45) + (message.length > 45 ? '...' : ''),
        messages: [],
      });
    } else if (userId && !chat.userId) {
      // Link guest session to user if now logged in
      chat.userId = userId;
    }

    // Append user's message
    const userMessageObj = {
      role: 'user',
      content: message.trim(),
      timestamp: new Date(),
    };
    chat.messages.push(userMessageObj);

    // Extract recent conversation history (last 10 messages for context)
    const contextMessages = chat.messages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    // Call Groq / Dynamic AI service with LLaMA and contextual engine
    const aiResult = await getGroqChatResponse(contextMessages, { language });

    // Append AI assistant response to conversation
    const assistantMessageObj = {
      role: 'assistant',
      content: aiResult.content,
      timestamp: new Date(),
    };
    chat.messages.push(assistantMessageObj);

    // Update title if it was a default placeholder
    if (chat.messages.length <= 2 && chat.title === 'Disaster Assistance Chat') {
      chat.title = message.trim().substring(0, 45) + (message.length > 45 ? '...' : '');
    }

    await chat.save();

    res.status(200).json({
      success: true,
      sessionId: chat.sessionId,
      chatId: chat._id,
      title: chat.title,
      reply: assistantMessageObj,
      message: assistantMessageObj.content,
      content: assistantMessageObj.content,
      data: assistantMessageObj,
      model: aiResult.model,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get chat sessions history (list of past conversations)
// @route   GET /api/chat/history
// @access  Public (filters by logged-in user or guest query sessionId)
const getChatHistory = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;
    const { sessionId } = req.query;

    let query = {};
    if (userId) {
      query = { userId };
    } else if (sessionId) {
      query = { sessionId };
    } else {
      return res.status(200).json({
        success: true,
        sessions: [],
      });
    }

    const chats = await Chat.find(query)
      .select('sessionId title createdAt updatedAt messages')
      .sort({ updatedAt: -1 })
      .limit(30);

    const formattedSessions = chats.map((c) => ({
      id: c._id,
      sessionId: c.sessionId,
      title: c.title,
      messageCount: c.messages.length,
      lastMessage: c.messages[c.messages.length - 1]?.content?.substring(0, 60) || '',
      updatedAt: c.updatedAt,
    }));

    res.status(200).json({
      success: true,
      sessions: formattedSessions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get full message thread for a specific session
// @route   GET /api/chat/session/:sessionId
// @access  Public
const getChatSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const chat = await Chat.findOne({ sessionId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found',
      });
    }

    res.status(200).json({
      success: true,
      chat: {
        id: chat._id,
        sessionId: chat.sessionId,
        title: chat.title,
        messages: chat.messages,
        createdAt: chat.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear / delete a chat session
// @route   DELETE /api/chat/session/:sessionId
// @access  Public
const deleteChatSession = async (req, res, next) => {
  try {
    const { sessionId } = req.params;

    const chat = await Chat.findOneAndDelete({ sessionId });
    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Chat session deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
  getChatSession,
  deleteChatSession,
};
