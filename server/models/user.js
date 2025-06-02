"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init(
    {
      user_id: {
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
      id_num: {
        type: DataTypes.STRING(10),
        allowNull: true,
        unique: true,
      },
      password_hashed: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      identity_num_hashed: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      last_login_date: {
        type: DataTypes.DATE,
        allowNull: true, // 다시 확인 필요
      },
      role: {
        type: DataTypes.ENUM("학생", "교수", "관리자", "미정"),
        allowNull: false,
      },
      is_active_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn("now"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn("now"),
      },
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};
