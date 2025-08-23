
const { Journey, PlacementDrive, Student, Admin, Comment } = require("../models");
const { HttpStatusCodeConstants } = require("../constants/HttpStatusCodeConstants");
const { ResponseConstants }       = require("../constants/ResponseConstants");
const { AuthConstants }           = require("../constants/AuthConstants");

/**
 * GET /drives/:driveId/journeys
 * - Returns only approved journeys
 */
const getJourneysByDrive = async (req, res) => {
  try {
    const { driveId } = req.params;

    const journeys = await Journey.findAll({
      where: { drive_id: driveId, approved: true },
      include: [
        { model: Student, as: "student", attributes: ["id","name","reg_no"] }
      ],
      order: [["created_at","DESC"]],
    });

    return res
      .status(HttpStatusCodeConstants.Ok)
      .json({ journeys });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Journey.Error.InternalServerError });
  }
};
const getAllJourneysByDrive = async (req, res) => {
  try {
    const { driveId } = req.params;

    const journeys = await Journey.findAll({
      where: { drive_id: driveId },
      include: [
        { model: Student, as: "student", attributes: ["id","name","reg_no"] }
      ],
      order: [["created_at","DESC"]],
    });

    return res
      .status(HttpStatusCodeConstants.Ok)
      .json({ journeys });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Journey.Error.InternalServerError });
  }
};
/**
 * POST /drives/:driveId/journeys
 * Body: { rounds_json, overall_experience, tips_for_juniors }
 * - Creates with approved=false by default
 */
const createJourney = async (req, res) => {
  try {
    const { driveId } = req.params;
    const { rounds_json, overall_experience, tips_for_juniors } = req.body;
    const studentId = req.user.id;

    const drive = await PlacementDrive.findByPk(driveId);
    if (!drive) {
      return res
        .status(HttpStatusCodeConstants.NotFound)
        .json({ error: ResponseConstants.PlacementDrive.Error.NotFound });
    }

    const journey = await Journey.create({
      drive_id: driveId,
      student_id: studentId,
      rounds_json,
      overall_experience,
      tips_for_juniors,
      approved: false,
      approved_by: null,
    });

    return res
      .status(HttpStatusCodeConstants.Created)
      .json({
        message: ResponseConstants.Journey.SuccessCreation,
        journey
      });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Journey.Error.InternalServerError });
  }
};

/**
 * PUT /journeys/:journeyId
 * Body: { rounds_json?, overall_experience?, tips_for_juniors?, approved?, approved_by? }
 * - Students can edit their own (but not approval fields)
 * - Admins can approve
 */
const updateJourney = async (req, res) => {
  try {
    const { journeyId } = req.params;
    const updates = req.body;
    const { id: userId, role } = req.user;

    const journey = await Journey.findByPk(journeyId);
    if (!journey) {
      return res
        .status(HttpStatusCodeConstants.NotFound)
        .json({ error: ResponseConstants.Journey.Error.NotFound });
    }

    // If not admin, ensure student owns it
    if (role !== "admin" && journey.student_id !== userId) {
      return res
        .status(HttpStatusCodeConstants.Forbidden)
        .json({ message: AuthConstants.UserMismatch });
    }

    // Students cannot set approval fields
    if (role !== "admin") {
      delete updates.approved;
      delete updates.approved_by;
    } else {
      // If admin, record approver
      updates.approved_by = userId;
    }

    Object.assign(journey, updates);
    await journey.save();

    return res
      .status(HttpStatusCodeConstants.Ok)
      .json({
        message: ResponseConstants.Journey.SuccessUpdate,
        journey
      });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Journey.Error.InternalServerError });
  }
};

/**
 * DELETE /journeys/:journeyId
 * - Admins can delete any; students their own
 */
const deleteJourney = async (req, res) => {
  try {
    const { journeyId } = req.params;
    const { id: userId, role } = req.user;

    const journey = await Journey.findByPk(journeyId);
    if (!journey) {
      return res
        .status(HttpStatusCodeConstants.NotFound)
        .json({ error: ResponseConstants.Journey.Error.NotFound });
    }

    if (role !== "admin" && journey.student_id !== userId) {
      return res
        .status(HttpStatusCodeConstants.Forbidden)
        .json({ message: AuthConstants.UserMismatch });
    }
    
    await Comment.destroy({ where: { journey_id: id } });
    await journey.destroy();
    return res
      .status(HttpStatusCodeConstants.Ok)
      .json({ message: ResponseConstants.Journey.SuccessDeletion });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Journey.Error.InternalServerError });
  }
};

module.exports = {
  getJourneysByDrive,
  getAllJourneysByDrive,
  createJourney,
  updateJourney,
  deleteJourney
};
