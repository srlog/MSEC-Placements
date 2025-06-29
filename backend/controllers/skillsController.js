const { Query, PlacementDrive, Student, Admin, Skill, StudentSkill } = require("../models");
const { HttpStatusCodeConstants } = require("../constants/HttpStatusCodeConstants");
const { ResponseConstants }   = require("../constants/ResponseConstants");
const { AuthConstants }       = require("../constants/AuthConstants");



// module.exports = (sequelize, DataTypes) => {
//   const Skill = sequelize.define(
//     "Skill",
//     {
//       id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
//       name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
//       category: { type: DataTypes.STRING(50), allowNull: true },
//     },
//     {
//       tableName: "skills",
//       timestamps: false,
//     }
//   );

//   Skill.associate = (models) => {
//     Skill.belongsToMany(models.Student, {
//       through: models.StudentSkill,
//       foreignKey: "skill_id",
//       otherKey: "student_id",
//       as: "students",
//     });
//   };

//   return Skill;
// };


const getSkills = async (req, res) => {
    try {
        const skills = await Skill.findAll();
        return res.status(HttpStatusCodeConstants.Ok).json({ message: ResponseConstants.SUCCESS, data: skills });
    } catch (error) {
        return res.status(HttpStatusCodeConstants.InternalServerError).json({ message: error.message });
    }
};

const addSkill = async (req, res) => {
    try {
        const { name, category } = req.body;
        const skill = await Skill.create({ name, category });
        return res.status(HttpStatusCodeConstants.Created).json({ message: ResponseConstants.SUCCESS, data: skill });
    } catch (error) {
        return res.status(HttpStatusCodeConstants.InternalServerError).json({ message: error.message });
    }
};

const deleteSkill = async (req, res) => {
    try {
        const { id } = req.params;
        await Skill.destroy({ where: { id } });
        return res.status(HttpStatusCodeConstants.Ok).json({ message: ResponseConstants.SUCCESS });
    } catch (error) {
        return res.status(HttpStatusCodeConstants.InternalServerError).json({ message: error.message });
    }
};

module.exports = { getSkills, addSkill, deleteSkill };