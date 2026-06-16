CREATE TABLE "t_p31668433_tron_music_label_sit"."users" (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  middle_name TEXT,
  role TEXT NOT NULL DEFAULT 'artist',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE "t_p31668433_tron_music_label_sit"."artists" (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES "t_p31668433_tron_music_label_sit"."users"(id),
  artist_name TEXT NOT NULL,
  genre TEXT,
  bio TEXT,
  photo_url TEXT,
  social_links TEXT,
  is_approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE "t_p31668433_tron_music_label_sit"."demo_requests" (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  middle_name TEXT,
  artist_name TEXT,
  email TEXT NOT NULL,
  genre TEXT,
  links TEXT,
  message TEXT,
  status TEXT DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE "t_p31668433_tron_music_label_sit"."subscribers" (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
