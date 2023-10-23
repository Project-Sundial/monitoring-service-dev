import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material'; 
import CopyToClipboardButton from './CopyToClipboardButton.jsx';

const WrapperPopover = ({ wrapper, open, handleClose }) => {
  return ( 
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Replace your cronjob with the below text in your crontab file:"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {wrapper}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
          <CopyToClipboardButton wrapper={wrapper} handleClose={handleClose} autoFocus/>
        </DialogActions>
      </Dialog>
    </div>
  );
}
 
export default WrapperPopover;