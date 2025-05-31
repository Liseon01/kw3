"use strict";
const { Model, INTEGER } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class course_assignment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      course_assignment.belongsTo(models.syllabus, {
        foreignKey: "syllabus_id",
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      });

      course_assignment.belongsTo(models.semester, {
        foreignKey: "semester_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      course_assignment.belongsTo(models.professor, {
        foreignKey: "professor_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      course_assignment.belongsTo(models.course, {
        foreignKey: "course_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });

      course_assignment.belongsTo(models.department, {
        foreignKey: "department_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  course_assignment.init(
    {
      course_assignment_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      day1: {
        type: DataTypes.ENUM("월", "화", "수", "목", "금", "토", "일"),
        allowNull: false,
      },
      day1_start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      day1_end_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      day2: {
        type: DataTypes.ENUM("월", "화", "수", "목", "금", "토", "일"),
        allowNull: true,
        defaultValue: null,
      },
      day2_start_time: {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: null,
      },
      day2_end_time: {
        type: DataTypes.TIME,
        allowNull: true,
        defaultValue: null,
      },
      course_status: {
        type: DataTypes.ENUM("개강", "폐강"),
        allowNull: false,
      },
      course_establish_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      course_cancel_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
      },
      max_enrollments: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        validate: {
          min: 0,
          max: 255,
        },
      },
      current_enrollments: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          max: 255,
        },
      },
      course_classroom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      syllabus_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      semester_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      professor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      course_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      department_id: {
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
      modelName: "course_assignment",
    }
  );
  return course_assignment;
};
