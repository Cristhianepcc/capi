-- Add explicit FK columns for reviews to replace polymorphic author_id
ALTER TABLE reviews ADD COLUMN volunteer_author_id uuid REFERENCES volunteers(id);
ALTER TABLE reviews ADD COLUMN institution_author_id uuid REFERENCES institutions(id);

-- Migrate existing data
UPDATE reviews SET volunteer_author_id = author_id WHERE author_type = 'voluntario';
UPDATE reviews SET institution_author_id = author_id WHERE author_type = 'institucion';

-- Add constraint: exactly one of the FK columns must be set
ALTER TABLE reviews ADD CONSTRAINT reviews_author_check
  CHECK (num_nonnulls(volunteer_author_id, institution_author_id) = 1);
