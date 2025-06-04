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

    const needsApproval = requires_manager_approval === "true";

    const ticket = await Ticket.create({
      user_id: parseInt(user_id, 10),
      responding_department,
      purpose,
      description,
      status: needsApproval ? "pending_approval" : "pending",
      requires_manager_approval: needsApproval
    });

    if (Array.isArray(req.files)) {
      await Promise.all(req.files.map(file =>
        Attachment.create({
          ticket_id: ticket.ticket_id,
          filename: file.originalname,
          url: `/uploads/${file.filename}`
        })
      ));
    }

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
      await transporter.sendMail({
        from: `"Ticketing System" <${EMAIL_FROM}>`,
        to: requester.email,
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
        { model: User, as: "requester", attributes: ["username", "department", "email"] },
        {
          model: TicketUpdate,
          as: "updates",
          include: [
            { model: User, as: "updater", attributes: ["username", "role"] }
          ],
          order: [["updatedAt", "ASC"]]
        }
      ]
    });

    const lastUpdate = updated.updates[updated.updates.length - 1];

    // 4) If the requester has an email, send them a notification
    if (updated.requester?.email) {
      const { username, email } = updated.requester;

      // Craft a simple plain‐text summary (feel free to tweak as HTML if you prefer)
      const mailOptions = {
        from: `"Ticketing System" <${EMAIL_FROM}>`,
        to: email,
        subject: `Update on Ticket #${updated.ticket_id}`,
        text: `
          Hello ${username},

          Your ticket (#${updated.ticket_id}) in the ${updated.responding_department} queue has been updated.

            • New Status: ${status}
            • Remarks: ${remarks || "(no remarks)"}
            • Updated By: ${lastUpdate.updater.username} (role: ${lastUpdate.updater.role})

          Thank you,
          Support Team
        `.trim(),
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (mailErr) {
        console.warn(
          `⚠️  Failed to send update email for ticket ${id} to ${email}:`,
          mailErr.message
        );
      }
    } else {
      console.warn(
        `⚠️  Skipping “ticket updated” email because user_id=${updated.user_id} has no email on file.`
      );
    }

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