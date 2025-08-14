
-- Write your migrate up statements here
-- Create a function for updating the timestamp

ALTER TABLE applications
ADD COLUMN location TEXT;

UPDATE applications
SET location = '';

ALTER TABLE applications
ALTER COLUMN location SET NOT NULL;

---- create above / drop below ----

ALTER TABLE applications
DROP COLUMN location;

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
