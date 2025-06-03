"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("students", {
      student_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      grade: {
        type: Sequelize.ENUM("1학년", "2학년", "3학년", "4학년"),
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      enrollment_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("now"),
      },
      status: {
        type: Sequelize.ENUM("재학", "휴학", "졸업"),
        allowNull: false,
      },
      profile_picture_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      parent_phone_number: {
        type: Sequelize.STRING(11),
        allowNull: true,
        defaultValue: null,
      },
      zip_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      admission_type: {
        type: Sequelize.ENUM("정시", "수시", "미입력"),
        allowNull: true, // 관계자가 직접 등록
        defaultValue: "미입력",
      },
      tuition_status: {
        type: Sequelize.ENUM("입금완료", "미확인"),
        allowNull: true, // 관계자가 직접 등록
        defaultValue: "미확인",
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("now"),
      },
      department_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("students");
  },
};
