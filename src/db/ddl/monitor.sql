DROP TABLE IF EXISTS monitor;

CREATE TABLE monitor (
  id serial,
  endpoint_key text UNIQUE NOT NULL,
  name text,
  schedule text NOT NULL,
  command text,
  active boolean NOT NULL DEFAULT true,
  failing boolean NOT NULL DEFAULT false,
  next_alert timestamp,
  realert_interval integer DEFAULT 480, -- mins
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  grace_period int NOT NULL DEFAULT 30, -- TESTING PURPOSES ONLY
  PRIMARY KEY (id)
);
