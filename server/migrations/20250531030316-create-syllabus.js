"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("syllabuses", {
      syllabus_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      course_language: {
        type: Sequelize.ENUM("한국어", "영어"),
        allowNull: false,
      },
      require_textbook: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      course_purpose: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      online_ratio: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
      },
      attendance_ratio: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
      },
      midterm_exam_ratio: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
      },
      final_exam_ratio: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
      },
      assignment_ratio: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
      },
      quiz_ratio: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
      },
      attitude_ratio: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
      },
      course_plan: {
        type: Sequelize.TEXT,
        allowNull: true,
        defaultValue: null,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("syllabuses");
  },
};
