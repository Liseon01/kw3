"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class course extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  course.init(
    {
      course_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      course_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      course_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      credit: {
        type: DataTypes.ENUM("1", "2", "3"),
        allowNull: false,
      },
      current_enrollment: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
        defaultValue: 0,
      },
      max_enrollment: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
      },
      course_start_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      course_end_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },
      course_level: {
        type: DataTypes.ENUM("1", "2", "3", "4"),
        allowNull: false,
      },
      course_classfication: {
        type: DataTypes.ENUM("전필", "전선", "교필", "교선", "기선", "기필"),
        allowNull: false,
      },
      prerequisite: {
        type: DataTypes.INTEGER,
        allowNull: true,
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
      course_status: {
        type: DataTypes.ENUM("개강", "폐강"),
        allowNull: false,
      },
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      professor_id: {
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
      modelName: "course",
    }
  );
  return course;
};
