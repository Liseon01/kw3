"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class submission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      submission.belongsTo(models.assignment, {
        foreignKey: "assignment_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
      submission.belongsTo(models.student, {
        foreignKey: "student_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  submission.init(
    {
      submission_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      submission_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      assignment_score: {
        type: DataTypes.TINYINT.UNSIGNED,
        allowNull: false,
      },
      submission_status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      assignment_id: {
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
      modelName: "submission",
    }
  );
  return submission;
};
