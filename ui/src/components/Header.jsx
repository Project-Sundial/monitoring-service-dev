import { Box, AppBar, Toolbar, Typography, Drawer } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { THEME_COLOR, ACCENT_COLOR} from '../constants/colors';
import { useState } from 'react';
import DrawerList from './DrawerList';

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(drawerOpen => !drawerOpen);
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ bgcolor: THEME_COLOR }}>
          <Toolbar style={{ marginLeft: 10, paddingLeft: 20 }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ fontSize: '20rem', mr: 2, color: ACCENT_COLOR }}
              onClick={toggleDrawer}
            >
              <MenuIcon />
            </IconButton >
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={toggleDrawer}
              PaperProps={{
                style: {
                  backgroundColor: THEME_COLOR,
                },
              }}
            >
            <DrawerList toggleDrawer={toggleDrawer} />
            </Drawer>
            <img
              src={process.env.PUBLIC_URL + '/logo.png'}
              alt="Logo"
              style={{ width: '120px', height: '120px' }}
            />
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  )
}

export default Header;