"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("semesters", {
      semester_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      semester_classification: {
        type: Sequelize.ENUM("1학기", "2학기", "여름학기", "겨울학기"),
        allowNull: false,
      },
      semester_year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      start_date: {
        type: Sequelize.DATEONLY, //  YYYY-MM-DD 형식으로 저장
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATEONLY, //  YYYY-MM-DD 형식으로 저장
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
    await queryInterface.dropTable("semesters");
  },
};
