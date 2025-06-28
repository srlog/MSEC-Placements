
const { Op } = require("sequelize");
const { PlacementDrive, Query, Journey, Company } = require("../models");
const { HttpStatusCodeConstants } = require("../constants/HttpStatusCodeConstants");
const { ResponseConstants } = require("../constants/ResponseConstants");

const getDashboard = async (req, res) => {
  try {
    const today = new Date();

    // 1. Upcoming drives (next 5)
    const upcomingDrives = await PlacementDrive.findAll({
      where: { registration_deadline: { [Op.gte]: today } },
      include: [{ model: Company, as: "company", attributes: ["id","name"] }],
      order: [['registration_deadline', 'ASC']],
      limit: 5
    });

    // 2. Recent public queries (last 5)
    const recentPublicQueries = await Query.findAll({
      where: { public: true },
      include: [{ 
        model: PlacementDrive, 
        as: "drive", 
        attributes: ["id","batch"] 
      }, {
        model: require("../models").Student,
        as: "author",
        attributes: ["id","name"]
      }],
      order: [['created_at','DESC']],
      limit: 5
    });

    // 3. Recent approved journeys (last 5)
    const recentJourneys = await Journey.findAll({
      where: { approved: true },
      include: [
        { model: PlacementDrive, as: "drive", attributes: ["id","batch"] },
        { model: require("../models").Student, as: "student", attributes: ["id","name"] }
      ],
      order: [['created_at','DESC']],
      limit: 5
    });

    return res.status(HttpStatusCodeConstants.Ok).json({
      upcomingDrives,
      recentPublicQueries,
      recentJourneys
    });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Student.Error.InternalServerError });
  }
};

module.exports = { getDashboard };
