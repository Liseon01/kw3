"use strict";

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const pwd1 = await bcrypt.hash("12345678", 12);
    const idnh = await bcrypt.hash("1111111111111", 12);
    await queryInterface.sequelize.query(
      "ALTER TABLE users AUTO_INCREMENT = 1"
    );
    try {
      await queryInterface.bulkInsert("users", [
        {
          id_num: "12345678",
          password_hashed: pwd1,
          identity_num_hashed: idnh,
          last_login_date: new Date(),
          role: "관리자",
          is_active_verified: true,
          name: "관리자",
          gender: "남",
          phone_number: "00000000000",
          email: "abc@abc.abc",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    } catch (err) {
      console.log(err);
    }
  },

  async down(queryInterface, Sequelize) {
    console.log("Users Undoing...");
    return queryInterface.bulkDelete("users", null, {});
  },
};
