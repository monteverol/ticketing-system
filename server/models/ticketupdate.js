// models/ticketupdate.js
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class TicketUpdate extends Model {}
  TicketUpdate.init(
    {
      ticket_update_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ticket_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
        validate: { isIn: [['pending','viewed','processing','resolved','unresolved']] },
      },
      remarks: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'TicketUpdate',
      tableName: 'ticket_updates',
      underscored: false,
      timestamps: true,
    }
  );

  TicketUpdate.associate = (models) => {
    TicketUpdate.belongsTo(models.Ticket, { foreignKey: 'ticket_id', as: 'ticket' });
    TicketUpdate.belongsTo(models.User, { foreignKey: 'user_id', as: 'updater' });
    TicketUpdate.hasMany(models.Attachment, { foreignKey: 'ticket_update_id', as: 'attachments' });
  };

  return TicketUpdate;
};
