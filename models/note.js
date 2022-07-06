'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Note extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // models.User.hasMany(models.Note, { as: 'notes' });
      models.Note.belongsTo(models.User, { foreignKey: "ownerId", as: 'notes' });
    }
  }
  Note.init({
    title: DataTypes.STRING,
    description: DataTypes.STRING,
    ownerId: DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Note',
  });
  return Note;
};