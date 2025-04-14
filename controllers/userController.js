const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { name, password, description, phone_number } = req.body;
        const profile = req.file ? req.file.filename : null;

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user
        const user = await User.create({
            name,
            password: hashedPassword,
            description,
            profile,
            phone_number,
        });

        res.status(201).json({ 
            message: "User created successfully", 
            user: {
                id: user.id,
                name: user.name,
                phone_number: user.phone_number,
                profile: user.profile
            } 
        });
    } catch (error) {
        // Clean up uploaded file if user creation fails
        if (req.file) {
            fs.unlinkSync(path.join('uploads', req.file.filename));
        }
        console.error("Error in createUser:", error.message);
        res.status(400).json({ error: error.message });
    }
};

// Login a user
exports.loginUser = async (req, res) => {
    const { phone_number, password } = req.body;

    try {
        const user = await User.findOne({ where: { phone_number } });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password);

        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const token = jwt.sign(
            {
                id: user.id,
                name: user.name,
                phone_number: user.phone_number,
            },
            process.env.JWT_SECRET || 'yourSecretKey',
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                name: user.name,
                phone_number: user.phone_number,
                profile: user.profile
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
};