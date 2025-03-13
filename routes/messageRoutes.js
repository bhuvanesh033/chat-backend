const express = require('express');
const router = express.Router();
const { sendMessage } = require('../controllers/messageController');
const { authenticateJWT } = require('../middlewares/authMiddleware');
const { getMessagesByConversation } = require('../controllers/messageController');

// Route to send a message
router.post('/send', authenticateJWT, sendMessage);
router.get('/getMessages/:convo_id', authenticateJWT, getMessagesByConversation);





module.exports = router;
