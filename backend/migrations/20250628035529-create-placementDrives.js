'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('placement_drives', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      company_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      batch: {
        type: Sequelize.STRING(20),
        allowNull: true,
      },
      registration_deadline: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      test_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      interview_date: {
        type: Sequelize.DATEONLY,
        allowNull: true,
      },
      location: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      mode: {
        type: Sequelize.ENUM('online','offline'),
        defaultValue: 'offline',
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
    await queryInterface.dropTable('placement_drives');
  }
};
