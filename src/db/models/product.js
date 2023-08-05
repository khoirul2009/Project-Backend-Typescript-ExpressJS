"use strict";
const { Model } = require("sequelize");
const category = require("./category");
const variant = require("./variant");

module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      product.belongsTo(models.category, {
        foreignKey: "category_id",
        as: "category",
      });

      product.hasMany(models.variant, {
        foreignKey: "product_id",
        as: "variant",
      });
    }
  }

  product.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      price: DataTypes.DOUBLE,
      stock: DataTypes.NUMBER,
      image: DataTypes.STRING,
      url: DataTypes.STRING,
      category_id: DataTypes.NUMBER,
    },
    {
      sequelize,
      modelName: "product",
    }
  );
  return product;
};
