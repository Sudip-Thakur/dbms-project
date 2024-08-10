CREATE TABLE videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  videoLink VARCHAR(255),
  thumbnail VARCHAR(255),
  title VARCHAR(255),
  owner UUID REFERENCES users(id) ON DELETE CASCADE,
  description TEXT,
  duration INTEGER,
  views INTEGER,
  isPublished BOOLEAN,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
