'use strict';
module.exports = (sequelize, DataTypes) => {
  const biddings = sequelize.define('biddings', {
    uid: DataTypes.STRING,
    pid: DataTypes.STRING,
    price: DataTypes.FLOAT,
    isclosed: DataTypes.INTEGER
  }, {});
  biddings.associate = function(models) {
    // associations can be defined here
  };
  return biddings;
};