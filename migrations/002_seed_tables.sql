-- Write your migrate up statements here

INSERT INTO users (id, name, email, password) VALUES
  ('11111111-1111-1111-1111-111111111111', 'John Doe', 'john@example.com', 'password123'),
  ('22222222-2222-2222-2222-222222222222', 'Jane Smith', 'jane@example.com', 'securepass');

INSERT INTO applications (id, title_application, company, sent_date, status, user_id) VALUES
  ('aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Développeur Backend', 'Google', '2025-03-01', 'sent', '11111111-1111-1111-1111-111111111111'),
  ('aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Développeur Frontend', 'Facebook', '2025-03-05', 'pending', '22222222-2222-2222-2222-222222222222');

INSERT INTO reminders (reminder_date, status, application_id) VALUES
  ('2025-03-10', 'pending', 'aaaaaaa1-aaaa-aaaa-aaaa-aaaaaaaaaaaa'),
  ('2025-03-12', 'pending', 'aaaaaaa2-aaaa-aaaa-aaaa-aaaaaaaaaaaa');

---- create above / drop below ----

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
