CREATE PROCEDURE rotate_runs()
LANGUAGE SQL
BEGIN ATOMIC
    WITH selection AS (
        SELECT id, monitor_id, run_row_id
        FROM (
            SELECT id, monitor_id, ROW_NUMBER() OVER (PARTITION BY monitor_id ORDER BY id) as run_row_id
            FROM run
            GROUP BY monitor_id, id
        ) AS general
        WHERE monitor_id IN (SELECT monitor_id FROM run GROUP BY monitor_id HAVING COUNT(*) > 200) AND
        run_row_id < (SELECT COUNT(*) - 100 FROM run WHERE monitor_id = general.monitor_id)
        GROUP BY monitor_id, id, run_row_id
    )

    DELETE FROM run
    WHERE id IN (SELECT id FROM selection);

END;