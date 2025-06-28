const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Admin = sequelize.define(
  "Admin",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    tableName: "admins",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Admin.associate = (models) => {
  // admins create drives, answer queries, approve journeys, etc.
  Admin.hasMany(models.PlacementDrive, { foreignKey: "created_by", as: "drives" });
  Admin.hasMany(models.Query,          { foreignKey: "answered_by",as: "answeredQueries" });
  Admin.hasMany(models.Journey,        { foreignKey: "approved_by",as: "approvedJourneys" });
  Admin.hasMany(models.Comment,        { foreignKey: "moderated_by",as: "moderatedComments" });
};

module.exports = Admin;
s