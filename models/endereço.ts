"use strict";
import { Model } from "sequelize";
module.exports = (sequelize: any, DataTypes: any) => {
  class Endereço extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Cliente }: any) {
      // define association here
      this.belongsTo(Cliente, { foreignKey: "clienteId" });
    }
  }
  Endereço.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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
        type: DataTypes.STRING,
      },
      longitude: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      tableName: "endereços",
      modelName: "Endereço",
    }
  );
  return Endereço;
};
