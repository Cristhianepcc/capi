-- Add community_id to events
ALTER TABLE events ADD COLUMN community_id uuid REFERENCES communities(id);

CREATE INDEX idx_events_community ON events(community_id);
