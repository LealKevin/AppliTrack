
-- Write your migrate up statements here
ALTER TABLE users
DROP COLUMN name;
---- create above / drop below ----
ALTER TABLE users
ADD COLUMN name TEXT;
-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.

