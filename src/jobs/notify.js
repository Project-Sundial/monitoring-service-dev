/*
algorithm:
- get monitors where next_expected_at < current_time
- write to a file for any such monitor with schedule data, 
when it was expected, command and name
*/

console.log('Querying the database and notifying users');
