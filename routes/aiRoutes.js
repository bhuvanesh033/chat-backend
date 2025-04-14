// routes/aiRoutes.js
const express = require('express');
const router = express.Router();
const { askAI } = require('../controllers/aiController');
const { smartSuggestions } = require('../controllers/aiController');

router.post('/ask', askAI);
router.post('/smart-suggestions', smartSuggestions);

module.exports = router;
