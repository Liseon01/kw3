"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class syllabus extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      syllabus.belongsTo(models.course_assignment, {
        foreignKey: "course_assignment_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      syllabus.belongsTo(models.semester, {
        foreignKey: "semester_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  syllabus.init(
    {
      syllabus_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      course_language: {
        type: DataTypes.ENUM("한국어", "영어"),
        allowNull: false,
      },
      require_textbook: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
      },
      course_purpose: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
      },
      online_ratio: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
        },
      },
      attendance_ratio: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
        },
      },
      midterm_exam_ratio: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
        },
      },
      final_exam_ratio: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
        },
      },
      assignment_ratio: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
        },
      },
      quiz_ratio: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
        },
      },
      attitude_ratio: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        validate: {
          min: 0,
          max: 100,
        },
      },
      course_plan: {
        type: DataTypes.TEXT,
        allowNull: true,
        defaultValue: null,
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
      modelName: "syllabus",
    }
  );
  return syllabus;
};
