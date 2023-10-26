CREATE EXTENSION pgcrypto;

DROP TABLE IF EXISTS monitor;

CREATE TYPE types AS ENUM ('solo', 'dual');

CREATE TABLE monitor (
  id serial,
  endpoint_key text UNIQUE NOT NULL,
  name text,
  schedule text NOT NULL,
  command text,
  active boolean NOT NULL DEFAULT true,
  failing boolean NOT NULL DEFAULT false,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  tolerable_runtime int NOT NULL DEFAULT 25,
  grace_period int NOT NULL DEFAULT 30, -- TESTING PURPOSES ONLY
  type types NOT NULL DEFAULT 'solo',
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS run;

CREATE TYPE states AS ENUM ('started', 'completed', 'failed', 'unresolved', 'no_start', 'solo_completed', 'missed');

CREATE TABLE run (
  id serial,
  monitor_id integer NOT NULL,
  run_token text,
  time timestamp NOT NULL,
  duration interval,
  state states NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (monitor_id) REFERENCES monitor(id) ON DELETE CASCADE
);

-- DROP TABLE IF EXISTS ping;

-- CREATE TYPE events AS ENUM ('starting', 'ending', 'failing', 'solo');

-- CREATE TABLE ping (
--   id serial,
--   run_id integer NOT NULL,
--   run_token text,
--   send_time timestamp NOT NULL,
--   event events NOT NULL,
--   PRIMARY KEY (id),
--   FOREIGN KEY (run_id) REFERENCES run(id) ON DELETE CASCADE
-- );
