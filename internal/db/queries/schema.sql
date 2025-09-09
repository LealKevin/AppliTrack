CREATE TABLE users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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
    status TEXT CHECK (status IN ('sent', 'pending', 'rejected', 'interview_scheduled', 'interviewing', 'offer')),
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
    status TEXT CHECK (status IN ('pending', 'completed ' )),
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

CREATE TABLE  rounds (                                                                                                                          
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,                                                                                            
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,                                                                
    title TEXT NOT NULL,                                                                                                                       
    type TEXT NOT NULL CHECK (type IN ('phone_screen', 'technical', 'final', 'onsite')),                                         
    status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'passed', 'failed')),                                                     
    date DATE NOT NULL,                                                                                                                                 
    notes TEXT NULL,                                                                                                                                
    interviewer TEXT NULL,                                                                                                                          
    duration TEXT NULL,                                                                                                                             
    outcome TEXT NULL,                                                                                                                              
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,                                                                                             
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,                                                                                             
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE                                                                 
);



