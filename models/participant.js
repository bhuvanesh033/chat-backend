const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Conversation = require('./conversation');
const User = require('./user');

const Participant = sequelize.define('Participant', {
    convo_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Conversation,
            key: 'id'
        }
    },
    phone_number: {
        type: DataTypes.STRING,
        references: {
            model: User,
            key: 'phone_number' // Reference phone_number as the primary key
        }
    }
}, {
    timestamps: false
});

module.exports = Participant;
