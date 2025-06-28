
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { getDashboard } = require("../controllers/studentController");

// All student routes require a valid JWT
router.get("/students/dashboard", authMiddleware, getDashboard);

module.exports = router;
