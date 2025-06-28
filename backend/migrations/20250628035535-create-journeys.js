'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('journeys', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      drive_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      rounds_json: {
        type: Sequelize.JSON,
        allowNull: false,
      },
      overall_experience: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      tips_for_juniors: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      approved: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      approved_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('journeys');
  }
};
