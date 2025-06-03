"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "ALTER TABLE students AUTO_INCREMENT = 1"
    );
    await queryInterface.bulkInsert("students", [
      {
        grade: "4학년",
        address: "서울시123 ",
        enrollment_date: new Date(),
        status: "재학",
        profile_picture_url: "dafefadfefa",
        parent_phone_number: "01000000002",
        zip_code: "00001",
        admission_type: "정시",
        tuition_status: "입금완료",
        createdAt: new Date(),
        updatedAt: new Date(),
        department_id: 1,
        user_id: 1,
      },
      {
        grade: "4학년",
        address: "서울시1234 ",
        enrollment_date: new Date(),
        status: "졸업",
        profile_picture_url: "dafefadgaefqfefa",
        parent_phone_number: "01000000004",
        zip_code: "00002",
        admission_type: "수시",
        tuition_status: "입금완료",
        createdAt: new Date(),
        updatedAt: new Date(),
        department_id: 1,
        user_id: 2,
      },
      {
        grade: "1학년",
        address: "서울시12345 ",
        enrollment_date: new Date(),
        status: "휴학",
        profile_picture_url: "dafeqewgadffadfefa",
        parent_phone_number: "01000000005",
        zip_code: "00003",
        admission_type: "수시",
        tuition_status: "입금완료",
        createdAt: new Date(),
        updatedAt: new Date(),
        department_id: 1,
        user_id: 3,
      },
      {
        grade: "4학년",
        address: "서울시123 ",
        enrollment_date: new Date(),
        status: "재학",
        profile_picture_url: "dafefadfefaqfeaf",
        parent_phone_number: "01000000007",
        zip_code: "00004",
        admission_type: "수시",
        tuition_status: "입금완료",
        createdAt: new Date(),
        updatedAt: new Date(),
        department_id: 1,
        user_id: 4,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    console.log("Students Undoing...");

    return queryInterface.bulkDelete("students", null, {});
  },
};
