const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('chat', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
