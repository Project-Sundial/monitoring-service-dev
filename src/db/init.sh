#run with 'bash filename'

dropdb sundial
createdb sundial
psql -d sundial < ./ddl/monitor.sql
psql -d sundial < ./ddl/run.sql
psql -d sundial < ./ddl/ping.sql
