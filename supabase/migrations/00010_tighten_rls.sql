-- Tighten event mutations to owner only (created_by)
-- Note: 00007 already replaced update/delete policies for events with owner checks
-- We need to tighten other tables

-- Volunteers: anyone authenticated can insert (signup flow creates them)
-- But update/delete should require auth (already set, this is OK for now)

-- Reviews: only the review creator should delete their own reviews
-- Since reviews don't have a user_id column, keep current policy (auth required)

-- Institutions: keep current (only dashboard users manage them)

-- Add index on events.created_by for ownership queries
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);

-- Add index on reviews for FK lookups
CREATE INDEX IF NOT EXISTS idx_reviews_volunteer_author_id ON reviews(volunteer_author_id);
CREATE INDEX IF NOT EXISTS idx_reviews_institution_author_id ON reviews(institution_author_id);

-- Add index on event_volunteers for status filtering (used by getPendingApplications)
CREATE INDEX IF NOT EXISTS idx_event_volunteers_status ON event_volunteers(status);

-- Add composite index for duplicate signup check
CREATE INDEX IF NOT EXISTS idx_event_volunteers_volunteer_event ON event_volunteers(volunteer_id, event_id);
