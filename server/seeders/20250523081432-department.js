"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "ALTER TABLE departments AUTO_INCREMENT = 1"
    );
    await queryInterface.bulkInsert("departments", [
      {
        department_name: "전자공학과",
        department_office_location: "501호",
        office_contact: "0200000001",
        department_head: "박하나",
        createdAt: new Date(),
        updatedAt: new Date(),
        college_id: 2,
      },
      {
        department_name: "전자통신공학과",
        department_office_location: "502호",
        office_contact: "0200000002",
        department_head: "박둘",
        createdAt: new Date(),
        updatedAt: new Date(),
        college_id: 2,
      },
      {
        department_name: "전자융합공학과",
        department_office_location: "503호",
        office_contact: "0200000003",
        department_head: "박셋",
        createdAt: new Date(),
        updatedAt: new Date(),
        college_id: 2,
      },
      {
        department_name: "전기공학과",
        department_office_location: "504호",
        office_contact: "0200000004",
        department_head: "박넷",
        createdAt: new Date(),
        updatedAt: new Date(),
        college_id: 2,
      },
      {
        department_name: "전자재료공학과",
        department_office_location: "505호",
        office_contact: "0200000005",
        department_head: "박다섯",
        createdAt: new Date(),
        updatedAt: new Date(),
        college_id: 2,
      },
      {
        department_name: "반도체시스템공학부",
        department_office_location: "506호",
        office_contact: "0200000006",
        department_head: "박여섯",
        createdAt: new Date(),
        updatedAt: new Date(),
        college_id: 2,
      },
      {
        department_name: "컴퓨터정보공학부",
        department_office_location: "901호",
        office_contact: "0200000007",
        department_head: "김하나",
        createdAt: new Date(),
        updatedAt: new Date(),
        college_id: 1,
      },
      {
        department_name: "소프트웨어학부",
        department_office_location: "902호",
        office_contact: "0200000008",
        department_head: "김둘",
        createdAt: new Date(),
        updatedAt: new Date(),
        college_id: 1,
      },
      {
        department_name: "정보융합학부",
        department_office_location: "903호",
        office_contact: "0200000009",
        department_head: "김셋",
        createdAt: new Date(),
        updatedAt: new Date(),
        college_id: 1,
      },
      {
        department_name: "로봇학부",
        department_office_location: "904호",
        office_contact: "0200000010",
        department_head: "김넷",
        createdAt: new Date(),
        updatedAt: new Date(),
        college_id: 1,
      },
      {
        department_name: "지능형로봇학과",
        department_office_location: "905호",
        office_contact: "0200000011",
        department_head: "김다섯",
        createdAt: new Date(),
        updatedAt: new Date(),
        college_id: 1,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    console.log("Departments Undoing...");
    return queryInterface.bulkDelete("departments", null, {});
  },
};
