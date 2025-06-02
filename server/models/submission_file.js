"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class submission_file extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      submission_file.belongsTo(models.submission, {
        foreignKey: "submission_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  submission_file.init(
    {
      submission_file_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      file_url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      original_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      uploaded_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      submission_id: {
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
      modelName: "submission_file",
    }
  );
  return submission_file;
};
