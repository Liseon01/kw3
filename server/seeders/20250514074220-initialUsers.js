"use strict";

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const pwd1 = await bcrypt.hash("123", 12);
    const pwd2 = await bcrypt.hash("124", 12);
    const pwd3 = await bcrypt.hash("12345", 12);
    const pwd4 = await bcrypt.hash("123456", 12);
    const pwd5 = await bcrypt.hash("1234567", 12);
    await queryInterface.sequelize.query(
      "ALTER TABLE users AUTO_INCREMENT = 1"
    );
    await queryInterface.bulkInsert("users", [
      {
        id_num: "2019202073",
        password_hashed: pwd1,
        identity_num: "0000000000001",
        last_login_date: new Date(),
        role: "student",
        is_active_verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_num: "2019202074",
        password_hashed: pwd2,
        identity_num: "0000000000002",
        last_login_date: new Date(),
        role: "student",
        is_active_verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_num: "2019202075",
        password_hashed: pwd3,
        identity_num: "0000000000003",
        last_login_date: new Date(),
        role: "student",
        is_active_verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_num: "2019202076",
        password_hashed: pwd4,
        identity_num: "0000000000004",
        last_login_date: new Date(),
        role: "student",
        is_active_verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id_num: "11112222",
        password_hashed: pwd5,
        identity_num: "0000000000005",
        last_login_date: new Date(),
        role: "professor",
        is_active_verified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    console.log("Users Undoing...");
    return queryInterface.bulkDelete("users", null, {});
  },
};
