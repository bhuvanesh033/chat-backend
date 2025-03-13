const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Conversation = sequelize.define('Conversation', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    is_group: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    group_name: {  // New field to store the group name
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    timestamps: false
});


module.exports = Conversation;
