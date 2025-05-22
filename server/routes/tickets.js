import express from "express";
import {
  getTickets,
  createTicket,
  updateTicket,
} from "../controllers/ticketController.js";
import db from "../db/index.js";

const router = express.Router();

router.get("/", getTickets); // /api/tickets?username=alice

router.get("/:id/updates", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `SELECT ticket_updates.user_id, ticket_updates.responding_department, 
              ticket_updates.status, ticket_updates.remarks, 
              ticket_updates.updated_at, users.username
       FROM ticket_updates
       JOIN users ON users.user_id = ticket_updates.user_id
       WHERE ticket_id = $1
       ORDER BY updated_at ASC`,
      [id]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Failed to fetch ticket updates:", err.message);
    res.status(500).json({ error: "Unable to fetch ticket update history" });
  }
});

router.get("/analytics", async (req, res) => {
  try {
    const total = await db.query("SELECT COUNT(*) FROM tickets");
    const byStatus = await db.query("SELECT status, COUNT(*) FROM tickets GROUP BY status");
    const byDepartment = await db.query("SELECT department, COUNT(*) FROM tickets GROUP BY department");

    res.json({
      total: Number(total.rows[0].count),
      status: byStatus.rows,
      department: byDepartment.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

router.get("/pending-approvals/:department", async (req, res) => {
  const { department } = req.params;

  try {
    const result = await db.query(
      `SELECT tickets.*, users.username, users.department AS requesting_department
       FROM tickets
       JOIN users ON tickets.user_id = users.user_id
       WHERE tickets.status = 'pending_approval'
         AND users.department = $1
         AND tickets.requires_manager_approval = true`,
      [department]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Manager approval fetch failed:", err.message);
    res.status(500).json({ error: "Database error" });
  }
});

// Get tickets by department
router.get("/department/:department", async (req, res) => {
  const { department } = req.params;
  try {
    const result = await db.query(
      // "SELECT * FROM tickets WHERE responding_department = $1 AND status != 'pending_approval' ORDER BY created_at DESC",
      `SELECT tickets.*, users.username, users.department AS requesting_department
       FROM tickets
       JOIN users ON tickets.user_id = users.user_id
       WHERE tickets.responding_department = $1 
         AND status != 'pending_approval'
       ORDER BY tickets.created_at DESC`,
      [department]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", createTicket);
router.put("/:id", updateTicket);

router.put("/:id/approve", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await db.query(
      `UPDATE tickets SET status = 'pending' WHERE ticket_id = $1 RETURNING *`,
      [id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Ticket approval failed:", err.message);
    res.status(500).json({ error: "Failed to approve ticket" });
  }
});

export default router;