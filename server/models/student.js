"use strict";
const { Model, Sequelize } = require("sequelize");
module.exports = (sequelize, Sequelize) => {
  class student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  student.init(
    {
      student_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM("남", "여"),
        allowNull: false,
      },
      grade: {
        type: Sequelize.ENUM("1학년", "2학년", "3학년", "4학년"),
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING(11),
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      enrollment_date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: sequelize.fn("now"),
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("재학", "휴학", "졸업"),
        allowNull: false,
      },
      profile_picture_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      parent_phone_number: {
        type: Sequelize.STRING(11),
        allowNull: false,
      },
      zip_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      admission_type: {
        type: Sequelize.ENUM("정시", "수시", "미입력"),
        allowNull: true, // 관계자가 직접 등록
        defaultValue: "미입력",
      },
      tuition_status: {
        type: Sequelize.ENUM("입금완료", "미확인"),
        allowNull: true, // 관계자가 직접 등록
        defaultValue: "미확인",
      },
      current_semester: {
        type: Sequelize.ENUM("1학기", "2학기", "여름학기", "겨울학기"),
        allowNull: true, // 관계자가 직접 등록
        defaultValue: "1학기",
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: sequelize.fn("now"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: sequelize.fn("now"),
      },
      department_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "student",
    }
  );
  return student;
};
