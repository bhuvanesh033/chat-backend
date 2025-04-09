const express = require('express');
const bodyParser = require('body-parser');
const sequelize = require('./config/database');
require("dotenv").config();


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
  origin: 'http://localhost:5173', // React app's URL (without trailing slash)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Specify allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Specify allowed headers
  credentials: true, // Allow credentials (cookies, authentication headers)
};

// Use CORS middleware
const cors = require('cors');
// app.use(cors(corsOptions));
app.use(cors({
    origin: 'http://localhost:5173', // React app URL
    methods: ['GET', 'POST'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // Allow cookies
  }));

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Define relationships
// Define relationships in your app.js

// User has many Messages, based on sender_number
User.hasMany(Message, { foreignKey: 'sender_number', sourceKey: 'phone_number' });

// Conversation has many Messages and Participants
Conversation.hasMany(Message, { foreignKey: 'convo_id' });
Conversation.hasMany(Participant, { foreignKey: 'convo_id' });

// Participant belongs to both User and Conversation
Participant.belongsTo(User, { foreignKey: 'phone_number' });
Participant.belongsTo(Conversation, { foreignKey: 'convo_id' });

// Fix the association between Message and User. Use only one alias.
Message.belongsTo(User, { foreignKey: 'sender_number', as: 'sender' }); 
// Use alias 'sender' only once

// Conversation has two separate Participant associations
Conversation.hasMany(Participant, { foreignKey: 'convo_id', as: 'MyParticipant' });
Conversation.hasMany(Participant, { foreignKey: 'convo_id', as: 'OtherParticipant' });



// Use routes
app.use('/api/ai', aiRoutes);
app.use('/', userRoutes);
app.use('/conversations', conversationRoutes);
app.use('/messages', messageRoutes); // Add message routes

// Logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Handle preflight requests (OPTIONS method)
app.options('*', cors(corsOptions));

// Sync database and start server
sequelize.sync({ alter: true, logging: console.log })
    .then(() => {
        console.log('Database synced and altered successfully');
        app.listen(5000, () => {
            console.log('Server running on port 5000');
        });
    })
    .catch(err => console.log('Error syncing database:', err));
