import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { ACCENT_COLOR, THEME_COLOR } from '../constants/colors';

const Popover = ({ title, content, open, onClose, primaryButtonLabel, secondaryButtonLabel, onPrimaryButtonClick, onSecondaryButtonClick }) => {
  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        PaperProps={{
          style: {
            backgroundColor: ACCENT_COLOR, // Set the background color
            color: THEME_COLOR, // Set the text color
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onSecondaryButtonClick}>{secondaryButtonLabel}</Button>
          <Button onClick={onPrimaryButtonClick}>{primaryButtonLabel}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Popover;
