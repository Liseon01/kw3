"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      user_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM("남", "여"),
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING(11),
        allowNull: false,
      },
      id_num: {
        type: Sequelize.STRING(10),
        allowNull: true,
        unique: true,
      },
      password_hashed: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      identity_num_hashed: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      last_login_date: {
        type: Sequelize.DATE,
        allowNull: true, // 다시 확인 필요
      },
      role: {
        type: Sequelize.ENUM("학생", "교수", "관리자", "미정"),
        allowNull: false,
      },
      is_active_verified: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("users");
  },
};
