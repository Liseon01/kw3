"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class professor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      professor.belongsTo(models.user, {
        foreignKey: "user_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      professor.belongsTo(models.department, {
        foreignKey: "department_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  professor.init(
    {
      professor_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM("남", "여"),
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING(11),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      hire_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("재직", "휴직", "은퇴"),
        allowNull: false,
      },
      profile_picture_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      emergency_contact: {
        type: DataTypes.STRING(20),
        allowNull: false,
      },
      zip_code: {
        type: DataTypes.STRING(5),
        allowNull: false,
      },
      title: {
        type: DataTypes.ENUM(
          "정교수",
          "부교수",
          "조교수",
          "초빙교수",
          "겸임교수",
          "시간강사"
        ),
        allowNull: false,
      },
      field: {
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
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "professor",
    }
  );
  return professor;
};
