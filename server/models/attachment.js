import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Attachment extends Model {}
  Attachment.init(
    {
      attachment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      ticket_id: DataTypes.INTEGER,
      ticket_update_id: DataTypes.INTEGER,
      filename: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Attachment',
      tableName: 'attachments',
      timestamps: true,
      underscored: false,
    }
  );

  Attachment.associate = (models) => {
    Attachment.belongsTo(models.Ticket, { foreignKey: 'ticket_id', as: 'ticket' });
    Attachment.belongsTo(models.TicketUpdate, { foreignKey: 'ticket_update_id', as: 'update' });
  };

  return Attachment;
};