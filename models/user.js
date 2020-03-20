'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    uid: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    pwd: DataTypes.STRING,
    phone: DataTypes.INTEGER,
    salt: DataTypes.STRING,
    isAdmin: DataTypes.INTEGER
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};