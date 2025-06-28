module.exports = (sequelize, DataTypes) => {
  const StudentSkill = sequelize.define(
    "StudentSkill",
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      student_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      skill_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      proof_url: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "student_skills",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );

  StudentSkill.associate = (models) => {
    StudentSkill.belongsTo(models.Student, { foreignKey: "student_id", as: "student" });
    StudentSkill.belongsTo(models.Skill, { foreignKey: "skill_id", as: "skill" });
  };

  return StudentSkill;
};
