
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  getDriveQueries,
  createQuery,
  updateQuery,
  deleteQuery
} = require("../controllers/queryController");

// List queries for a drive (public or private)
router.get(
  "/drives/:driveId/queries",
  authMiddleware,
  getDriveQueries
);

// Post a new query under a drive
router.post(
  "/drives/:driveId/queries",
  authMiddleware,
  createQuery
);

// Admin answers/toggles a query
router.put(
  "/queries/:queryId",
  authMiddleware,
  updateQuery
);

// Delete a query (admin or owner student)
router.delete(
  "/queries/:queryId",
  authMiddleware,
  deleteQuery
);

module.exports = router;
