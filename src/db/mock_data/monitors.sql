INSERT INTO monitor (endpoint_key, name, schedule, command, next_alert, realert_interval)
VALUES ('abcde', 'First monitor', '* * * * *', 'node index.js', CURRENT_TIMESTAMP, 5);