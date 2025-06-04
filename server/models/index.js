// models/index.js
import fs from 'fs';
import path from 'path';
import { Sequelize, DataTypes } from 'sequelize';
import { fileURLToPath } from 'url';

import UserModel from './user.js';
import TicketModel from './ticket.js';
import TicketUpdateModel from './ticketupdate.js';
import AttachmentModel from './attachment.js';

// Determine directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load configuration
const env = process.env.NODE_ENV || 'development';
const configPath = path.join(__dirname, '../config/config.json');
const configFile = fs.readFileSync(configPath, 'utf-8');
const config = JSON.parse(configFile)[env];

// Initialize Sequelize
const sequelize = config.use_env_variable
  ? new Sequelize(process.env[config.use_env_variable], config)
  : new Sequelize(config.database, config.username, config.password, config);

// Initialize models
const User = UserModel(sequelize);
const Ticket = TicketModel(sequelize);
const TicketUpdate = TicketUpdateModel(sequelize);
const Attachment = AttachmentModel(sequelize);

const db = { User, Ticket, TicketUpdate, Attachment };

// after loading all models:
Object.values(db).forEach(model => {
  if (model.associate) model.associate(db);
});

// Run associations
// User.associate({ Ticket, TicketUpdate });
// Ticket.associate({ User, TicketUpdate });
// TicketUpdate.associate({ Ticket, User });

// Export models and sequelize instance
export { sequelize, Sequelize, User, Ticket, TicketUpdate, Attachment };
export default db;
