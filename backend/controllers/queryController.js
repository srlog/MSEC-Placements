
const { Query, PlacementDrive, Student, Admin } = require("../models");
const { HttpStatusCodeConstants } = require("../constants/HttpStatusCodeConstants");
const { ResponseConstants }   = require("../constants/ResponseConstants");
const { AuthConstants }       = require("../constants/AuthConstants");

/**
 * GET /drives/:driveId/queries?public=true|false
 * - students may only request public=true
 * - admins may request either
 */
const getDriveQueries = async (req, res) => {
  try {
    const { driveId } = req.params;
    let { public: isPublic } = req.query;

    // Only admins can fetch private queries
    if (isPublic === "false" && req.user.role !== "admin") {
      return res
        .status(HttpStatusCodeConstants.Forbidden)
        .json({ message: AuthConstants.AdminOnly });
    }

    // Default to true
    if (typeof isPublic === "undefined") isPublic = "true";

    const queries = await Query.findAll({
      where: {
        drive_id: driveId,
        public: isPublic === "true",
      },
      include: [
        { model: Student, as: "author", attributes: ["id","name","email"] },
        { model: Admin,   as: "responder", attributes: ["id","name","email"] }
      ],
      order: [["created_at", "ASC"]],
    });

    return res
      .status(HttpStatusCodeConstants.Ok)
      .json({ queries });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Query.Error.InternalServerError });
  }
};

/**
 * POST /drives/:driveId/queries
 * Body: { content }
 * - creates with public=false by default
 */
const createQuery = async (req, res) => {
  try {
    const { driveId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const drive = await PlacementDrive.findByPk(driveId);
    if (!drive) {
      return res
        .status(HttpStatusCodeConstants.NotFound)
        .json({ error: ResponseConstants.PlacementDrive.Error.NotFound });
    }

    const query = await Query.create({
      drive_id: driveId,
      user_id: userId,
      content,
      public: false,
      answered_by: null,
    });

    return res
      .status(HttpStatusCodeConstants.Created)
      .json({
        message: ResponseConstants.Query.SuccessCreation,
        query
      });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Query.Error.InternalServerError });
  }
};

/**
 * PUT /queries/:queryId
 * Body: { answer, public }
 * - Admin only
 */
const updateQuery = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(HttpStatusCodeConstants.Forbidden)
        .json({ message: AuthConstants.AdminOnly });
    }

    const { queryId } = req.params;
    const { answer, public: isPublic } = req.body;
    const adminId = req.user.id;

    const query = await Query.findByPk(queryId);
    if (!query) {
      return res
        .status(HttpStatusCodeConstants.NotFound)
        .json({ error: ResponseConstants.Query.Error.NotFound });
    }

    query.answer     = answer !== undefined ? answer : query.answer;
    query.public     = isPublic  !== undefined ? isPublic  : query.public;
    query.answered_by = adminId;
    await query.save();

    return res
      .status(HttpStatusCodeConstants.Ok)
      .json({
        message: ResponseConstants.Query.SuccessUpdate,
        query
      });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Query.Error.InternalServerError });
  }
};

/**
 * DELETE /queries/:queryId
 * - Admins can delete any; students can delete own queries
 */
const deleteQuery = async (req, res) => {
  try {
    const { queryId } = req.params;
    const userId = req.user.id;
    const role   = req.user.role;

    const query = await Query.findByPk(queryId);
    if (!query) {
      return res
        .status(HttpStatusCodeConstants.NotFound)
        .json({ error: ResponseConstants.Query.Error.NotFound });
    }

    if (role !== "admin" && query.user_id !== userId) {
      return res
        .status(HttpStatusCodeConstants.Forbidden)
        .json({ message: AuthConstants.UserMismatch });
    }

    await query.destroy();
    return res
      .status(HttpStatusCodeConstants.Ok)
      .json({ message: ResponseConstants.Query.SuccessDeletion });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Query.Error.InternalServerError });
  }
};

module.exports = {
  getDriveQueries,
  createQuery,
  updateQuery,
  deleteQuery
};
