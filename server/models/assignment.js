"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class assignment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      assignment.belongsTo(models.course_assignment, {
        foreignKey: "course_assignment_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  assignment.init(
    {
      assignment_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      writer_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      write_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      method: {
        type: DataTypes.ENUM("팀", "개인"),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      file_format: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      view_count: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      course_assignment_id: {
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
      modelName: "assignment",
    }
  );
  return assignment;
};
