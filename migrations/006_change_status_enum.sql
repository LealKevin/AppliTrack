-- Write your migrate up statements here

ALTER TABLE applications
DROP CONSTRAINT applications_status_check;

ALTER TABLE applications
ADD CONSTRAINT applications_status_check 
CHECK (status IN ('sent', 'pending', 'interview_scheduled', 'interviewing', 'rejected', 'offer'));

---- create above / drop below ----

ALTER TABLE applications
DROP CONSTRAINT applications_status_check;

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
