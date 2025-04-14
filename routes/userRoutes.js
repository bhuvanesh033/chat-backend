const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createUser, loginUser } = require('../controllers/userController');
const { validateUser, validateImage } = require('../middlewares/userValidation');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

router.post('/create', upload.single('profile'), validateImage, validateUser, createUser);
router.post('/login', loginUser);

module.exports = router;