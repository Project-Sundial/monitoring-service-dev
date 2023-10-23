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

DROP TABLE IF EXISTS ping;

CREATE TYPE events AS ENUM ('started', 'completed');

CREATE TABLE ping (
  id serial,
  -- run_id integer,
  monitor_id integer,
  created timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- event events NOT NULL,
  PRIMARY KEY (id),
  -- FOREIGN KEY (run_id) REFERENCES run(id) ON DELETE CASCADE
  FOREIGN KEY (monitor_id) REFERENCES monitor (id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS run;

CREATE TYPE states AS ENUM ('started', 'completed', 'failed');

CREATE TABLE run (
  id serial,
  monitor_id integer NOT NULL,
  start_time integer NOT NULL,
  duration integer,
  state states NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (monitor_id) REFERENCES monitor(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS run;

CREATE TYPE states AS ENUM ('started', 'completed', 'failed');

CREATE TABLE run (
  id serial,
  run_token text NOT NULL,
  monitor_id integer NOT NULL,
  start_time integer NOT NULL,
  duration integer,
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
