
const jwt = require("jsonwebtoken");
require("dotenv").config();

const { Admin, Student } = require("../models/index");
const { AuthConstants } = require("../constants/AuthConstants");
const { HttpStatusCodeConstants } = require("../constants/HttpStatusCodeConstants");
const { ResponseConstants } = require("../constants/ResponseConstants");
const bcrypt = require("bcryptjs");

const registerStudent = async (req, res) => {
  try {
    const { reg_no, name, email, password } = req.body;
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const student = await Student.create({
      reg_no,
      name,
      email,
      password: hash,
    });

    return res
      .status(HttpStatusCodeConstants.Created)
      .json({ message: ResponseConstants.Student.SuccessCreation, student });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Student.Error.InternalServerError });
  }
};

const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const student = await Student.findOne({ where: { email } });
    if (!student) {
      return res
        .status(HttpStatusCodeConstants.Unauthorized)
        .json({ message: AuthConstants.UserNotFound });
    }

    const valid = await bcrypt.compare(password, student.password);
    if (!valid) {
      return res
        .status(HttpStatusCodeConstants.Unauthorized)
        .json({ message: AuthConstants.InvalidOrExpiredToken });
    }

    const payload = { id: student.id, role: "student" };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: AuthConstants.JwtExpiration,
    });

    return res.status(HttpStatusCodeConstants.Ok).json({
      message: ResponseConstants.Student.SuccessLogin,
      token: `Bearer ${token}`,
      student: {
        id: student.id,
        reg_no: student.reg_no,
        name: student.name,
        email: student.email,
      }
    });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Student.Error.InternalServerError });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });

    if (!admin) {
      return res
        .status(HttpStatusCodeConstants.Unauthorized)
        .json({ message: AuthConstants.InvalidOrExpiredToken });
    }

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) {
      return res
        .status(HttpStatusCodeConstants.Unauthorized)
        .json({ message: AuthConstants.InvalidOrExpiredToken });
    }

    const payload = { id: admin.id, role: "admin" };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: AuthConstants.JwtExpiration,
    });

    return res.status(HttpStatusCodeConstants.Ok).json({
      message: ResponseConstants.Admin.SuccessGetById,
      token: `Bearer ${token}`,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
      }
    });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Admin.Error.InternalServerError });
  }
};

const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const admin = await Admin.create({
      name,
      email,
      password: hash,
    });

    return res
      .status(HttpStatusCodeConstants.Created)
      .json({ message: ResponseConstants.Admin.SuccessCreation, admin });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Admin.Error.InternalServerError });
  }

};

module.exports = {
  registerStudent,
  loginStudent,
  loginAdmin,
  registerAdmin
};
