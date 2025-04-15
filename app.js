const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require("dotenv").config();

const sequelize = require('./config/database');

// Import models
const User = require('./models/user');
const Conversation = require('./models/conversation');
const Participant = require('./models/participant');
const Message = require('./models/message');

// Import routes
const aiRoutes = require('./routes/aiRoutes');
const userRoutes = require('./routes/userRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes'); // Import the message routes

const app = express();

// CORS configuration
const corsOptions = {
  origin: true, // React app's URL (without trailing slash)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
  credentials: true, // Allow credentials (cookies, authentication headers)
};

// Use CORS middleware
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Define relationships

// User has many Messages, based on sender_number
User.hasMany(Message, { foreignKey: 'sender_number', sourceKey: 'phone_number' });

// Conversation has many Messages and Participants
Conversation.hasMany(Message, { foreignKey: 'convo_id' });
Conversation.hasMany(Participant, { foreignKey: 'convo_id' });


// Participant belongs to both User and Conversation
Participant.belongsTo(User, { foreignKey: 'phone_number' });
Participant.belongsTo(Conversation, { foreignKey: 'convo_id' });

// Message belongs to User (sender)
Message.belongsTo(User, { foreignKey: 'sender_number', as: 'sender' }); 

// Conversation has two separate Participant associations (with aliases)
Conversation.hasMany(Participant, { foreignKey: 'convo_id', as: 'MyParticipant' });
Conversation.hasMany(Participant, { foreignKey: 'convo_id', as: 'OtherParticipant' });

User.hasMany(Participant, { foreignKey: 'phone_number', sourceKey: 'phone_number' });
Participant.belongsTo(User, { foreignKey: 'phone_number', targetKey: 'phone_number' });


// Use routes
app.use('/api/ai', aiRoutes);
app.use('/', userRoutes);
app.use('/conversations', conversationRoutes);
app.use('/messages', messageRoutes); // Add message routes
app.use('/uploads', express.static('uploads'));


// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Handle preflight requests (OPTIONS method)
app.options('*', cors(corsOptions));

// Export the configured Express app (without starting the server)
module.exports = app;
