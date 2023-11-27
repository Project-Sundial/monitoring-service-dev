import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from './UserForm';
import { useAuth } from '../context/AuthProvider';
import { logInUser } from '../services/users';

const LoginForm = ({ onAxiosError, addErrorMessage, addSuccessMessage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { setToken } = useAuth();
  const navigate = useNavigate();
  
  const handleLogin = async (event) => {
    event.preventDefault();

    setPassword('');
    const credentials = {
      username: username,
      password: password
    };
    try {
      let result = await logInUser(credentials);
      if (result.token) {
        setToken(result.token);
        addSuccessMessage('Logged in');
        navigate('/jobs');
      } else {
        addErrorMessage('Incorrect credentials')
      }
    } catch(error) {
      onAxiosError(error);
    }
  }

  return (
    <div className='login-wrapper'>
      <UserForm 
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        onSubmit={handleLogin}
        formName={'Please Log In'}
      />
    </div>
  )
};

export default LoginForm;