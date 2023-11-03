import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserForm from './UserForm';
import PropTypes from 'prop-types';

const LoginForm = ({onSubmitLoginForm, addErrorMessage, setToken}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    
    const handleSubmitForm = (event) => {
        event.preventDefault()
        const credentials = {
            username: username,
            password: password
        };
        
        navigate('/');
        return onSubmitLoginForm(credentials);
    }

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

LoginForm.propTypes = {
    setToken: PropTypes.func.isRequired
}

export default LoginForm;