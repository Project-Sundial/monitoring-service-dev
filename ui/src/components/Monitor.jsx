import { ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import DeleteButton from './DeleteButton';
import nextRun from '../utils/nextRun';
import formatTime from "../utils/formatTime";

export const Monitor = ({ monitor, onDelete, onDisplayRuns }) => {
  const sx = monitor.failing ?
    { bgcolor: "red" } :
    null;


    return ( 
      <ListItem
        style={{
          borderRadius: '8px',
          margin: '8px 0',
          display: 'flex',
          alignItems: 'center'
        }}
      >
      <ListItemButton onClick={() => onDisplayRuns(monitor.id)}>
      <ListItemText
        primary={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold' }}>
                <Typography variant="subtitle1">{monitor.name || "Monitor"}</Typography>
            </span>
            <span style={{ margin: '0 8px' }}>
              <Typography variant="subtitle1">Next Expected At: {formatTime(nextRun(monitor.schedule))}</Typography>
            </span>
          </div>
        }
      />
      
       </ListItemButton>
       <DeleteButton onClick={() => onDelete(monitor.id)} />
    </ListItem>
    );
}