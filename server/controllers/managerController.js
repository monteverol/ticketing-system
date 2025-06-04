import db from "../models/index.js";
const { User, Ticket, TicketUpdate } = db;

export const getPendingApprovals = async (req, res) => {
  try {
    const { department } = req.params;

    const tickets = await Ticket.findAll({
      where: {
        status: 'pending_approval',
        requires_manager_approval: true
      },
      include: [{
        model: User,
        as: 'requester',
        where: { department },
        attributes: ['username', 'department']
      }],
      order: [['createdAt', 'DESC']]
    });
    
    res.json(tickets);
  } catch (err) {
    console.error("Manager approval fetch failed:", err.message);
    res.status(500).json({ error: "Database error" });
  }
}

export const approveTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, responding_department, remarks = '' } = req.body;

    // 1) Load existing ticket
    const ticket = await Ticket.findByPk(id);
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    // 2) Flip it from "pending_approval" → "pending"
    await ticket.update({ status: 'pending' });

    // 3) Log the update in TicketUpdate
    await TicketUpdate.create({
      ticket_id: id,
      user_id,
      responding_department,
      purpose: ticket.purpose,
      description: ticket.description,
      status: 'pending',
      remarks,
    });

    // 5) Re‐fetch and return the updated ticket
    const updated = await Ticket.findByPk(id, {
      include: [
        { model: User, as: 'requester', attributes: ['username', 'department'] },
        {
          model: TicketUpdate,
          as: 'updates',
          include: [{ model: User, as: 'updater', attributes: ['username'] }],
          order: [['createdAt', 'ASC']],
        },
      ],
    });

    return res.json(updated);
  } catch (err) {
    console.error('Ticket approval failed:', err);
    return res.status(500).json({ error: 'Failed to approve ticket' });
  }
};

export const rejectTicket = async (req, res) => {
  try {
    const { id } = req.params;
    await Ticket.update({ status: 'unresolved' }, { where: { ticket_id: id } });

    // Notify the original requester about the rejection
    const ticket = await Ticket.findByPk(id);

    const updated = await Ticket.findByPk(id, {
      include: [
        { model: User, as: 'requester', attributes: ['username', 'department'] },
        {
          model: TicketUpdate,
          as: 'updates',
          include: [{ model: User, as: 'updater', attributes: ['username'] }],
          order: [['createdAt', 'ASC']],
        },
      ],
    });

    return res.json(updated);
  } catch (err) {
    console.error('Ticket rejection failed:', err);
    return res.status(500).json({ error: 'Failed to reject ticket' });
  }
};