'use strict';
module.exports = (sequelize, DataTypes) => {
  const CameraPrice = sequelize.define('CameraPrice', {
    price: DataTypes.FLOAT
  }, {});
  CameraPrice.associate = function(models) {
    // associations can be defined here
  };
  return CameraPrice;
};