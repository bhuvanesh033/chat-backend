const express = require('express');
const router = express.Router();
const { createUser } = require('../controllers/userController');
const { validateUser } = require('../middlewares/userValidation');
const { loginUser } = require('../controllers/userController');

router.post('/create', validateUser, createUser);
router.post('/login', loginUser);

module.exports = router;
