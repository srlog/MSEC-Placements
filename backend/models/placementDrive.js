module.exports = (sequelize, DataTypes) => {
  const PlacementDrive = sequelize.define(
    "PlacementDrive",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      company_id: { type: DataTypes.INTEGER, allowNull: false },
      batch: { type: DataTypes.STRING(20), allowNull: true },
      registration_deadline: { type: DataTypes.DATEONLY, allowNull: true },
      test_date: { type: DataTypes.DATEONLY, allowNull: true },
      interview_date: { type: DataTypes.DATEONLY, allowNull: true },
      location: { type: DataTypes.STRING(255), allowNull: true },
      mode: { type: DataTypes.ENUM("online", "offline"), defaultValue: "offline" },
      created_by: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      tableName: "placement_drives",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  PlacementDrive.associate = (models) => {
    PlacementDrive.belongsTo(models.Company, { foreignKey: "company_id", as: "company" });
    PlacementDrive.belongsTo(models.Admin, { foreignKey: "created_by", as: "creator" });
    PlacementDrive.hasMany(models.Query, { foreignKey: "drive_id", as: "queries" });
    PlacementDrive.hasMany(models.Journey, { foreignKey: "drive_id", as: "journeys" });
  };

  return PlacementDrive;
};
