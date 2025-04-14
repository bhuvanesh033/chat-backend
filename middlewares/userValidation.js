const { check, validationResult } = require('express-validator');

exports.validateUser = [
    // check('name')
    //     .isLowercase()
    //     .withMessage('Name must be in lowercase'),
    check('password')
        .isLength({ min: 8, max: 12 })
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/)
        .withMessage('Password must be 8-12 chars with at least one letter, one number and one special character'),
    check('description')
        .isLength({ max: 100 })
        .withMessage('Description must not exceed 100 words'),
    check('phone_number')
        .matches(/^[0-9\+]{10,}$/)
        .withMessage('Phone number must be at least 10 digits and contain only numbers and "+"'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }
];

exports.validateImage = (req, res, next) => {
    const file = req.file;
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!file) {
        return res.status(400).json({ errors: [{ msg: 'Profile image is required' }] });
    }

    if (!file.mimetype.startsWith('image/')) {
        return res.status(400).json({ 
            errors: [{ 
                msg: 'Profile must be an image file (JPEG, PNG, GIF, WEBP, etc.)', 
                path: 'profile' 
            }] 
        });
    }

    if (file.size > maxSize) {
        return res.status(400).json({ 
            errors: [{ 
                msg: 'Image size must be less than 5MB', 
                path: 'profile' 
            }] 
        });
    }

    next();
};