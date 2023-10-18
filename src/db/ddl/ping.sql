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
