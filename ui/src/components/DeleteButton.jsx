import { Button } from '@mui/material';
import { Delete } from '@mui/icons-material';

const DeleteButton = ({ onDelete }) => {
  return (
    <Button onClick={onDelete} variant="outlined" startIcon={<Delete />}>
      Delete
    </Button>
  )
};

export default DeleteButton;