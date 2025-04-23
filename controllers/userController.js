const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const { name, password, description, phone_number } = req.body;

        let profileUrl = null;

        // Upload profile image to Cloudinary
        if (req.file) {
            const uploadResult = await cloudinary.uploader.upload_stream(
                { resource_type: "image" },
                async (error, result) => {
                    if (error) throw new Error("Cloudinary upload failed");
                    profileUrl = result.secure_url;

                    const hashedPassword = await bcrypt.hash(password, 10);
                    const user = await User.create({
                        name,
                        password: hashedPassword,
                        description,
                        profile: profileUrl,
                        phone_number,
                    });

                    return res.status(201).json({
                        message: "User created successfully",
                        user: {
                            id: user.id,
                            name: user.name,
                            phone_number: user.phone_number,
                            profile: user.profile
                        }
                    });
                }
            );
            uploadResult.end(req.file.buffer); // Send the buffer to Cloudinary
        } else {
            // If no image, create user without profile
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({
                name,
                password: hashedPassword,
                description,
                profile: null,
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
        }
    } catch (error) {
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
                profile: user.profile
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

// In your userController.js or a separate controller
exports.logoutUser = (req, res) => {
    // Invalidate the session or token if needed (you can implement token blacklist if required)
    // For this case, just sending a response to remove the token on the client side.
    res.status(200).json({ message: 'Logout successful' });
};
