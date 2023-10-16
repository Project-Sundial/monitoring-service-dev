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
