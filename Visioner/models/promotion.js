'use strict';
module.exports = (sequelize, DataTypes) => {
  const Promotion = sequelize.define('Promotion', {
    code: DataTypes.STRING,
    price: DataTypes.FLOAT,
    noCam: DataTypes.INTEGER,
    date: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {});
  Promotion.associate = function(models) {
    // associations can be defined here
  };
  return Promotion;
};