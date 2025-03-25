-- Write your migrate up statements here

INSERT INTO users (name, email, password) VALUES
('John Doe', 'john@example.com', 'password123'),
('Jane Smith', 'jane@example.com', 'securepass');

INSERT INTO applications (title_application, company, sent_date, status, user_id) VALUES
('Développeur Backend', 'Google', '2025-03-01', 'sent', 1),
('Développeur Frontend', 'Facebook', '2025-03-05', 'pending', 2);

INSERT INTO reminders (reminder_date, status, application_id) VALUES
('2025-03-10', 'pending', 1),
('2025-03-12', 'pending', 2);

---- create above / drop below ----

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
