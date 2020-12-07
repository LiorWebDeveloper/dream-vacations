const Sequelize = require("sequelize");
const sequelizeDBConnection = require("../utils/database");

const Follows = sequelizeDBConnection.define("Followers", {
  id: {
    type: Sequelize.INTEGER(11),
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
  },
  vacationId: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
  },
});
module.exports = Follows;
