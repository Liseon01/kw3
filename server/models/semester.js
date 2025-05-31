"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class semester extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  semester.init(
    {
      semester_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      semester_classification: {
        type: DataTypes.ENUM("1학기", "2학기", "여름학기", "겨울학기"),
        allowNull: false,
      },
      semester_year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { min: 1900, max: 2999 },
      },
      start_date: {
        type: DataTypes.DATEONLY, //  YYYY-MM-DD 형식으로 저장
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATEONLY, //  YYYY-MM-DD 형식으로 저장
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
      modelName: "semester",
    }
  );
  return semester;
};
