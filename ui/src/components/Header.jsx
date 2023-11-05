import { Box, AppBar, Toolbar, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';
import { THEME_COLOR } from '../constants/colors';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate('/api-keys');
  }

  return (
    <div>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" sx={{ bgcolor: THEME_COLOR }}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              component="div"
              sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
            >
              sundial
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <Button key={'api-key'} sx={{ color: '#000' }} onClick={handleClick}>
                My API Keys
              </Button>
          </Box>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  )
}

export default Header;