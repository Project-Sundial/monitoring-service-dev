// import { Snackbar } from '@mui/material'; 
// import Popover from './Popover';
// import { useState } from 'react';

// const EndpointWrapper = ({ curlWrapper, open, onClose }) => {
//   const [snackbarOpen, setSnackbarOpen] = useState(false);

//   const handleCopyToClipboard = (wrapper) => {
//     setSnackbarOpen(true);
//     navigator.clipboard.writeText(wrapper);
//   };

//   return (
//     <div>
//       <Popover
//         title="Replace your cronjob with the below text in your crontab file:"
//         content={curlWrapper}
//         open={open}
//         onClose={onClose}
//         primaryButtonLabel="Close"
//         secondaryButtonLabel="Copy"
//         onPrimaryButtonClick={onClose}
//         onSecondaryButtonClick={() => handleCopyToClipboard(curlWrapper)}
//       />
//       <Snackbar
//         open={snackbarOpen}
//         onClose={() => {
//           setSnackbarOpen(false);
//           onClose();
//         }}
//         autoHideDuration={1000}
//         message="Copied to clipboard"
//       />
//     </div>
//   );
// }

// export default EndpointWrapper;

import { Snackbar } from '@mui/material'; 
import Popover from './Popover';
import { useState } from 'react';

const EndpointWrappers = ({ curlWrapper, cliWrapper, open, onClose }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleCopyToClipboard = (wrapper) => {
    setSnackbarOpen(true);
    navigator.clipboard.writeText(wrapper);
  };

  return (
    <div>
      <Popover
        title="If you haven't downloaded cli, replace your cronjob with the below text in your crontab file:"
        content={curlWrapper +'\n' + cliWrapper}
        open={open}
        onClose={onClose}
        primaryButtonLabel="Close"
        secondaryButtonLabel="Copy"
        onPrimaryButtonClick={onClose}
        onSecondaryButtonClick={() => handleCopyToClipboard(curlWrapper)}
      />
      <Snackbar
        open={snackbarOpen}
        onClose={() => {
          setSnackbarOpen(false);
          onClose();
        }}
        autoHideDuration={1000}
        message="Copied to clipboard"
      />
    </div>
  );
}

export default EndpointWrappers;
