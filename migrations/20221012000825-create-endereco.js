"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("endereços", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      logradouro: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      número: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      complemento: {
        type: DataTypes.STRING,
      },
      bairro: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cidade: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      estado: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cep: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          len: {
            args: [8, 8],
            msg: "Um CEP tem 8 caracteres",
          },
        },
      },
      latitude: {
        type: Sequelize.STRING,
      },
      longitude: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      clienteId: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("endereços");
  },
};
