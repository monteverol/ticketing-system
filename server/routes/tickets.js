import express from "express";
import {
  getTickets,
  getTicketById,
  getDepartmentTickets,
  createTicket,
  updateTicket,
  getTicketUpdates
} from "../controllers/ticketController.js";
import { getDepartmentAnalytics } from "../controllers/analyticsController.js";
import { getPendingApprovals, approveTicket } from "../controllers/managerController.js";
import { uploadForTicket, uploadForUpdate, listAttachments } from "../controllers/attachmentController.js";
import upload from "../middleware/upload.js";
import db from "../db/index.js";

const router = express.Router();

router.get("/", getTickets); // /api/tickets?username=alice
router.get("/:id", getTicketById);
router.get("/:id/updates", getTicketUpdates);
router.get('/:ticketId/attachments', listAttachments);
router.get('/updates/:updateId/attachments', listAttachments);
router.get("/analytics", getDepartmentAnalytics);
router.get("/pending-approvals/:department", getPendingApprovals);
router.get("/department/:department", getDepartmentTickets);

router.post("/", upload.array("attachments", 10), createTicket);
router.post('/:id/attachments', upload.array('files', 10), uploadForTicket);
router.post('/updates/:uid/attachments', upload.array('files', 10), uploadForUpdate);

router.put("/:id", updateTicket);
router.put("/:id/approve", approveTicket);

export default router;