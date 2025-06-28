const express = require("express");
const router = express.Router();

const {
  registerStudent,
  loginStudent,
  registerAdmin,
  loginAdmin
} = require("../controllers/authController");

// Student registration & login
router.post("/register", registerStudent);
router.post("/login", loginStudent);

// Admin login
router.post("/admin/login", loginAdmin);
router.post("/admin/register", registerAdmin);
module.exports = router;
