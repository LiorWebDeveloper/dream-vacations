const Sequelize = require('sequelize');
const sequelizeDBConnection = require('../utils/database')

const Users = sequelizeDBConnection.define('users', {
    id: {
        type: Sequelize.INTEGER(11),
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false

    },
    mail: {
        type: Sequelize.STRING,
        allowNull: false

    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    role: {
        type: Sequelize.INTEGER(1),
        allowNull: false
    },
});
module.exports = Users;
