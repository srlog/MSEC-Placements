const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
	getCommentsByJourney,
	createComment,
	updateComment,
	deleteComment,
} = require("../controllers/commentController");

// List comments on a journey
router.get(
	"/journeys/:journeyId/comments",
	authMiddleware,
	getCommentsByJourney
);

// Post a comment
router.post("/journeys/:journeyId/comments", authMiddleware, createComment);

// Admin edits/moderates a comment
router.put("/comments/:commentId", authMiddleware, updateComment);

// Delete a comment (owner or admin)
router.delete("/comments/:commentId", authMiddleware, deleteComment);

module.exports = router;
