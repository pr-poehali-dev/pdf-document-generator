CREATE TABLE IF NOT EXISTS saved_files (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    pdf_data TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);