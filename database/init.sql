DROP TABLE IF EXISTS monitor;

CREATE TYPE states AS ENUM ('active', 'pending', 'failed');

CREATE TABLE monitor (
  id serial,
  endpoint_key text UNIQUE NOT NULL,
  name text,
  schedule text NOT NULL,
  command text,
  active boolean NOT NULL DEFAULT true,
  state states NOT NULL DEFAULT 'pending',
  next_alert timestamp,
  realert_interval integer DEFAULT 480, -- mins
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  grace_period int NOT NULL DEFAULT 30, -- TESTING PURPOSES ONLY
  PRIMARY KEY (id)
);

DROP TABLE IF EXISTS run;

CREATE TYPE states AS ENUM ('started', 'completed', 'failed');

CREATE TABLE run (
  id serial,
  run_token text NOT NULL UNIQUE,
  monitor_id integer NOT NULL,
  time timestamp,
  duration interval,
  state states NOT NULL,
  PRIMARY KEY (run_token),
  FOREIGN KEY (monitor_id) REFERENCES monitor(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS ping;

CREATE TYPE events AS ENUM ('start', 'end');

CREATE TABLE ping (
  id serial,
  run_token text NOT NULL,
  send_time timestamp NOT NULL,
  event events NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (run_token) REFERENCES run(run_token) ON DELETE CASCADE
);
