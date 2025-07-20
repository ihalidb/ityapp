import { AppBar, Box, Button, Container, Toolbar, Typography, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Tooltip, Divider, useTheme, useMediaQuery } from '@mui/material';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import PeopleIcon from '@mui/icons-material/People';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { useState } from 'react';

export const Layout = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Menüdeki öğeler
  const menuItems = [
    {
      label: 'Yeni Talep',
      icon: <AddCircleOutlineIcon />, 
      to: '/requests/new',
      show: isAuthenticated,
    },
    {
      label: 'Kendi Taleplerim',
      icon: <ListAltIcon />,
      to: '/my-requests',
      show: isAuthenticated && user?.role !== 'admin',
    },
    {
      label: 'Kullanıcılar',
      icon: <PeopleIcon />, 
      to: '/admin/users',
      show: isAuthenticated && user?.role === 'admin',
    },
    {
      label: 'Roller',
      icon: <AssignmentIndIcon />, 
      to: '/admin/roles',
      show: isAuthenticated && user?.role === 'admin',
    },
    {
      label: 'Tüm Talepler',
      icon: <ListAltIcon />, 
      to: '/admin/requests',
      show: isAuthenticated && user?.role === 'admin',
    },
  ];

  // Drawer props
  const drawerWidth = drawerOpen ? 180 : 60;

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: drawerOpen ? 'flex-end' : 'center', p: 1 }}>
        <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
          <MenuIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.filter(item => item.show).map((item) => (
          <ListItem button key={item.label} component={RouterLink} to={item.to} sx={{ justifyContent: drawerOpen ? 'initial' : 'center', px: 2 }} onClick={() => isMobile && setDrawerOpen(false)}>
            <Tooltip title={drawerOpen || isMobile ? '' : item.label} placement="right">
              <ListItemIcon sx={{ minWidth: 0, mr: drawerOpen ? 2 : 'auto', justifyContent: 'center' }}>
                {item.icon}
              </ListItemIcon>
            </Tooltip>
            {(drawerOpen || isMobile) && <ListItemText primary={item.label} />}
          </ListItem>
        ))}
      </List>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <List>
        <ListItem button onClick={handleLogout} sx={{ justifyContent: drawerOpen ? 'initial' : 'center', px: 2 }}>
          <Tooltip title={drawerOpen || isMobile ? '' : 'Çıkış'} placement="right">
            <ListItemIcon sx={{ minWidth: 0, mr: drawerOpen ? 2 : 'auto', justifyContent: 'center' }}>
              <PeopleIcon />
            </ListItemIcon>
          </Tooltip>
          {(drawerOpen || isMobile) && <ListItemText primary="Çıkış" />}
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Hamburger Menü */}
      {isAuthenticated && (
        isMobile ? (
          <Drawer
            variant="temporary"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            ModalProps={{ keepMounted: true }}
            PaperProps={{
              sx: {
                width: 180,
                boxSizing: 'border-box',
              },
            }}
          >
            {drawerContent}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            open={drawerOpen}
            PaperProps={{
              sx: {
                width: drawerWidth,
                transition: 'width 0.2s',
                overflowX: 'hidden',
                boxSizing: 'border-box',
                whiteSpace: 'nowrap',
              },
            }}
          >
            {drawerContent}
          </Drawer>
        )
      )}
      {/* Üst Bar */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static" sx={{ ml: isAuthenticated && !isMobile ? `${drawerWidth}px` : 0, transition: 'margin-left 0.2s' }}>
          <Toolbar>
            {isAuthenticated && isMobile && (
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)} sx={{ mr: 2 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              <RouterLink to="/" style={{ color: 'white', textDecoration: 'none' }}>
                Talep Yönetimi
              </RouterLink>
            </Typography>
          </Toolbar>
        </AppBar>
        <Container component="main" sx={{ flex: 1, py: { xs: 1, sm: 3 }, px: { xs: 0.5, sm: 3 }, width: '100%' }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}; 