import { pool } from '../../config/db';
import type { CreateComplaintDTO, ComplaintRow } from './complaint.schema';

const complaintColumns = `
  id,
  user_id,
  first_name,
  last_name,
  email,
  phone,
  address,
  category,
  subject,
  description,
  location,
  urgency,
  status,
  progress,
  created_at,
  updated_at
`;

export async function createComplaint(dto: CreateComplaintDTO): Promise<ComplaintRow> {
  const result = await pool.query<ComplaintRow>(
    `insert into complaints (user_id, first_name, last_name, email, phone, address, category, subject, description, location, urgency)
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     returning ${complaintColumns}`,
    [dto.userId, dto.firstName, dto.lastName, dto.email, dto.phone, dto.address, dto.category, dto.subject, dto.description, dto.location, dto.urgency],
  );

  return result.rows[0];
}

export async function findComplaintsByUserId(userId: string): Promise<ComplaintRow[]> {
  const result = await pool.query<ComplaintRow>(
    `select ${complaintColumns}
     from complaints
     where user_id = $1
     order by created_at desc`,
    [userId],
  );

  return result.rows;
}

export async function findComplaintsByEmail(email: string): Promise<ComplaintRow[]> {
  const result = await pool.query<ComplaintRow>(
    `select ${complaintColumns}
     from complaints
     where email = $1
     order by created_at desc`,
    [email],
  );

  return result.rows;
}

export async function findComplaintById(id: string): Promise<ComplaintRow | null> {
  const result = await pool.query<ComplaintRow>(
    `select ${complaintColumns}
     from complaints
     where id = $1`,
    [id],
  );

  return result.rows[0] ?? null;
}

export async function updateComplaintStatus(id: string, status: string, progress: number): Promise<void> {
  await pool.query(
    'update complaints set status = $1, progress = $2, updated_at = now() where id = $3',
    [status, progress, id],
  );
}