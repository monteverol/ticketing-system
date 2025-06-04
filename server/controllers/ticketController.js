// controllers/ticketController.js
import { Op } from "sequelize";
import db from "../models/index.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const { User, Ticket, TicketUpdate, Attachment } = db;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SENDER_GMAIL_USER,
    pass: process.env.SENDER_GMAIL_PASS
  }
});

const EMAIL_FROM = process.env.SENDER_GMAIL_USER || 'no-reply@naess.com.ph';

// GET /api/tickets?user_id=…
export const getTickets = async (req, res) => {
  try {
    const { user_id } = req.query;
    const where = user_id ? { user_id } : {};

    const tickets = await Ticket.findAll({
      where,
      // Order by the actual column, not the alias
      include: [
        { model: User, as: "requester", attributes: ["username", "department"] },
        { model: Attachment, as: "attachments"}
      ],
      order: [["createdAt", "DESC"]],
    });


    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const getDepartmentTickets = async (req, res) => {
  try {
    const { department } = req.params;

    const tickets = await Ticket.findAll({
      where: {
        responding_department: department,
        status: {
          [Op.ne]: "pending_approval",
        }
      },
      include: [
        {model: User, as: "requester", attributes: ["username", "department"] },
      ],
      order: [["createdAt", "DESC"]],
    });

    res.json(tickets);
  } catch (err) { 
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}

// POST /api/tickets
export const createTicket = async (req, res) => {
  try {
    const {
      user_id,
      responding_department,
      purpose,
      description,
      requires_manager_approval = "false"
    } = req.body;

    // coerce the boolean
    const needsApproval = requires_manager_approval === "true";

    // 1) create the ticket
    const ticket = await Ticket.create({
      user_id: parseInt(user_id, 10),
      responding_department,
      purpose,
      description,
      status: needsApproval ? "pending_approval" : "pending",
      requires_manager_approval: needsApproval
    });

    // 2) if there are any uploaded files, save them in the Attachment table
    if (Array.isArray(req.files)) {
      await Promise.all(req.files.map(file =>
        Attachment.create({
          ticket_id: ticket.ticket_id,
          // you could also attach to ticket_update_id if updating later
          filename: file.originalname,
          url: `/uploads/${file.filename}`
        })
      ));
    }

    // 3) re‐fetch the ticket, including its attachments and requester
    const full = await Ticket.findByPk(ticket.ticket_id, {
      include: [
        { model: User, as: "requester", attributes: ["username","department"] },
        { model: Attachment, as: "attachments" }
      ],
      order: [["createdAt","DESC"]]
    });

    const requester = await User.findByPk(user_id, {
      attributes: ['username','department','email']
    });

    if (requester && requester.email) {
      // 6) Only send email if there _is_ an email column present
      await transporter.sendMail({
        from: `"Ticketing System" <${process.env.GMAIL_USER}>`,
        to: requester.email,                               // <— this must be defined
        subject: `Ticket #${ticket.ticket_id} Received`,
        text: `
          Hello ${requester.username},

          Your ticket (#${ticket.ticket_id}) has been created in the ${responding_department} queue.

          • Purpose: ${purpose}
          • Description: ${description}

          We will notify you as soon as it is processed.  
          Thank you,
          Support Team
        `.trim()
      });
    } else {
      console.warn(
        `⚠️  Skipping email because user_id=${user_id} has no email value.`
      );
    }

    res.status(201).json(full);
  } catch (err) {
    console.error("Failed to create ticket:", err);
    res.status(500).json({ error: err.message });
  }
};


// PUT /api/tickets/:id
export const updateTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      user_id,
      responding_department,
      purpose,
      description,
      status,
      remarks,
    } = req.body;

    // 1. Update the ticket
    await Ticket.update(
      { purpose, description, status, remarks },
      { where: { ticket_id: id } }
    );

    // 2. Log in TicketUpdate
    await TicketUpdate.create({
      ticket_id: id,
      user_id,
      responding_department,
      purpose,
      description,
      status,
      remarks,
    });

    // 3. Return updated record with associations
    const updated = await Ticket.findByPk(id, {
      include: [
        { model: User, as: "requester", attributes: ["username", "department"] },
        {
          model: TicketUpdate,
          as: "updates",
          include: [
            { model: User, as: "updater", attributes: ["username"] }
          ],
          order: [["updatedAt", "ASC"]]
        }
      ]
    });

    res.json(updated);
  } catch (err) {
    console.error("Failed to update ticket:", err);
    res.status(500).json({ error: err.message });
  }
};

// GET /api/tickets/:id/updates
export const getTicketUpdates = async (req, res) => {
  try {
    const { id } = req.params;
    
    const updates = await TicketUpdate.findAll({
      where: { ticket_id: id },
      order: [["updatedAt", "ASC"]],
      include: [
        { model: User, as: "updater", attributes: ["username"] },
        { model: Attachment, as: "attachments"}
      ],
    });

    res.json(updates);
  } catch (err) {
    console.error("Failed to fetch ticket updates:", err);
    res.status(500).json({ error: err.message });
  }
};