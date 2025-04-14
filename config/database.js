const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('learning2', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = sequelize;
