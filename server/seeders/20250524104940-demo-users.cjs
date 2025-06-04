'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const now = new Date();
    await queryInterface.bulkInsert('users', [
      {
        username: 'admin',
        password: '$2a$10$zcuAAteiS.qpBbX4eCtijeV23jFKuQ1ruDbtgjAFzW9oFsF.NKUT6', // bcrypt-hashed
        department: 'Admin',
        role: 'admin',
        email: 'ayanbatulan2132@gmail.com',
        createdAt: now,
        updatedAt: now
      },
      {
        username: 'empHR',
        password: '$2a$10$XGNHW9n27o/CcTVoXw/y4uleHkZ9vN8IaeVkqni.i/wYyFk2UAqGW',
        department: 'HR',
        role: 'employee',
        email: 'empHR@example.com',
        createdAt: now,
        updatedAt: now
      },
      {
        username: 'mgrHR',
        password: '$2a$10$XGNHW9n27o/CcTVoXw/y4uleHkZ9vN8IaeVkqni.i/wYyFk2UAqGW',
        department: 'HR',
        role: 'manager',
        email: 'mgrHR@example.com',
        createdAt: now,
        updatedAt: now
      },
      {
        username: 'empIT',
        password: '$2a$10$XGNHW9n27o/CcTVoXw/y4uleHkZ9vN8IaeVkqni.i/wYyFk2UAqGW',
        department: 'IT',
        role: 'employee',
        email: 'empIT@example.com',
        createdAt: now,
        updatedAt: now
      },
      {
        username: 'mgrIT',
        password: '$2a$10$XGNHW9n27o/CcTVoXw/y4uleHkZ9vN8IaeVkqni.i/wYyFk2UAqGW',
        department: 'IT',
        role: 'manager',
        email: 'mgrIT@example.com',
        createdAt: now,
        updatedAt: now
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    // This will delete all seeded users; adjust `where:` if you only want to remove specific ones
    await queryInterface.bulkDelete('users', {
      username: ['admin1', 'empHR', 'mgrHR', 'empIT', 'mgrIT']
    }, {});
  }
};
