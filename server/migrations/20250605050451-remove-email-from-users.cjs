'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove `email` from users
    await queryInterface.removeColumn('users', 'email');
  },

  down: async (queryInterface, Sequelize) => {
    // Add it back on rollback (though since you didn’t have actual per‐user emails, you can make it nullable)
    await queryInterface.addColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    });
  }
};
