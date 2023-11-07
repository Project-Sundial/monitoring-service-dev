import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from './UserForm';
import { createUser } from '../services/users';

const CreateUserForm = ({ onAxiosError, addErrorMessage, addSuccessMessage }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleCreateUser = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    let userData = {
      username: username,
      password: password
    };
    try {
      await createUser(userData);
      addSuccessMessage('User added');
      navigate('/login');
    } catch (error) {
      onAxiosError(error);
    }
  };

  const validateForm = () => {
    if (username.length < 2) {
      addErrorMessage("Must have a username longer than 1 character.");
      return false;
    }

    if (password.length < 8) {
      addErrorMessage("Must have a password longer than 8 characters");
      return false;
  }
    return true;
  }

  return (
    <>
      <UserForm 
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          onSubmit={handleCreateUser}
          formName={'Create User'}/>
    </>
  )
};

export default CreateUserForm;