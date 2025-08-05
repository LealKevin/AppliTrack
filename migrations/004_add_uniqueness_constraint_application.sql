
-- Write your migrate up statements here
ALTER TABLE applications
ADD CONSTRAINT unique_title_company_user_date 
UNIQUE (title_application, company, user_id, sent_date);

---- create above / drop below ----

ALTER TABLE applications
DROP CONSTRAINT unique_title_company_user_date;

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
