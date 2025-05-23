"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert("colleges", [
      {
        college_head: "홍길동",
        college_name: "인공지능융합대학",
        college_establish_date: new Date(),
        college_contact: "0200000001",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        college_head: "김철수",
        college_name: "전자정보공과대학",
        college_establish_date: new Date(),
        college_contact: "0200000002",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    console.log("Colleges Undoing...");
    return queryInterface.bulkDelete("colleges", null, {});
  },
};
