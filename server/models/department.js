// models/department.js
import { Model, DataTypes } from 'sequelize';

export default (sequelize) => {
  class Department extends Model {}

  Department.init(
    {
      department_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
      },
    },
    {
      sequelize,
      modelName: 'Department',
      tableName: 'departments',
      timestamps: true,
      underscored: false,
    }
  );

  Department.associate = (models) => {
    // Departments “own” Tickets by responding_department
    // We'll do a hasMany/belongsTo via the `name` field (or you can store department_id in Ticket)
    // For simplicity, let’s assume `Ticket.responding_department` stores the departmentName string.
    Department.hasMany(models.Ticket, {
      foreignKey: 'responding_department',
      sourceKey: 'name',
      as: 'tickets',
    });
  };

  return Department;
};