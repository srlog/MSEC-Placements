const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Student = sequelize.define(
  "Student",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    reg_no: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
      allowNull: true,
    },
    fathers_name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    residential_address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    mobile: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    parents_mobile_no: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    aadhar_card_no: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    department: {
      type: DataTypes.ENUM("AI&DS", "CSE", "CIVIL", "EEE", "ECE", "IT", "MECH"),
      allowNull: true,
    },
    year: {
      type: DataTypes.ENUM("I", "II", "III", "IV"),
      allowNull: true,
    },
    section: {
      type: DataTypes.ENUM("A", "B", "Not Applicable"),
      allowNull: true,
    },
    cgpa: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    portfolio: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    github_profile: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    linkedin_profile: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    profile_picture: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    verification_token: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "students",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Student.associate = (models) => {
  // association to StudentSkill (many-to-many via StudentSkill)
  Student.belongsToMany(models.Skill, {
    through: models.StudentSkill,
    foreignKey: "student_id",
    otherKey: "skill_id",
    as: "skills",
  });

  // other associations
  Student.hasMany(models.Query,    { foreignKey: "user_id",   as: "queries"  });
  Student.hasMany(models.Journey,  { foreignKey: "student_id",as: "journeys" });
  Student.hasMany(models.Comment,  { foreignKey: "user_id",   as: "comments" });
};

module.exports = Student;
