DROP TABLE IF EXISTS ping;

CREATE TYPE events AS ENUM ('started', 'completed');

CREATE TABLE ping (
  id serial,
  run_id integer,
  created timestamp NOT NULL,
  event events NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (run_id) REFERENCES run(id) ON DELETE CASCADE
);
