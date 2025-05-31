"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "ALTER TABLE semesters AUTO_INCREMENT = 1"
    );
    await queryInterface.bulkInsert("semesters", [
      {
        semester_classification: "1학기",
        semester_year: "2025",
        start_date: "2025-03-01",
        end_date: "2025-06-15",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        semester_classification: "2학기",
        semester_year: "2025",
        start_date: "2025-09-01",
        end_date: "2025-12-13",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        semester_classification: "여름학기",
        semester_year: "2025",
        start_date: "2025-06-24",
        end_date: "2025-07-21",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        semester_classification: "겨울학기",
        semester_year: "2025",
        start_date: "2025-12-21",
        end_date: "2026-1-15",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        semester_classification: "1학기",
        semester_year: "2026",
        start_date: "2026-03-02",
        end_date: "2026-06-13",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        semester_classification: "2학기",
        semester_year: "2026",
        start_date: "2026-09-02",
        end_date: "2026-12-13",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        semester_classification: "여름학기",
        semester_year: "2026",
        start_date: "2026-06-24",
        end_date: "2026-07-21",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        semester_classification: "겨울학기",
        semester_year: "2026",
        start_date: "2026-12-21",
        end_date: "2027-1-15",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    console.log("Semesters Undoing...");
    return queryInterface.bulkDelete("semesters", null, {});
  },
};
