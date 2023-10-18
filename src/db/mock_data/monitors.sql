INSERT INTO monitor (endpoint_key, name, schedule, command, next_alert)
VALUES ('abcde', 'First monitor', '* * 3 * *', 'node index.js', CURRENT_TIMESTAMP),
('abcdef', 'Second monitor', '* * 3 * *', 'node index.js', CURRENT_TIMESTAMP),
('a', 'Third monitor', '* * 3 * *', 'node index.js', CURRENT_TIMESTAMP),
('ab', 'Fourth monitor', '* * 3 * *', 'node index.js', CURRENT_TIMESTAMP);
