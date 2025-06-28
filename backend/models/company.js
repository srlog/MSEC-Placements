module.exports = (sequelize, DataTypes) => {
  const Company = sequelize.define(
    "Company",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      website: { type: DataTypes.STRING(255), allowNull: true },
      contact_person: { type: DataTypes.STRING(100), allowNull: true },
      contact_email: { type: DataTypes.STRING(255), allowNull: true },
      eligibility_criteria: { type: DataTypes.TEXT, allowNull: true },
    },
    {
      tableName: "companies",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Company.associate = (models) => {
    Company.hasMany(models.PlacementDrive, { foreignKey: "company_id", as: "drives" });
    Company.hasMany(models.Journey, { foreignKey: "company_id", as: "journeys" });
  };

  return Company;
};
