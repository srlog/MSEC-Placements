const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");
const studentRoutes = require("./studentRoutes");
const adminRoutes = require("./adminRoutes");
const driveRoutes = require("./driveRoutes");
const portfolioRoutes = require("./portfolioRoutes");
const queryRoutes = require("./queryRoutes");
const commentRoutes = require("./commentRoutes");
const companyRoutes = require("./companyRoutes");
const journeyRoutes = require("./journeyRoutes");
const skillsRoutes = require("./skillsRoutes");
const studentSkillsRoutes = require("./studentSkillsRoutes");

router.use("/auth", authRoutes);
router.use("/students", studentRoutes);
router.use("/admin", adminRoutes);
router.use("/drives", driveRoutes);
router.use("/portfolio", portfolioRoutes);
router.use("/queries", queryRoutes);
router.use("/comments", commentRoutes);
router.use("/journeys", journeyRoutes);
router.use("/companies", companyRoutes);
router.use("/skills", skillsRoutes);
router.use("/student-skills", studentSkillsRoutes);


module.exports = router;
