import { ListItem, ListItemButton, ListItemText, Typography } from '@mui/material';
import DeleteButton from './DeleteButton';
import nextRun from '../utils/nextRun';
import formatTime from "../utils/formatTime";

export const Monitor = ({ monitor, onDelete, onDisplayRuns }) => {
  // const sx = monitor.failing ?
  //   { bgcolor: "red" } :
  //   null;

  const alert = {
    backgroundColor: '#e64a19',
    color: 'white',
  };

  const okay = {
    backgroundColor: '#DCE775',
    color: '#616161',
  };

  const colorStyle = monitor.failing? alert : okay;

    return ( 
      <ListItem
        style={{
          ...colorStyle,
          borderRadius: '8px',
          margin: '8px 0',
          display: 'flex',
          alignItems: 'center',
          // height: '60px',
        }}
      >
      <ListItemButton onClick={() => onDisplayRuns(monitor.id)}>
      <ListItemText
        primary={
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: '120px', fontWeight: 'bold' }}>
                  {monitor.name || "Monitor"}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ width: '250px' }}>
                {"Next Expected At: "+ formatTime(nextRun(monitor.schedule))}
              </span>
            </div>
            
          </div>
        }
      />
      </ListItemButton>
       <DeleteButton onClick={() => onDelete(monitor.id)} />
    </ListItem>
    );
}
