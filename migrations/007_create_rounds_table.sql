-- Write your migrate up statements here

CREATE TABLE IF NOT EXISTS rounds (                                                                                                                          
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,                                                                                            
    application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,                                                                
    title TEXT NOT NULL,                                                                                                                       
    type TEXT NOT NULL CHECK (type IN ('phone_screen', 'technical', 'behavioral', 'final', 'onsite')),                                         
    status TEXT NOT NULL CHECK (status IN ('scheduled', 'completed', 'passed', 'failed')),                                                     
    date DATE,                                                                                                                                 
    notes TEXT,                                                                                                                                
    interviewer TEXT,                                                                                                                          
    duration TEXT,                                                                                                                             
    outcome TEXT,                                                                                                                              
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,                                                                                             
    updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,                                                                                             
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE                                                                 
);

---- create above / drop below ----

DROP TABLE IF EXISTS rounds;

-- Write your migrate down statements here. If this migration is irreversible
-- Then delete the separator line above.
