"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("course_assignments", {
      course_assignment_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      day1: {
        type: Sequelize.ENUM("월", "화", "수", "목", "금", "토", "일"),
        allowNull: false,
      },
      day1_start_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      day1_end_time: {
        type: Sequelize.TIME,
        allowNull: false,
      },
      day2: {
        type: Sequelize.ENUM("월", "화", "수", "목", "금", "토", "일"),
        allowNull: true,
        defaultValue: null,
      },
      day2_start_time: {
        type: Sequelize.TIME,
        allowNull: true,
        defaultValue: null,
      },
      day2_end_time: {
        type: Sequelize.TIME,
        allowNull: true,
        defaultValue: null,
      },
      course_status: {
        type: Sequelize.ENUM("개강", "폐강"),
        allowNull: false,
      },
      course_establish_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      course_cancel_date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      max_enrollments: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
      },
      current_enrollments: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      course_classroom: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      syllabus_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      semester_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      professor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      course_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      department_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable("course_assignments");
  },
};
