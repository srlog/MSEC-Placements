module.exports = (sequelize, DataTypes) => {
  const Skill = sequelize.define(
    "Skill",
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
      category: { type: DataTypes.STRING(50), allowNull: true },
    },
    {
      tableName: "skills",
      timestamps: false,
    }
  );

  Skill.associate = (models) => {
    Skill.belongsToMany(models.Student, {
      through: models.StudentSkill,
      foreignKey: "skill_id",
      otherKey: "student_id",
      as: "students",
    });
  };

  return Skill;
};
