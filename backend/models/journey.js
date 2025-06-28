module.exports = (sequelize, DataTypes) => {
  const Journey = sequelize.define(
    "Journey",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      drive_id: { type: DataTypes.INTEGER, allowNull: false },
      student_id: { type: DataTypes.INTEGER, allowNull: false },
      rounds_json: { type: DataTypes.JSON, allowNull: false },
      overall_experience: { type: DataTypes.TEXT, allowNull: true },
      tips_for_juniors: { type: DataTypes.TEXT, allowNull: true },
      approved: { type: DataTypes.BOOLEAN, defaultValue: false },
      approved_by: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      tableName: "journeys",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Journey.associate = (models) => {
    Journey.belongsTo(models.PlacementDrive, { foreignKey: "drive_id", as: "drive" });
    Journey.belongsTo(models.Student, { foreignKey: "student_id", as: "student" });
    Journey.belongsTo(models.Admin, { foreignKey: "approved_by", as: "approver" });
    Journey.hasMany(models.Comment, { foreignKey: "journey_id", as: "comments" });
  };

  return Journey;
};
