const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getChatHistory,
  getChatSession,
  deleteChatSession,
} = require('../controllers/chatController');
const { optionalProtect } = require('../middleware/authMiddleware');
const { chatLimiter } = require('../middleware/rateLimiter');

router.post('/message', optionalProtect, chatLimiter, sendMessage);
router.get('/history', optionalProtect, getChatHistory);
router.get('/session/:sessionId', getChatSession);
router.delete('/session/:sessionId', deleteChatSession);

module.exports = router;
