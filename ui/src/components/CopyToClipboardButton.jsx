import { Button, Snackbar } from '@mui/material'
import { useState } from 'react'

const CopyToClipboardButton = ({ wrapper, onClose }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
    navigator.clipboard.writeText(wrapper);
  }
  
  return (
    <>
      <Button onClick={handleClick}>Copy</Button>
      <Snackbar
        open={open}
        onClose={() => {
          setOpen(false);
          onClose();
        }}
        autoHideDuration={500}
        message="Copied to clipboard"
      />
    </>
  )
}

export default CopyToClipboardButton;