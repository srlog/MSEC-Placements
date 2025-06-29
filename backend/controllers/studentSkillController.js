const { StudentSkill, Skill, Student, Admin } = require("../models");
const { HttpStatusCodeConstants } = require("../constants/HttpStatusCodeConstants");
const { ResponseConstants }   = require("../constants/ResponseConstants");
const { AuthConstants }       = require("../constants/AuthConstants");


// module.exports = (sequelize, DataTypes) => {
//   const StudentSkill = sequelize.define(
//     "StudentSkill",
//     {
//       id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true,
//       },
//       student_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//       skill_id: {
//         type: DataTypes.INTEGER,
//         allowNull: false,
//       },
//       proof_url: {
//         type: DataTypes.STRING(255),
//         allowNull: true,
//       },
//       description: {
//         type: DataTypes.TEXT,
//         allowNull: true,
//       },
//     },
//     {
//       tableName: "student_skills",
//       timestamps: true,
//       createdAt: "created_at",
//       updatedAt: "updated_at",
//     }
//   );

//   StudentSkill.associate = (models) => {
//     StudentSkill.belongsTo(models.Student, { foreignKey: "student_id", as: "student" });
//     StudentSkill.belongsTo(models.Skill, { foreignKey: "skill_id", as: "skill" });
//   };

//   return StudentSkill;
// };


const createStudentSkill = async (req, res) => {
    try {
        const student_id  = req.user.id;
        const { skill_id, proof_url, description } = req.body;
        const studentSkill = await StudentSkill.create({ student_id, skill_id, proof_url, description });
        return res.status(HttpStatusCodeConstants.Created).json({ message: ResponseConstants.SUCCESS, studentSkill });
    } catch (error) {
        return res.status(HttpStatusCodeConstants.InternalServerError).json({ message: error.message });
    }
};


const deleteStudentSkill = async (req, res) => {
    try {
        const { id } = req.params;
        await StudentSkill.destroy({ where: { id } });
        return res.status(HttpStatusCodeConstants.Ok).json({ message: ResponseConstants.SUCCESS });
    } catch (error) {
        return res.status(HttpStatusCodeConstants.InternalServerError).json({ message: error.message });
    }
};

const updateStudentSkill = async (req, res) => {
    try {
        const { id } = req.params;
        const { student_id, skill_id, proof_url, description } = req.body;
        const studentSkill = await StudentSkill.findByPk(id);
        if (!studentSkill) {
            return res.status(HttpStatusCodeConstants.NotFound).json({ message: ResponseConstants.NOT_FOUND });
        }
        await studentSkill.update({ student_id, skill_id, proof_url, description });
        return res.status(HttpStatusCodeConstants.Ok).json({ message: ResponseConstants.SUCCESS, studentSkill });
    } catch (error) {
        return res.status(HttpStatusCodeConstants.InternalServerError).json({ message: error.message });
    }
};

module.exports = { createStudentSkill, deleteStudentSkill, updateStudentSkill };