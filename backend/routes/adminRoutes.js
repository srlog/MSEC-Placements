const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
	getDashboard,
	filterStudents,
} = require("../controllers/adminController");

const {
	createDrive,
	updateDrive,
	deleteDrive,
} = require("../controllers/driveController");

// All admin routes require JWT + admin role check
router.get("/dashboard", authMiddleware, getDashboard);

router.post("/drives", authMiddleware, createDrive);
router.put("/drives/:driveId", authMiddleware, updateDrive);
router.delete("/drives/:driveId", authMiddleware, deleteDrive);

router.get("/students", authMiddleware, filterStudents);

module.exports = router;
