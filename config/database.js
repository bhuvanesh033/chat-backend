const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('learning1', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
