import {Box, List} from '@mui/material';
import { Monitor } from './Monitor';

const MonitorsList = ({ monitors, onDelete }) => {
  return (
    <div>
      <h1>Monitors</h1>
      <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        <nav aria-label="main mailbox folders">
          <List>
              {monitors.map((monitor, ind) => 
                <Monitor 
                  key={monitor.id} 
                  monitor={monitor} 
                  count={ind + 1}
                  onDelete={onDelete} />
              )}
          </List>
        </nav>
      </Box>
    </div>
  )
}

export default MonitorsList;