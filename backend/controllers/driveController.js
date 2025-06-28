
const { PlacementDrive, Company, Query, Journey } = require("../models");
const { HttpStatusCodeConstants } = require("../constants/HttpStatusCodeConstants");
const { ResponseConstants } = require("../constants/ResponseConstants");
const { AuthConstants } = require("../constants/AuthConstants");

const getAllDrives = async (req, res) => {
  try {
    const drives = await PlacementDrive.findAll({
      include: [{ model: Company, as: "company", attributes: ["id","name"] }],
      order: [['registration_deadline','ASC']]
    });

    return res.status(HttpStatusCodeConstants.Ok).json({ drives });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.PlacementDrive.Error.InternalServerError });
  }
};

const getDriveById = async (req, res) => {
  try {
    const { driveId } = req.params;
    const drive = await PlacementDrive.findByPk(driveId, {
      include: [
        { model: Company, as: "company" },
        {
          model: Query,
          as: "queries",
          where: { public: true },
          required: false,        // allow drives with no public queries
          include: [{ 
            model: require("../models").Student, 
            as: "author", 
            attributes: ["id","name"] 
          }]
        },
        {
          model: Journey,
          as: "journeys",
          where: { approved: true },
          required: false,
          include: [{ 
            model: require("../models").Student, 
            as: "student", 
            attributes: ["id","name"] 
          }]
        }
      ]
    });

    if (!drive) {
      return res
        .status(HttpStatusCodeConstants.NotFound)
        .json({ error: ResponseConstants.PlacementDrive.Error.NotFound });
    }

    return res.status(HttpStatusCodeConstants.Ok).json({ drive });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.PlacementDrive.Error.InternalServerError });
  }
};

// POST /drives
const createDrive = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(HttpStatusCodeConstants.Forbidden)
        .json({ message: AuthConstants.AdminOnly });
    }

    const { company_id,  batch, registration_deadline, test_date, interview_date, location, mode } = req.body;
    const created_by = req.user.id;

    const drive = await PlacementDrive.create({
      company_id,
      batch,
      registration_deadline,
      test_date,
      interview_date,
      location,
      mode,
      created_by
    });

    return res
      .status(HttpStatusCodeConstants.Created)
      .json({
        message: ResponseConstants.PlacementDrive.SuccessCreation,
        drive
      });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.PlacementDrive.Error.InternalServerError });
  }
};

// PUT /drives/:driveId
const updateDrive = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(HttpStatusCodeConstants.Forbidden)
        .json({ message: AuthConstants.AdminOnly });
    }

    const { driveId } = req.params;
    const updates = req.body;

    const drive = await PlacementDrive.findByPk(driveId);
    if (!drive) {
      return res
        .status(HttpStatusCodeConstants.NotFound)
        .json({ error: ResponseConstants.PlacementDrive.Error.NotFound });
    }

    Object.assign(drive, updates);
    await drive.save();

    return res
      .status(HttpStatusCodeConstants.Ok)
      .json({
        message: ResponseConstants.PlacementDrive.SuccessUpdate,
        drive
      });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.PlacementDrive.Error.InternalServerError });
  }
};

// DELETE /drives/:driveId
const deleteDrive = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(HttpStatusCodeConstants.Forbidden)
        .json({ message: AuthConstants.AdminOnly });
    }

    const { driveId } = req.params;
    const drive = await PlacementDrive.findByPk(driveId);
    if (!drive) {
      return res
        .status(HttpStatusCodeConstants.NotFound)
        .json({ error: ResponseConstants.PlacementDrive.Error.NotFound });
    }

    await drive.destroy();
    return res
      .status(HttpStatusCodeConstants.Ok)
      .json({ message: ResponseConstants.PlacementDrive.SuccessDeletion });
  } catch (error) {
    console.error(error);
    return res
      .status(HttpStatusCodeConstants.InternalServerError)
      .json({ error: ResponseConstants.PlacementDrive.Error.InternalServerError });
  }
};


module.exports = { getAllDrives, getDriveById, createDrive, updateDrive, deleteDrive };
