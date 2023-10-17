INSERT INTO monitor (endpoint_key, name, schedule, command, next_expected_at)
VALUES ('abcde', 'First monitor', '* * * * *', 'node index.js', CURRENT_TIMESTAMP);