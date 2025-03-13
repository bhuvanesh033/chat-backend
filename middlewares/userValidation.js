const { check, validationResult } = require('express-validator');

exports.validateUser = [
    check('name').isLowercase().withMessage('Name must be in lowercase'),
    check('password')
        .isLength({ min: 8, max: 12 })
        .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])/)
        .withMessage('Password must be alphanumeric with at least one special character'),
    check('description')
        .isLength({ max: 100 })
        .withMessage('Description must not exceed 100 words'),
    check('profile')
        .matches(/\.(jpg)$/i)
        .withMessage('Profile must be a jpg image'),
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
