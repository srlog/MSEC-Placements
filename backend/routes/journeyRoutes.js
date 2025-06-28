const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
	getJourneysByDrive,
	createJourney,
	updateJourney,
	deleteJourney,
} = require("../controllers/journeyController");

// List approved journeys
router.get("/drives/:driveId/journeys", authMiddleware, getJourneysByDrive);

// Create a journey (student)
router.post("/drives/:driveId/journeys", authMiddleware, createJourney);

// Update a journey (owner or admin)
router.put("/journeys/:journeyId", authMiddleware, updateJourney);

// Delete a journey (owner or admin)
router.delete("/journeys/:journeyId", authMiddleware, deleteJourney);

module.exports = router;
