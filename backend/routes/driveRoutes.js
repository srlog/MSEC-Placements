
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getAllDrives, getDriveById } = require("../controllers/driveController");

// These are student‑facing, so protect with auth
router.get("/drives", authMiddleware, getAllDrives);
router.get("/drive/:driveId", authMiddleware, getDriveById);

module.exports = router;
