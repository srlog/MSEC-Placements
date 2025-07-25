module.exports = (sequelize, DataTypes) => {
  const Query = sequelize.define(
    "Query",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      drive_id: { type: DataTypes.INTEGER, allowNull: false },
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      content: { type: DataTypes.TEXT, allowNull: false },
      answer: { type: DataTypes.TEXT, allowNull: true },
      public: { type: DataTypes.BOOLEAN, defaultValue: false },
      answered_by: { type: DataTypes.INTEGER, allowNull: true },
    },
    {
      tableName: "queries",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  Query.associate = (models) => {
    Query.belongsTo(models.PlacementDrive, { foreignKey: "drive_id", as: "drive" });
    Query.belongsTo(models.Student, { foreignKey: "user_id", as: "author" });
    Query.belongsTo(models.Admin, { foreignKey: "answered_by", as: "responder" });
  };

  return Query;
};
