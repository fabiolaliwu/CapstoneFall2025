import './login.css';
import Bar from '../homePage/bar';
import { useState } from 'react';

function Login( {setCurrentUser} ) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage(''); // Clear previous messages

        try {
            const response = await fetch('http://localhost:4000/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setMessage(data.error || 'Invalid username or password');
            } else {
                setMessage(`Welcome back, ${data.user.username}!`);
                localStorage.setItem('token', data.token); // save jwt as token in local storage
                localStorage.setItem('user', JSON.stringify(data.user)); // save user info in local storage

                setCurrentUser(data.user);
                alert('Login successful! thank you');
            }
    
        } catch (error) {
            console.error('Error during login:', error);
            setMessage('Network error. Please try again.');
        }
    };


    return(
        <div className='login-page'>  
        <Bar />
            <div className ='login-section'>
                <div className='login-box-background'>
                    <div className='login-title'>
                        Welcome back!
                    </div>
                    <div className='login-description'>
                        Please enter your details.
                    </div>
                    <div className='message-container'>
                        {message && <div className='error-message'>{message}</div>}
                    </div>
                    <form className='login-form' onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            className='username-input' 
                            required 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className='password-input' 
                            required 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button 
                            type="submit" 
                            className='login-button'>Log In
                        </button>
                    </form>
                    <div className='signup-redirect'>
                        Don't have an account? If you want to create posts and chat with fellow travelers you should <a href="/signup">Sign Up!</a>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Login;
