import { Attachment } from '../models/index.js';

export const uploadForTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const files = req.files; // array of files
    const records = await Promise.all(
      files.map(f =>
        Attachment.create({
          ticket_id: ticketId,
          filename: f.filename,
          url: `/uploads/${f.filename}`
        })
      )
    );
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload attachments' });
  }
};

export const uploadForUpdate = async (req, res) => {
  try {
    const updateId = req.params.uid;
    const files = req.files;
    const records = await Promise.all(
      files.map(f =>
        Attachment.create({
          ticket_update_id: updateId,
          filename: f.filename,
          url: `/uploads/${f.filename}`
        })
      )
    );
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload attachments' });
  }
};

export const listAttachments = async (req, res) => {
  try {
    const { ticketId, updateId } = req.params;
    const where = ticketId
      ? { ticket_id: ticketId }
      : { ticket_update_id: updateId };
    const atts = await Attachment.findAll({ where });
    res.json(atts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to list attachments' });
  }
};