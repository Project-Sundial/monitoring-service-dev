import { Box, Divider, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const DrawerList = ({ toggleDrawer }) => {
  const { clearToken } = useAuth();
  const navigate = useNavigate();

  const handleClickJobs = () => {
    toggleDrawer();
    navigate('/jobs');
  };

  const handleClickApiKeys = () => {
    toggleDrawer();
    navigate('/api-keys');
  };

  const handleClickLogout = () => {
    toggleDrawer();
    clearToken();
    navigate('/login');
  };

  return (
    <Box
      sx={{ width: 250 }}
      role="presentation"  
    >
      <List>
        <ListItem>
          <ListItemButton onClick={handleClickJobs}>
            <ListItemText primary="Jobs" />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemButton onClick={handleClickApiKeys}>
            <ListItemText primary="Machines" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem>
          <ListItemButton onClick={handleClickLogout}>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );
};

export default DrawerList;
