"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
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
        type: DataTypes.INTEGER,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      gender: {
        type: DataTypes.ENUM("남", "여"),
        allowNull: false,
      },
      grade: {
        type: DataTypes.ENUM("1학년", "2학년", "3학년", "4학년"),
        allowNull: false,
      },
      phone_number: {
        type: DataTypes.STRING(11),
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      enrollment_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: sequelize.fn("now"),
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("재학", "휴학", "졸업"),
        allowNull: false,
      },
      profile_picture_url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      parent_phone_number: {
        type: DataTypes.STRING(11),
        allowNull: false,
      },
      zip_code: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      admission_type: {
        type: DataTypes.ENUM("정시", "수시", "미입력"),
        allowNull: true, // 관계자가 직접 등록
        defaultValue: "미입력",
      },
      tuition_status: {
        type: DataTypes.ENUM("입금완료", "미확인"),
        allowNull: true, // 관계자가 직접 등록
        defaultValue: "미확인",
      },
      current_semester: {
        type: DataTypes.ENUM("1학기", "2학기", "여름학기", "겨울학기"),
        allowNull: true, // 관계자가 직접 등록
        defaultValue: "1학기",
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn("now"),
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: sequelize.fn("now"),
      },
      department_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
      user_id: {
        allowNull: false,
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "student",
    }
  );
  return student;
};
