const { Company } = require("../models");
const { HttpStatusCodeConstants } = require("../constants/HttpStatusCodeConstants");
const { ResponseConstants }       = require("../constants/ResponseConstants");
const { AuthConstants }           = require("../constants/AuthConstants");

/**
 * GET /companies
 * Public: list all companies
 */
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({
      order: [["name", "ASC"]]
    });
    return res
      .status(HttpStatusCodeConstants.Ok)
      .json({ companies });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Company.Error.InternalServerError });
  }
};

/**
 * GET /companies/:id
 * Public: get one company
 */
const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findByPk(id);
    if (!company) {
      return res
        .status(HttpStatusCodeConstants.NotFound)
        .json({ error: ResponseConstants.Company.Error.NotFound });
    }
    return res
      .status(HttpStatusCodeConstants.Ok)
      .json({ company });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Company.Error.InternalServerError });
  }
};

/**
 * POST /companies
 * Admin only: create a company
 */
const createCompany = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(HttpStatusCodeConstants.Forbidden)
        .json({ message: AuthConstants.AdminOnly });
    }

    const { name, website, contact_person, contact_email, eligibility_criteria } = req.body;
    const company = await Company.create({
      name,
      website,
      contact_person,
      contact_email,
      eligibility_criteria
    });

    return res
      .status(HttpStatusCodeConstants.Created)
      .json({
        message: ResponseConstants.Company.SuccessCreation,
        company
      });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Company.Error.InternalServerError });
  }
};

/**
 * PUT /companies/:id
 * Admin only: update a company
 */
const updateCompany = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(HttpStatusCodeConstants.Forbidden)
        .json({ message: AuthConstants.AdminOnly });
    }

    const { id } = req.params;
    const updates = req.body;
    const company = await Company.findByPk(id);

    if (!company) {
      return res
        .status(HttpStatusCodeConstants.NotFound)
        .json({ error: ResponseConstants.Company.Error.NotFound });
    }

    Object.assign(company, updates);
    await company.save();

    return res
      .status(HttpStatusCodeConstants.Ok)
      .json({
        message: ResponseConstants.Company.SuccessUpdate,
        company
      });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Company.Error.InternalServerError });
  }
};

/**
 * DELETE /companies/:id
 * Admin only: delete a company
 */
const deleteCompany = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(HttpStatusCodeConstants.Forbidden)
        .json({ message: AuthConstants.AdminOnly });
    }

    const { id } = req.params;
    const company = await Company.findByPk(id);

    if (!company) {
      return res
        .status(HttpStatusCodeConstants.NotFound)
        .json({ error: ResponseConstants.Company.Error.NotFound });
    }

    await company.destroy();
    return res
      .status(HttpStatusCodeConstants.Ok)
      .json({ message: ResponseConstants.Company.SuccessDeletion });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.Company.Error.InternalServerError });
  }
};

module.exports = {
  getAllCompanies,
  getCompanyById,
  createCompany,
  updateCompany,
  deleteCompany
};
