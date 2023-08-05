"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class variant extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  variant.init(
    {
      name: DataTypes.STRING,
      img: DataTypes.STRING,
      url: DataTypes.STRING,
      product_id: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      extra: DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: "variant",
    }
  );
  return variant;
};
