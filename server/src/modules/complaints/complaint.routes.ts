import { Router } from 'express';

import { requireAuth } from '../../middleware/auth';
import { HttpError } from '../../middleware/errors';
import {
  createComplaint,
  findComplaintsByUserId,
  findComplaintsByEmail,
  findComplaintById,
  updateComplaintStatus,
} from './complaint.model';
import {
  CreateComplaintSchema,
  toPublicComplaint,
  type ComplaintRow,
} from './complaint.schema';

export const complaintRouter = Router();

// Submit a complaint
complaintRouter.post('/', async (req, res, next) => {
  try {
    const parsed = CreateComplaintSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'validation_failed', issues: parsed.error.issues });
      return;
    }

    const complaint = await createComplaint(parsed.data);
    res.status(201).json({ complaint: toPublicComplaint(complaint) });
  } catch (err) {
    next(err);
  }
});

// Get complaints for authenticated user
complaintRouter.get('/my', requireAuth, async (req, res, next) => {
  try {
    const user = req.user as any;
    const complaints = await findComplaintsByUserId(user.id);
    res.json({ complaints: complaints.map(toPublicComplaint) });
  } catch (err) {
    next(err);
  }
});

// Track complaint by ID or email
complaintRouter.get('/track', async (req, res, next) => {
  try {
    const { id, email } = req.query;
    if (!id && !email) {
      res.status(400).json({ error: 'id or email required' });
      return;
    }

    let complaints: ComplaintRow[];
    if (id) {
      const complaint = await findComplaintById(id as string);
      complaints = complaint ? [complaint] : [];
    } else {
      complaints = await findComplaintsByEmail(email as string);
    }

    res.json({ complaints: complaints.map(toPublicComplaint) });
  } catch (err) {
    next(err);
  }
});

// Update complaint status (for officials)
complaintRouter.patch('/:id/status', requireAuth, async (req, res, next) => {
  try {
    const { status, progress } = req.body;
    if (!status || typeof progress !== 'number') {
      res.status(400).json({ error: 'status and progress required' });
      return;
    }

    const user = req.user as any;
    if (user.role !== 'official' && user.role !== 'admin') {
      throw new HttpError(403, 'insufficient_permissions');
    }

    await updateComplaintStatus(req.params.id as string, status, progress);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});