'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('departments', [
      {
        name: 'IT',
        email: 'it-support@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'HR',
        email: 'hr-team@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Finance',
        email: 'finance-dept@example.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('departments', null, {});
  }
};
