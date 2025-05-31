"use strict";

const { sequelize } = require("../models");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("registrations", {
      registration_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      registration_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      course_repetition_status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      course_repeition_date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      assignment_score: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: true,
        defaultValue: null,
      },
      midterm_exam_score: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: true,
        defaultValue: null,
      },
      final_exam_score: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: true,
        defaultValue: null,
      },
      attendance_score: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: true,
        defaultValue: null,
      },
      attitude_score: {
        type: Sequelize.TINYINT.UNSIGNED,
        allowNull: true,
        defaultValue: null,
      },
      grade: {
        type: Sequelize.ENUM("A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"),
        allowNull: true,
        defaultValue: null,
      },
      grade_update_date: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      course_assignment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      semester_id: {
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
    await queryInterface.dropTable("registrations");
  },
};
