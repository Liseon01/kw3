"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
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
        type: Sequelize.INTEGER,
      },
      id_num: {
        type: Sequelize.STRING(10),
        allowNull: false,
        unique: true,
      },
      password_hashed: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      identity_num: {
        type: Sequelize.STRING(13),
        allowNull: false,
        unique: true,
      },
      last_login_date: {
        type: Sequelize.DATE,
        allowNull: true, // 다시 확인 필요
      },
      role: {
        type: Sequelize.ENUM("student", "professor", "manager"),
        allowNull: false,
      },
      is_active_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: sequelize.fn("now"),
      },
      updatedAt: {
        type: Sequelize.DATE,
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
