-- Write your migrate up statements here

ALTER TABLE rounds
DROP CONSTRAINT rounds_type_check;

ALTER TABLE rounds
ADD CONSTRAINT rounds_type_check 
CHECK (type IN ('phone_screen', 'technical', 'final', 'onsite'));

---- create above / drop below ----

ALTER TABLE rounds
DROP CONSTRAINT rounds_type_check;

ALTER TABLE rounds
ADD CONSTRAINT rounds_type_check 
CHECK (type IN ('phone_screen', 'technical', 'behavioral', 'final', 'onsite'));

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.