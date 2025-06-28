const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
} = require("../controllers/companyController");

// Public routes
router.get("/all", getAllCompanies);
router.get("/company/:id", getCompanyById);

// Protected admin routes
router.post("/company", authMiddleware, createCompany);
router.put("/company/:id", authMiddleware, updateCompany);
router.delete("/company/:id", authMiddleware, deleteCompany);

module.exports = router;
