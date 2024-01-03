import { useState } from 'react';
import { Button } from '@mui/material';
import Popover from './Popover';
import { ACCENT_COLOR, THEME_COLOR, MUTED_ACCENT } from '../constants/colors';

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
      <Button sx={{backgroundColor: MUTED_ACCENT, color: THEME_COLOR}} variant="contained" onClick={handleOpenConfirm} >{buttonName}</Button>
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
