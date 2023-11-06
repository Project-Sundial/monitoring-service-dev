import { useState, useEffect } from 'react';
import { CssBaseline, createTheme, ThemeProvider} from '@mui/material'
import { Routes, Route, useNavigate } from 'react-router-dom';
import useTemporaryMessages from './hooks/useTemporaryMessages';
import Header from './components/Header';
import PaddedAlert from './components/PaddedAlert';
import CreateUserForm from './components/CreateUserForm';
import LoginForm from './components/LoginForm';
import { THEME_COLOR, FONT_COLOR } from './constants/colors';
import { createUser, logInUser, checkDBAdmin } from './services/users';
import { setToken } from './services/config';
import MainPage from './components/MainPage';

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
  const navigate = useNavigate();

  const handleAxiosError = (error) => {
    console.log(error);
    let message = 'Something went wrong: ';
    if (error.response) {
      message += error.response.data.message;
      if (error.response.status === 401) {
        window.localStorage.removeItem('loggedSundialUser');
        navigate('/login');
      }
    } else {
      message += error.message;
    }

    addErrorMessage(message);
  };

  useEffect(() => {
    const handleInitialNavigate = async () => {
      try {
        const adminExists = await checkDBAdmin();
        if (!adminExists) {
          navigate('/create-user');
          return;
        }

        const loggedUserJson = window.localStorage.getItem('loggedSundialUser');
        if (!loggedUserJson) {
          navigate('/login');
          return;
        }

        const token = JSON.parse(loggedUserJson);
        setToken(token);
        navigate('/jobs');
      } catch(error) {
        handleAxiosError(error);
      }
    }

    handleInitialNavigate();
  }, []);

  const handleCreateUser = async (userData) => {
    try {
      await createUser(userData);
      addSuccessMessage('User added');
      navigate('/login');
    } catch (error) {
      handleAxiosError(error);
    }
  };

  const handleLogin = async (credentials) => {
    try {
      let result = await logInUser(credentials);
      if (result.token) {
        window.localStorage.setItem('loggedSundialUser', JSON.stringify(result.token));
        setToken(result.token);
        addSuccessMessage('Logged in');
        navigate('/jobs');
      } else {
        addErrorMessage('Incorrect credentials')
      }
    } catch(error) {
      handleAxiosError(error);
    }
  }

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
          element={
            <MainPage
              onAxiosError={handleAxiosError}
              addErrorMessage={addErrorMessage}
              addSuccessMessage={addSuccessMessage}
            />}
        />
        <Route 
          path="/login" 
          element={
            <LoginForm
              onSubmitLoginForm={handleLogin}
            />}
        />
        <Route 
          path="/create-user" 
          element={
            <CreateUserForm
              onSubmitCreateUserForm={handleCreateUser} 
              addErrorMessage={addErrorMessage}
            />}
        />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
