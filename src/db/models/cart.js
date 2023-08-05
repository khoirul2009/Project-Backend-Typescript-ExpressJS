"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      cart.belongsTo(models.product, {
        foreignKey: "product_id",
        as: "product",
      });
      cart.belongsTo(models.user, {
        foreignKey: "user_id",
        as: "user",
      });
      cart.belongsTo(models.variant, {
        foreignKey: "variant_id",
        as: "variant",
      });
    }
  }
  cart.init(
    {
      product_id: DataTypes.NUMBER,
      user_id: DataTypes.NUMBER,
      qty: DataTypes.NUMBER,
      notes: DataTypes.TEXT,
      variant_id: DataTypes.NUMBER,
      total: DataTypes.DOUBLE,
      selected: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "cart",
    }
  );
  return cart;
};
