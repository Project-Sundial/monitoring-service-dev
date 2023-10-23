import { Alert, Box } from "@mui/material";

const PaddedAlert = ({ severity, message }) => {
  return (
    <Box my={2}>
      <Alert severity={severity}>{message}</Alert>
    </Box>
  );
};

export default PaddedAlert;
