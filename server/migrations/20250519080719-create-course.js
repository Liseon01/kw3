"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("courses", {
      course_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      course_code: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      course_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      credit: {
        type: Sequelize.ENUM("1", "2", "3"),
        allowNull: false,
      },
      course_level: {
        type: Sequelize.ENUM("1", "2", "3", "4"),
        allowNull: false,
      },
      course_classfication: {
        type: Sequelize.ENUM("전필", "전선", "교필", "교선", "기선", "기필"),
        allowNull: false,
      },
      prerequisite: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.dropTable("courses");
  },
};
