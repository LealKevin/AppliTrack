
CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE applications (
    id UUID DEFAULT uuid_generate_v4() NOT NULL,
    title_application TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT NOT NULL,
    sent_date DATE NOT NULL,
    status TEXT CHECK (status IN ('sent', 'pending', 'rejected', 'interview_scheduled')),
    notes TEXT,
    url_application TEXT,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE reminders (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    reminder_date DATE NOT NULL,
    status TEXT CHECK (status IN ('pending', 'sent')),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

