const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createUser, loginUser } = require('../controllers/userController');
const { validateUser } = require('../middlewares/userValidation');

// Use multer memory storage (no file saved to disk)
const storage = multer.memoryStorage();
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

router.post('/create', upload.single('profile'), validateUser, createUser);
router.post('/login', loginUser);

module.exports = router;
