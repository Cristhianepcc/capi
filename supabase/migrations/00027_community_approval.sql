-- Community approval workflow
-- Add 'rechazado' status and rejection_reason column

ALTER TABLE communities DROP CONSTRAINT communities_status_check;

ALTER TABLE communities ADD CONSTRAINT communities_status_check
  CHECK (status IN ('activo', 'inactivo', 'solicitud', 'rechazado'));

ALTER TABLE communities ADD COLUMN IF NOT EXISTS rejection_reason text;
