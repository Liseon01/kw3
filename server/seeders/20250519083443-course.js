"use strict";

const { DATE } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "ALTER TABLE courses AUTO_INCREMENT = 1"
    );
    await queryInterface.bulkInsert("courses", [
      {
        course_code: "abcd",
        course_name: "소프트웨어공학",
        credit: "3",
        course_level: "4",
        course_classfication: "전선",
        prerequisite: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        course_code: "abc3223rd",
        course_name: "대학화학및연습1",
        credit: "3",
        course_level: "1",
        course_classfication: "기필",
        prerequisite: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        course_code: "ab134afdscd",
        course_name: "시스템프로그래밍",
        credit: "3",
        course_level: "3",
        course_classfication: "전필",
        prerequisite: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    console.log("Course Undoing...");

    return queryInterface.bulkDelete("courses", null, {});
  },
};
