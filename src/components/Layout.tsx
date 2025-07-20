import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { Link as RouterLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Layout = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <RouterLink to="/" style={{ color: 'white', textDecoration: 'none' }}>
              Talep Yönetimi
            </RouterLink>
          </Typography>
          {isAuthenticated && (
            <Box>
              <Button
                component={RouterLink}
                to="/requests/new"
                color="inherit"
                sx={{ mr: 2 }}
              >
                Yeni Talep
              </Button>
              {user?.role === 'admin' && (
                <>
                  <Button
                    component={RouterLink}
                    to="/admin/users"
                    color="inherit"
                    sx={{ mr: 2 }}
                  >
                    Kullanıcılar
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/admin/roles"
                    color="inherit"
                    sx={{ mr: 2 }}
                  >
                    Roller
                  </Button>
                  <Button
                    component={RouterLink}
                    to="/admin/requests"
                    color="inherit"
                    sx={{ mr: 2 }}
                  >
                    Tüm Talepler
                  </Button>
                </>
              )}
              <Button color="inherit" onClick={handleLogout}>
                Çıkış
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ flex: 1, py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}; 