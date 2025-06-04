// models/user.js
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class User extends Model {}
  User.init(
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      department: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isIn: [['admin','manager','employee']] },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      timestamps: false,
    }
  );

  User.associate = (models) => {
    User.hasMany(models.Ticket, { foreignKey: 'user_id', as: 'tickets' });
    User.hasMany(models.TicketUpdate, { foreignKey: 'user_id', as: 'updates' });
  };

  return User;
};