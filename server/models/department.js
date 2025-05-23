"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class department extends Model {
    static associate(models) {
      // define association here
    }
  }
  department.init(
    {
      department_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      department_name: {
        type: DataTypes.STRING,
      },
      department_office_location: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      office_contact: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },

      department_head: {
        type: DataTypes.STRING,
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
      college_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "department",
    }
  );
  return department;
};
