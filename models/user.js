const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Ensure phone_number is the primary key in User model
const User = sequelize.define('User', {
    phone_number: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true, // Ensuring phone_number is primary
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    },
    profile: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});


module.exports = User;
