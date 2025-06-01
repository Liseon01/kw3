"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class document_file extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      document_file.belongsTo(models.document, {
        foreignKey: "document_id",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      });
    }
  }
  document_file.init(
    {
      document_file_id: {
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
      document_id: {
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
      modelName: "document_file",
    }
  );
  return document_file;
};
