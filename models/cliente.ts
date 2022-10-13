"use strict";
import { Model } from "sequelize";
export = (sequelize: any, DataTypes: any) => {
  class Cliente extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({ Endereço }: any) {
      // define association here
      this.hasMany(Endereço, { foreignKey: "clienteId" });
    }
  }
  Cliente.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      cnpj: {
        type: DataTypes.BIGINT,
        allowNull: false,
        validate: {
          len: [14, 14],
        },
      },
      razão_social: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nome_do_contato: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      telefone: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: "clientes",
      modelName: "Cliente",
    }
  );
  return Cliente;
};
