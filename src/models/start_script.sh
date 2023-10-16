#run with 'bash filename'

dropdb sundial
createdb sundial
psql -d sundial < monitor.sql
psql -d sundial < run.sql
psql -d sundial < ping.sql
