#!/bin/bash

# Unless the sundial database exists and contains both monitor, run and ping tables, reset database

# if ! $(psql -lqt | cut -d \| -f 1 | grep -qw "sundial" && \
#        psql -d "sundial" -c "\dt" | grep -q "monitor" && \
#        psql -d "sundial" -c "\dt" | grep -q "ping" && \
#        psql -d "sundial" -c "\dt" | grep -q "run" ); then

  dropdb sundial
  createdb sundial
  psql -d sundial < ./ddl/monitor.sql
  psql -d sundial < ./ddl/run.sql
  psql -d sundial < ./ddl/ping.sql
  # psql -d sundial < ./mock_data/monitors.sql
# fi
