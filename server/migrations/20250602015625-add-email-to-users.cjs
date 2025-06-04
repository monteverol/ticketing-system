'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 1) Add email as nullable
    await queryInterface.addColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true
    });

    // 2) Backfill existing rows (for example: username@example.com)
    await queryInterface.sequelize.query(`
      UPDATE "users"
      SET "email" = username || '@example.com'
      WHERE "email" IS NULL;
    `);

    // 3) Alter to NOT NULL
    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('users', 'email');
  }
};
