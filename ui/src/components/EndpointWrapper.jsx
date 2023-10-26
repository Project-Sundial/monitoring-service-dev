import { Snackbar } from '@mui/material'; 
import Popover from './Popover';
import { useState } from 'react';

const EndpointWrapper = ({ wrapper, open, onClose }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCopyToClipboard = () => {
    setSnackbarOpen(true);
    navigator.clipboard.writeText(wrapper);
  };

  return (
    <div>
      <Popover
        title="Replace your cronjob with the below text in your crontab file:"
        content={wrapper}
        open={open}
        onClose={onClose}
        primaryButtonLabel="Close"
        secondaryButtonLabel="Copy"
        onPrimaryButtonClick={onClose}
        onSecondaryButtonClick={handleCopyToClipboard}
      />
      <Snackbar
        open={snackbarOpen}
        onClose={() => {
          setSnackbarOpen(false);
          onClose();
        }}
        autoHideDuration={500}
        message="Copied to clipboard"
      />
    </div>
  );
}

export default EndpointWrapper;