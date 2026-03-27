-- Drop policies on OTHER tables that reference event_collaborators
DROP POLICY IF EXISTS "Owners or admin update events" ON events;
DROP POLICY IF EXISTS "Event owners or admin manage volunteers" ON event_volunteers;

-- Drop policies on event_collaborators itself
DROP POLICY IF EXISTS "Read collaborators" ON event_collaborators;
DROP POLICY IF EXISTS "Insert collaborators" ON event_collaborators;
DROP POLICY IF EXISTS "Delete collaborators" ON event_collaborators;

-- Now safe to drop the table
DROP TABLE IF EXISTS event_collaborators;
