
const { Student, Skill, StudentSkill } = require("../models");
const { HttpStatusCodeConstants } = require("../constants/HttpStatusCodeConstants");
const { ResponseConstants }       = require("../constants/ResponseConstants");
const { AuthConstants }           = require("../constants/AuthConstants");

/**
 * GET /portfolio/me
 * Returns logged-in student’s full profile, achievements, and skills.
 */
const getOwnProfile = async (req, res) => {
  try {
    const student = await Student.findByPk(req.user.id, {
      include: [
        {
          model: Skill,
          as: "skills",
          through: { attributes: ["proof_url", "description"] }
        }
      ]
    });

    if (!student) {
      return res
        .status(HttpStatusCodeConstants.NotFound)
        .json({ error: ResponseConstants.Student.Error.NotFound });
    }

    return res
      .status(HttpStatusCodeConstants.Ok)
      .json({ student });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Student.Error.InternalServerError });
  }
};

/**
 * GET /portfolio/:studentId
 * Admin or owning student may view any.
 */
const getStudentProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const student = await Student.findByPk(studentId, {
      include: [
        {
          model: Skill,
          as: "skills",
          through: { attributes: ["proof_url", "description"] }
        }
      ]
    });

    if (!student) {
      return res
        .status(HttpStatusCodeConstants.NotFound)
        .json({ error: ResponseConstants.Student.Error.NotFound });
    }

    return res
      .status(HttpStatusCodeConstants.Ok)
      .json({ student });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Student.Error.InternalServerError });
  }
};

/**
 * PUT /portfolio/me
 * Updates profile fields for logged-in student.
 */
const updateProfile = async (req, res) => {
  try {
    const id = req.user.id;
    const updateFields = [
      "reg_no","name","gender","fathers_name","date_of_birth",
      "residential_address","mobile","parents_mobile_no",
      "aadhar_card_no","department","year","section","cgpa",
      "bio","portfolio","github_profile","linkedin_profile","profile_picture"
    ];
    const data = {};
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) data[field] = req.body[field];
    });

    const student = await Student.findByPk(id);
    if (!student) {
      return res
        .status(HttpStatusCodeConstants.NotFound)
        .json({ error: ResponseConstants.Student.Error.NotFound });
    }

    await student.update(data);
    return res
      .status(HttpStatusCodeConstants.Ok)
      .json({ message: ResponseConstants.Student.SuccessUpdate, student });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Student.Error.InternalServerError });
  }
};

/**
 * DELETE /portfolio/:studentId
 * Admins can delete any; students can delete own.
 */
const deleteProfile = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { id: userId, role } = req.user;

    if (role !== "admin" && userId !== parseInt(studentId)) {
      return res
        .status(HttpStatusCodeConstants.Forbidden)
        .json({ message: AuthConstants.UserMismatch });
    }

    const student = await Student.findByPk(studentId);
    if (!student) {
      return res
        .status(HttpStatusCodeConstants.NotFound)
        .json({ error: ResponseConstants.Student.Error.NotFound });
    }

    await student.destroy();
    return res
      .status(HttpStatusCodeConstants.Ok)
      .json({ message: ResponseConstants.Student.SuccessDeletion });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Student.Error.InternalServerError });
  }
};

module.exports = {
  getOwnProfile,
  getStudentProfile,
  updateProfile,
  deleteProfile
};
