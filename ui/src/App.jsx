import { useEffect } from 'react';
import { CssBaseline, createTheme, ThemeProvider} from '@mui/material'
import { Routes, Route, useNavigate } from 'react-router-dom';
import useTemporaryMessages from './hooks/useTemporaryMessages';
import ProtectedRoute from './components/ProtectedRoute';
import Header from './components/Header';
import MainPage from './components/MainPage';
import PaddedAlert from './components/PaddedAlert';
import CreateUserForm from './components/CreateUserForm';
import LoginForm from './components/LoginForm';
import { useAuth } from './context/AuthProvider';
import { THEME_COLOR, FONT_COLOR } from './constants/colors';
import { checkDBAdmin } from './services/users';
import APIKeyList from './components/APIKeyList';

const theme = createTheme({
  typography: {
    allVariants: {
      fontFamily: 'Lato, sans-serif',
    },
    body1: {
      color: FONT_COLOR,
      fontSize: 21,
    },
    body2: {
      color: FONT_COLOR,
      fontWeight: 500,
    },
  },
  palette: {
    primary: {
      main: THEME_COLOR,
    }
  }
});

const App = () => {
  const [errorMessages, addErrorMessage] = useTemporaryMessages(3000);
  const [successMessages, addSuccessMessage] = useTemporaryMessages(3000);
  const { token, clearToken } = useAuth();
  const navigate = useNavigate();

  const handleAxiosError = (error) => {
    console.log(error);
    let message = 'Something went wrong: ';
    if (error.response) {
      message += error.response.data.message;
      if (error.response.status === 401) {
        clearToken();
      }
    } else {
      message += error.message;
    }

    addErrorMessage(message);
  };

  // useEffect(() => {
  //   const handleInitialNavigate = async () => {
  //     try {
  //       if (token) {
  //         navigate('/jobs');
  //         return;
  //       }

  //       const adminExists = await checkDBAdmin();
  //       if (!adminExists) {
  //         navigate('/create-user');
  //         return;
  //       }

  //       navigate('/login');
  //     } catch(error) {
  //       handleAxiosError(error);
  //     }
  //   }

  //   handleInitialNavigate();
  // }, [token]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      {Object.keys(successMessages).map((message) => (
        <PaddedAlert key={message} severity="success" message={message} />
      ))}
      {Object.keys(errorMessages).map((message) => (
        <PaddedAlert key={message} severity="error" message={message} />
      ))}
      <Routes>
        <Route 
          path="/jobs/*" 
          element={<ProtectedRoute />}>
            <Route
              path="*"
              element={
                <MainPage
                  onAxiosError={handleAxiosError}
                  addErrorMessage={addErrorMessage}
                  addSuccessMessage={addSuccessMessage}
              />} 
            />
        </Route>
        <Route
          path="/api-keys"
          // element={<ProtectedRoute />}>
            element={
                <APIKeyList
                  onAxiosError={handleAxiosError}
                  addErrorMessage={addErrorMessage}
                  addSuccessMessage={addSuccessMessage}
              />} 
            />

        <Route 
          path="/login" 
          element={
            <LoginForm
              onAxiosError={handleAxiosError}
              addErrorMessage={addErrorMessage}
              addSuccessMessage={addSuccessMessage}
            />}
        />
        <Route 
          path="/create-user" 
          element={
            <CreateUserForm
              onAxiosError={handleAxiosError} 
              addErrorMessage={addErrorMessage}
              addSuccessMessage={addSuccessMessage}
            />}
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
