// models/ticket.js
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Ticket extends Model {}
  Ticket.init(
    {
      ticket_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      requires_manager_approval: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      responding_department: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      purpose: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isIn: [['pending_approval','pending','viewed','processing','resolved','unresolved']] },
      },
      remarks: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'Ticket',
      tableName: 'tickets',
      timestamps: true,    // adds createdAt & updatedAt
      underscored: false,
    }
  );

  Ticket.associate = (models) => {
    Ticket.belongsTo(models.User, { foreignKey: 'user_id', as: 'requester' });
    Ticket.hasMany(models.TicketUpdate, { foreignKey: 'ticket_id', as: 'updates' });
    Ticket.hasMany(models.Attachment, { foreignKey: 'ticket_id', as: 'attachments' });
  };

  return Ticket;
};