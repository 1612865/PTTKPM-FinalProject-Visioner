'use strict';
module.exports = (sequelize, DataTypes) => {
  const Camera = sequelize.define('Camera', {
    uuid: DataTypes.STRING,
    key: DataTypes.STRING,
    outputSource: DataTypes.STRING,
    outputType: DataTypes.STRING,
    expiredDate: DataTypes.INTEGER,
    isActive: DataTypes.BOOLEAN
  }, {});
  Camera.associate = function(models) {
    // associations can be defined here
    Camera.belongsTo(models.User);
  };
  return Camera;
};