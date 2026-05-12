import { z } from 'zod';

export const CreateComplaintSchema = z.object({
  userId: z.string().uuid().optional(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
  category: z.string().min(1),
  subject: z.string().min(1),
  description: z.string().min(20),
  location: z.string().min(1),
  urgency: z.enum(['low', 'medium', 'high', 'critical']),
});

export type CreateComplaintDTO = z.infer<typeof CreateComplaintSchema>;

export type ComplaintRow = {
  id: string;
  user_id: string | null;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  subject: string;
  description: string;
  location: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending_review' | 'under_review' | 'in_progress' | 'resolved' | 'closed';
  progress: number;
  created_at: string;
  updated_at: string;
};

export function toPublicComplaint(complaint: ComplaintRow) {
  return {
    id: complaint.id,
    firstName: complaint.first_name,
    lastName: complaint.last_name,
    email: complaint.email,
    phone: complaint.phone,
    address: complaint.address,
    category: complaint.category,
    subject: complaint.subject,
    description: complaint.description,
    location: complaint.location,
    urgency: complaint.urgency,
    status: complaint.status,
    progress: complaint.progress,
    date: new Date(complaint.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    dateRaw: complaint.created_at,
  };
}