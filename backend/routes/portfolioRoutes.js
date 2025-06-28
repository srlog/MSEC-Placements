
const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  getOwnProfile,
  getStudentProfile,
  updateProfile,
  deleteProfile
} = require("../controllers/portfolioController");

// Get own profile
router.get("/portfolio/me", authMiddleware, getOwnProfile);

// Get any student's profile (admin or same student)
router.get("/portfolio/:studentId", authMiddleware, getStudentProfile);

// Update own profile
router.put("/portfolio/me", authMiddleware, updateProfile);

// Delete a profile (admin or owner)
router.delete("/portfolio/:studentId", authMiddleware, deleteProfile);

module.exports = router;

