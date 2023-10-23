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
