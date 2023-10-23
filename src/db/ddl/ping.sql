DROP TABLE IF EXISTS ping;

CREATE TYPE events AS ENUM ('start', 'end');

CREATE TABLE ping (
  id serial,
  run_token text NOT NULL,
  monitor_id integer,
  send_time timestamp NOT NULL,
  event events NOT NULL,
  PRIMARY KEY (id),
  FOREIGN KEY (run_token) REFERENCES run(run_token) ON DELETE CASCADE
);
