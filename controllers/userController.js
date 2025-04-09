const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { name, password, description, profile, phone_number } = req.body;
    console.log("Received Data:", req.body);  // Log received data

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

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error in createUser:", error.message);  // Log error
    res.status(400).json({ error: error.message });
  }
};

// Login a user
exports.loginUser = async (req, res) => {
  const { phone_number, password } = req.body;

  try {
    // Check if the user exists with the given phone number
    const user = await User.findOne({ where: { phone_number } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the stored hashed password
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        phone_number: user.phone_number,
      },
      'yourSecretKey',  // Use a secure secret key
      { expiresIn: '24h' }  // Token expiration time
    );

    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
