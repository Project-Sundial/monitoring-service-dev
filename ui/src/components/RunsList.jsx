import React from 'react';
import { List, ListItem, ListItemText, Box, Typography } from '@mui/material';

const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  marginTop: '20px',
  maxWidth: '80%',
  padding: '40px',
};

const boxStyle = {
  width: '100%', 
  padding: '40px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
  borderRadius: '8px',
  backgroundColor: '#BDBDBD'
};

const headerStyle = {
  marginBottom: '20px',
};

const greenStyle = {
  backgroundColor: '#DCE775',
  color: '#616161',
};

const redStyle = {
  backgroundColor: '#EF5350',
  color: 'white',
};

const yellowStyle = {
  backgroundColor: '#FFA000',
};

const RunsList = ({ runData }) => {
  const { monitor, runs } = runData;

  const color = 'green'

  const itemColorStyle =
  color === 'green'
    ? greenStyle
    : color === 'red'
    ? redStyle
    : color === 'yellow'
    ? yellowStyle
    : {};

  return (
    <div style={containerStyle}>
      <Box component="div" style={boxStyle}>
        <Typography variant="h4" style={headerStyle}>
          {monitor.name || 'Monitor'}
        </Typography>
        <List>
          {runs.map((run) => (
            <div key={run.id}>
              <ListItem style={{...itemColorStyle, borderRadius: '8px',  margin: '8px 0'}} >
                <ListItemText primary={run.state} secondary={run.time} />
              </ListItem>
              {runs.indexOf(run) < runs.length - 1}
            </div>
          ))}
        </List>
      </Box>
    </div>
  );
};

export default RunsList;
