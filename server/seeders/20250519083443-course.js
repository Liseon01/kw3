"use strict";

const { DATE } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("courses", [
      {
        course_code: "abcd",
        course_name: "소프트웨어공학",
        credit: "3",
        max_enrollment: "50",
        course_start_time: "09:00:00",
        course_end_time: "10:15:00",
        course_level: "4",
        course_classfication: "전선",
        prerequisite: 10,
        course_establish_date: new Date(),
        course_status: "개강",
        department_id: 1,
        professor_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        course_code: "abc3223rd",
        course_name: "대학화학및연습1",
        credit: "3",
        max_enrollment: "45",
        course_start_time: "15:00:00",
        course_end_time: "16:15:00",
        course_level: "1",
        course_classfication: "기필",
        prerequisite: 10,
        course_establish_date: new Date(),
        course_status: "개강",
        department_id: 1,
        professor_id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        course_code: "ab134afdscd",
        course_name: "시스템프로그래밍밍",
        credit: "3",
        max_enrollment: "40",
        course_start_time: "13:30:00",
        course_end_time: "14:45:00",
        course_level: "3",
        course_classfication: "전필",
        prerequisite: 10,
        course_establish_date: new Date(),
        course_status: "개강",
        department_id: 1,
        professor_id: 1,
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
