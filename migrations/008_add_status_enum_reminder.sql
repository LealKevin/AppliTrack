
-- Write your migrate up statements here


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
