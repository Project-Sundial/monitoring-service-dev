INSERT INTO monitor (endpoint_key, name, schedule, command, next_alert, realert_interval)
VALUES ('abcde', 'First monitor', '* * 3 * *', 'node index.js', CURRENT_TIMESTAMP, 5),
('abcdef', 'Second monitor', '* * 3 * *', 'node index.js', CURRENT_TIMESTAMP, 3),
('a', 'Third monitor', '* * 3 * *', 'node index.js', CURRENT_TIMESTAMP, 2),
('ab', 'Fourth monitor', '* * 3 * *', 'node index.js', CURRENT_TIMESTAMP, 1);
