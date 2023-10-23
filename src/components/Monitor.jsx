import { ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import generateCurl from '../utils/generateCurl';
import nextRun from '../utils/nextRun';

export const Monitor = ({ monitor, count }) => {
  const sx = monitor.failing ?
    { bgcolor: "red" } :
    null;

  return (
    <div>
      <ListItem disablePadding sx={sx}>
        <ListItemButton>
          <ListItemText 
            primaryTypographyProps={{ variant: 'h5', fontWeight: 'bold' }}
            secondary={
              <div>
                <Typography variant="subtitle1">Name: {monitor.name}</Typography>
                <Typography variant="subtitle1">Wrapper: {generateCurl(monitor)}</Typography>
                <Typography variant="subtitle1">Schedule: {monitor.schedule}</Typography>
                <Typography variant="subtitle1">Next Expected At: {nextRun(monitor.schedule)}</Typography>
                <Typography variant="subtitle1">Status: {monitor.failing ? 'Failed' : 'Running'}</Typography>
              </div>
            }
            primary={`Monitor #${count}`}
          />
        </ListItemButton>
      </ListItem>
    </div>
  )
}