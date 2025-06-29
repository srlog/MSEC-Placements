const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const  { createStudentSkill, deleteStudentSkill, updateStudentSkill } = require("../controllers/studentSkillController");


router.post("/", authMiddleware, createStudentSkill);
router.put("/", authMiddleware, updateStudentSkill);
router.delete("/", authMiddleware, deleteStudentSkill);

module.exports = router;