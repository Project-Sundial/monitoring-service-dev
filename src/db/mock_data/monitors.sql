INSERT INTO monitor (endpoint_key, name, schedule, command, next_expected_at)
VALUES ('abcde', 'First monitor', '* * * * *', 'node index.js', CURRENT_TIMESTAMP),
      ('a12b34', 'Second monitor', '1 * * * 2', 'echo "Hello Mary" >> /Users/mary/test/crontest.txt', CURRENT_TIMESTAMP);