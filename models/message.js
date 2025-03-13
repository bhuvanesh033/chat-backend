const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');
const Conversation = require('./conversation');

// Ensure sender_number references User.phone_number
const Message = sequelize.define('Message', {
    convo_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Conversation,
            key: 'id'
        }
    },
    message_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    sender_number: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: User,
            key: 'phone_number'  // This should reference the User model's phone_number column
        }
    },
    text: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    media_type: {
        type: DataTypes.ENUM('image', 'video', 'audio', 'file', 'text'),
        allowNull: false
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
});


// Set up the association with the User model
// In app.js or Message model, or where you define the relationship
Message.belongsTo(User, { foreignKey: 'sender_number', as: 'messageSender' });  // Renamed alias to messageSender


module.exports = Message;
