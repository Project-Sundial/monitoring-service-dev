import { useState } from 'react';
import UserForm from './UserForm';

const LoginForm = ({ onSubmitLoginForm }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmitForm = (event) => {
    event.preventDefault();
    const credentials = {
      username: username,
      password: password
    };
    
    setPassword('');
    onSubmitLoginForm(credentials);
  };

  return (
    <div className='login-wrapper'>
      <UserForm 
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        onSubmit={handleSubmitForm}
        formName={'Please Log In'}
      />
    </div>
  )
};

export default LoginForm;