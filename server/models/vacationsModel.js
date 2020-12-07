const Sequelize = require("sequelize");
const sequelizeDBConnection = require("../utils/database");

const Vacation = sequelizeDBConnection.define("vacation", {
  id: {
    type: Sequelize.INTEGER(11),
    autoIncrement: true,
    primaryKey: true,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  destination: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  picture: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  fromDate: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  toDate: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
  },
});
module.exports = Vacation;
