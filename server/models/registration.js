"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class registration extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  registration.init(
    {
      registration_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      registration_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      course_repetition_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      course_repeition_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      assignment_score: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: true,
        defaultValue: null,
      },
      midterm_exam_score: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: true,
        defaultValue: null,
      },
      final_exam_score: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: true,
        defaultValue: null,
      },
      attendance_score: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: true,
        defaultValue: null,
      },
      attitude_score: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: true,
        defaultValue: null,
      },
      grade: {
        type: DataTypes.ENUM("A+", "A", "B+", "B", "C+", "C", "D+", "D", "F"),
        allowNull: true,
        defaultValue: null,
      },
      grade_update_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      course_assignment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      semester_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "registration",
    }
  );
  return registration;
};
