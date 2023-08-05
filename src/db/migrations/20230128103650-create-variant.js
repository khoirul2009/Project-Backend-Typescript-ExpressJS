"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("variants", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
      },
      img: {
        type: Sequelize.STRING,
      },
      url: {
        type: Sequelize.STRING,
      },
      product_id: {
        type: Sequelize.INTEGER,
      },
      stock: {
        allowNull: true,
        type: Sequelize.INTEGER,
      },
      extra: {
        allowNull: true,
        type: Sequelize.DOUBLE,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("variants");
  },
};
