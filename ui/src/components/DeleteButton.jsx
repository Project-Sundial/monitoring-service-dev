import { Button } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { useState } from 'react';
import Popover from './Popover';

const DeleteButton = ({ onDelete }) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleOpenConfirm = () => {
    setIsConfirmOpen(true);
  }

  const handleDelete = () => {
    console.log(onDelete)
    onDelete();
    setIsConfirmOpen(false);
  }

  const handleCancel = () => {
    setIsConfirmOpen(false);
  }

  return (
    <div >
      <Button variant="contained" id="delete-button" onClick={handleOpenConfirm} startIcon={<Delete sx={{ fontSize: '18px', margin: '5px' }}/>}>DELETE</Button>
      <Popover
        title="Are you sure you want to delete?"
        content="Remember to remove the monitor wrapper from your crontab."
        open={isConfirmOpen}
        onClose={handleCancel}
        primaryButtonLabel="Yes"
        secondaryButtonLabel="Cancel"
        onPrimaryButtonClick={handleDelete}
        onSecondaryButtonClick={handleCancel}
      />
    </div>
  )
};

export default DeleteButton;