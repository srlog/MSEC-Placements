
const { Op } = require("sequelize");
const {
  PlacementDrive,
  Query,
  Journey,
  Student,
  StudentSkill,
  Skill,
} = require("../models");
const { HttpStatusCodeConstants } = require("../constants/HttpStatusCodeConstants");
const { ResponseConstants }       = require("../constants/ResponseConstants");
const { AuthConstants }           = require("../constants/AuthConstants");

/**
 * GET /admin/dashboard
 * - Number of drives, pending queries, pending journeys
 */
const getDashboard = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(HttpStatusCodeConstants.Forbidden)
        .json({ message: AuthConstants.AdminOnly });
    }

    const [driveCount, pendingQueryCount, pendingJourneyCount] = await Promise.all([
      PlacementDrive.count(),
      Query.count({ where: { public: false, answer: null } }),
      Journey.count({ where: { approved: false } }),
    ]);

    return res
      .status(HttpStatusCodeConstants.Ok)
      .json({
        drives: driveCount,
        pendingQueries: pendingQueryCount,
        pendingJourneys: pendingJourneyCount,
      });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Admin.Error.InternalServerError });
  }
};

/**
 * GET /admin/students
 * Query params: cgpaMin, cgpaMax, skills (comma), arrearsMax, department, year
 */
const filterStudents = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(HttpStatusCodeConstants.Forbidden)
        .json({ message: AuthConstants.AdminOnly });
    }

    const { cgpaMin, cgpaMax, skills, arrearsMax, department, year } = req.query;

    const where = {};
    if (cgpaMin) where.cgpa = { [Op.gte]: parseFloat(cgpaMin) };
    if (cgpaMax) where.cgpa = { ...(where.cgpa||{}), [Op.lte]: parseFloat(cgpaMax) };
    if (department) where.department = department;
    if (year) where.year = year;
    // arrearsMax not modeled explicitly; skip or add if you have an arrears field

    const include = [];
    if (skills) {
      const skillList = skills.split(",").map(s => s.trim());
      include.push({
        model: Skill,
        as: "skills",
        where: { name: { [Op.in]: skillList } },
        through: { attributes: ["proof_url","description"] },
      });
    } else {
      include.push({
        model: Skill,
        as: "skills",
        through: { attributes: ["proof_url","description"] },
      });
    }

    const students = await Student.findAll({
      where,
      include,
    });

    return res
      .status(HttpStatusCodeConstants.Ok)
      .json({ students });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Student.Error.InternalServerError });
  }
};

module.exports = { getDashboard, filterStudents };
