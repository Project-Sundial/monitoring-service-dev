import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { useState } from 'react';

const Popover = ({ title, content, open, onClose, primaryButtonLabel, secondaryButtonLabel, onPrimaryButtonClick, onSecondaryButtonClick }) => {

  return (
    <div>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
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

const PopoverButton = ({ onAction, heading, buttonName, onValidate }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleOpenConfirm = () => {
    if (onValidate) {
      if (onValidate()) {
        setIsConfirmOpen(true);
      } else {
        return;
      }
    }
    setIsConfirmOpen(true);
  }

  const handleAction = () => {
    onAction();
    setIsConfirmOpen(false);
  }

  const handleCancel = () => {
    setIsConfirmOpen(false);
  }

  return (
    <div >
      <Button variant="contained" onClick={handleOpenConfirm} >{buttonName}</Button>
      <Popover
        title={ heading }
        content="This action will modify your crontab."
        open={isConfirmOpen}
        onClose={handleCancel}
        primaryButtonLabel="Yes"
        secondaryButtonLabel="Cancel"
        onPrimaryButtonClick={handleAction}
        onSecondaryButtonClick={handleCancel}
      />
    </div>
  )
};

export default PopoverButton;