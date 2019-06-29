'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    fullname: DataTypes.STRING,
    dob: DataTypes.STRING,
    citizenID: DataTypes.STRING,
    passportID: DataTypes.STRING,
    address: DataTypes.STRING,
    phone: DataTypes.STRING,
    companyName: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    maxCamera: DataTypes.INTEGER,
    credit: DataTypes.FLOAT,
    isActive: DataTypes.BOOLEAN
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Camera);
  };
  return User;
};