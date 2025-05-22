import db from "../db/index.js";

// ✅ GET: Fetch tickets for specific user or all
export const getTickets = async (req, res) => {
  const { user_id } = req.query;

  try {
    const result = user_id
      ? await db.query("SELECT tickets.*, users.username, users.department AS requesting_dept FROM tickets JOIN users ON tickets.user_id = users.user_id WHERE tickets.user_id = $1 ORDER BY tickets.created_at DESC", [user_id])
      : await db.query("SELECT tickets.*, users.username, users.department AS requesting_dept FROM tickets JOIN users ON tickets.user_id = users.user_id ORDER BY tickets.created_at DESC");

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ POST: Create a ticket
export const createTicket = async (req, res) => {
  const { user_id, responding_department, purpose, description, requires_manager_approval = false } = req.body;

  if (!user_id || !responding_department || !purpose || !description) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const status = requires_manager_approval ? 'pending_approval' : 'pending';

    await db.query(
      `INSERT INTO tickets (user_id, responding_department, purpose, description, status, requires_manager_approval)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, responding_department, purpose, description, status, requires_manager_approval]
    );

    res.status(201).json({ success: "Submitted a ticket" });
  } catch (err) {
    console.error("Failed to create ticket:", err.message);
    res.status(500).json({ error: "Database error" });
  }
};


// ✅ PUT: Update a ticket's purpose/description/remarks/status AND log to ticket_updates
export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { user_id, responding_department, purpose, description, status, remarks } = req.body;

  try {
    // 1. Update the main ticket
    const ticketResult = await db.query(
      `UPDATE tickets
       SET purpose = $1, description = $2, status = $3, remarks = $4
       WHERE ticket_id = $5 RETURNING *`,
      [purpose, description, status, remarks, id]
    );

    const updatedTicket = ticketResult.rows[0];

    // 2. Log to ticket_updates
    await db.query(
      `INSERT INTO ticket_updates (ticket_id, user_id, responding_department, purpose, description, status, remarks)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, user_id, responding_department, purpose, description, status, remarks]
    );

    res.json(updatedTicket);
  } catch (err) {
    console.error("Failed to update ticket:", err.message);
    res.status(500).json({ error: "Database error" });
  }
};