"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      "ALTER TABLE professors AUTO_INCREMENT = 1"
    );
    await queryInterface.bulkInsert("professors", [
      {
        name: "이재용",
        gender: "남",
        phone_number: "01000005555",
        address: "서울시어쩌구",
        hire_date: new Date(),
        status: "재직",
        profile_picture_url: "efadjagkfea/eafija23",
        emergency_contact: "01000002222",
        zip_code: "00111",
        title: "정교수",
        field: "머신러닝 및 자연어처리",
        createdAt: new Date(),
        updatedAt: new Date(),
        department_id: 7,
        user_id: 5,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    console.log("Professors Undoing...");
    return queryInterface.bulkDelete("professors", null, {});
  },
};
