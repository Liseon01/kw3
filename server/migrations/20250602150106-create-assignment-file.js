"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("assignment_files", {
      assignment_file_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      file_url: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      original_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      uploaded_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      assignment_id: {
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
    await queryInterface.dropTable("assignment_files");
  },
};
