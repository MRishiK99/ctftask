'use strict';
module.exports = (sequelize, DataTypes) => {
  const productlist = sequelize.define('productlist', {
    pid: DataTypes.STRING,
    name: DataTypes.STRING,
    base_price: DataTypes.FLOAT,
    starttime: DataTypes.DATE,
    endtime: DataTypes.DATE,
    sold: DataTypes.INTEGER
  }, {});
  productlist.associate = function(models) {
    // associations can be defined here
  };
  return productlist;
};