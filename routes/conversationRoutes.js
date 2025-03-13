// const express = require('express');
// const router = express.Router();
// const { createIndividualChat, createGroupChat } = require('../controllers/conversationController');
// const { authenticateJWT } = require('../middlewares/authMiddleware');
// const { getUserConversations } = require('../controllers/conversationController');

// // Route to create an individual chat
// router.post('/individual', authenticateJWT, createIndividualChat);

// // Route to create a group chat
// router.post('/group', authenticateJWT, createGroupChat);
// router.get('/user-conversations', authenticateJWT, getUserConversations);

// module.exports = router;

const express = require('express');
const router = express.Router();
const {
  createIndividualChat,
  createGroupChat,
  getIndividualChats,
  getGroupChats,
  sendMessage,
  getMessagesByConversation,
} = require('../controllers/conversationController');
const { authenticateJWT } = require('../middlewares/authMiddleware');

// Create conversations
router.post('/individual', authenticateJWT, createIndividualChat);
router.post('/group', authenticateJWT, createGroupChat);

// Fetch conversations
router.get('/individual', authenticateJWT, getIndividualChats);
router.get('/group', authenticateJWT, getGroupChats);

// Messages
// router.post('/message', authenticateJWT, sendMessage);
// router.get('/messages/:convo_id', authenticateJWT, getMessagesByConversation);

module.exports = router;
