'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Project.belongsToMany(models.User, { through: "UsersProjects" });
      models.User.belongsToMany(models.Project, { through: "UsersProjects" });
    }
  }
  Project.init({
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    dificulty: DataTypes.INTEGER,
    technologies: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Project',
  });

  
  return Project;
};