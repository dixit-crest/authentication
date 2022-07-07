'use strict';
const {
  Model
} = require('sequelize');
const CONSTANTS = require('../config/constants');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association 
      models.User.hasMany(models.Note, { as: 'notes', foreignKey: "ownerId" });

      // models.Note.hasOne(models.User, { as: 'owner' });

    }
  }
  User.init({
    firstName: DataTypes.STRING(30),
    lastName: DataTypes.STRING(30),
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    token: DataTypes.STRING,
    role: {
      type: DataTypes.STRING(12),
      defaultValue: `${CONSTANTS.ROLES.USER}`
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};