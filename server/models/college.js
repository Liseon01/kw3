"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class college extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  college.init(
    {
      college_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      college_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      college_head: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      college_establish_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      college_contact: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "college",
    }
  );
  return college;
};
