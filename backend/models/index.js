// const Student = require("./student");
// const Admin = require("./admin");
// const Comment = require("./comment");
// const Company = require("./company");
// const Journey = require("./journey");
// const PlacementDrive = require("./placementDrive");
// const Query = require("./query");
// const Skill = require("./skill");
// const StudentSkill = require("./studentSkill");

// module.exports = {
//     Student,
//     Admin,
//     Comment,
//     Company,
//     Journey,
//     PlacementDrive,
//     Query,
//     Skill,
//     StudentSkill,
// };

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const sequelize = require("../config/db"); // adjust path if different

const db = {};
const basename = path.basename(__filename);

// Read all model files in this directory (except index.js)
fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 &&
      file !== basename &&
      file.endsWith(".js")
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Set up associations (if defined)
Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Export the models and Sequelize connection
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
