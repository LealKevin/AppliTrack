
-- Write your migrate up statements here

-- Update existing 'pending' status to 'sent' to maintain data consistency
UPDATE reminders SET status = 'sent' WHERE status = 'pending';

ALTER TABLE reminders
DROP CONSTRAINT reminders_status_check;

ALTER TABLE reminders
ADD CONSTRAINT reminders_status_check 
CHECK (status IN ('sent', 'completed'));
---- create above / drop below ----

ALTER TABLE reminders
DROP CONSTRAINT reminders_status_check;

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
