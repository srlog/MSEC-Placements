const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
	getSkills,
	addSkill,
	deleteSkill,
	addSkillBulk,
} = require("../controllers/skillsController");

// List all skills
router.get("/", authMiddleware, getSkills);
router.post("/bulk", authMiddleware, addSkillBulk);
// Post a new skill
router.post("/", authMiddleware, addSkill);

// Delete a skill
router.delete("/:id", authMiddleware, deleteSkill);

module.exports = router;
 