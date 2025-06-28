const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Comment = sequelize.define(
  "Comment",
  {
    id:         { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    journey_id: { type: DataTypes.INTEGER, allowNull: false },
    user_id:    { type: DataTypes.INTEGER, allowNull: false },  // student or admin
    content:    { type: DataTypes.TEXT,    allowNull: false },
    moderated_by:{type: DataTypes.INTEGER, allowNull: true },  // admin if moderated
  },
  {
    tableName: "comments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

Comment.associate = (models) => {
  Comment.belongsTo(models.Journey, { foreignKey: "journey_id",  as: "journey" });
  Comment.belongsTo(models.Student, { foreignKey: "user_id",     as: "author" });
  Comment.belongsTo(models.Admin,   { foreignKey: "moderated_by",as: "moderator" });
};

module.exports = Comment;
