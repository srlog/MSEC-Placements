
const { Comment, Journey, Student, Admin } = require("../models");
const { HttpStatusCodeConstants } = require("../constants/HttpStatusCodeConstants");
const { ResponseConstants }       = require("../constants/ResponseConstants");
const { AuthConstants }           = require("../constants/AuthConstants");

/**
 * GET /journeys/:journeyId/comments
 * - Lists all comments on a journey
 */
const getCommentsByJourney = async (req, res) => {
  try {
    const { journeyId } = req.params;

    const comments = await Comment.findAll({
      where: { journey_id: journeyId },
      include: [
        { model: Student, as: "author", attributes: ["id","name"] },
        { model: Admin,   as: "moderator", attributes: ["id","name"] }
      ],
      order: [["created_at","ASC"]],
    });

    return res
      .status(HttpStatusCodeConstants.Ok)
      .json({ comments });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Comment.Error.InternalServerError });
  }
};

/**
 * POST /journeys/:journeyId/comments
 * Body: { content }
 */
const createComment = async (req, res) => {
  try {
    const { journeyId } = req.params;
    const { content }   = req.body;
    const { id: userId }= req.user;

    const journey = await Journey.findByPk(journeyId);
    if (!journey) {
      return res
        .status(HttpStatusCodeConstants.NotFound)
        .json({ error: ResponseConstants.Journey.Error.NotFound });
    }

    const comment = await Comment.create({
      journey_id: journeyId,
      user_id:    userId,
      content,
      moderated_by: null
    });

    return res
      .status(HttpStatusCodeConstants.Created)
      .json({
        message: ResponseConstants.Comment.SuccessCreation,
        comment
      });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Comment.Error.InternalServerError });
  }
};

/**
 * PUT /comments/:commentId
 * Body: { content }
 * - Admin only (to edit or moderate)
 */
const updateComment = async (req, res) => {
  try {
    // Admin or Self
    if (req.user.role !== "admin")  {
      return res
        .status(HttpStatusCodeConstants.Forbidden)
        .json({ message: AuthConstants.AdminOnly });
    }

    const { commentId } = req.params;
    const { content }   = req.body;
    const adminId       = req.user.id;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res
        .status(HttpStatusCodeConstants.NotFound)
        .json({ error: ResponseConstants.Comment.Error.NotFound });
    }

    comment.content      = content !== undefined ? content : comment.content;
    comment.moderated_by = adminId;
    await comment.save();

    return res
      .status(HttpStatusCodeConstants.Ok)
      .json({
        message: ResponseConstants.Comment.SuccessUpdate,
        comment
      });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Comment.Error.InternalServerError });
  }
};

/**
 * DELETE /comments/:commentId
 * - Admin or the comment’s author
 */
const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { id: userId, role } = req.user;

    const comment = await Comment.findByPk(commentId);
    if (!comment) {
      return res
        .status(HttpStatusCodeConstants.NotFound)
        .json({ error: ResponseConstants.Comment.Error.NotFound });
    }

    if (role !== "admin" && comment.user_id !== userId) {
      return res
        .status(HttpStatusCodeConstants.Forbidden)
        .json({ message: AuthConstants.UserMismatch });
    }

    await comment.destroy();
    return res
      .status(HttpStatusCodeConstants.Ok)
      .json({ message: ResponseConstants.Comment.SuccessDeletion });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Comment.Error.InternalServerError });
  }
};

module.exports = {
  getCommentsByJourney,
  createComment,
  updateComment,
  deleteComment
};
