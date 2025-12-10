import './signup.css';
import Bar from '../homePage/bar';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logger from "../../logger";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const safeBaseUrl = API_BASE_URL.replace(/\/$/, '');

function Signup(){
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            setMessage('Please fill in all fields');
            return;
        }

        if (password.length < 6) {
            setMessage('Password must be at least 6 characters long');
            return;
        }

        setMessage(''); // Clear previous messages

        try {
            const response = await fetch(`${safeBaseUrl}/api/users/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Signup failed
                setMessage(data.error || 'Signup failed');
                logger.warn(`Signup failed for username: ${username}. Reason: ${data.error}`);
            } else {
                // Signup succeeded
                setMessage(`Account created! Welcome, ${data.user.username}`);
                // alert('Account created successfully! You can now log in.');
                navigate('/login');
                logger.info(`New user signed up: ${data.user.username}`);

            }
        } catch (error) {
            console.error('Error during signup:', error);
            logger.error(`Signup error: ${error.message}`);
            setMessage('An error occurred. Please try again.');
        }
    };

    return(
        <div className ='signup-page'>
            <Bar />
            <div className='signup-section'>
                <div className='signup-box-background'>
                    <div className='signup-title'>
                        Create Your Account
                    </div>
                    <div className='signup-description'>
                        Create posts and chat with fellow travelers!
                        <br></br>Stay in the loop by signing up today.
                    </div>
                    <div className='message-container'>
                        {message && <div className='error-message'>{message}</div>}
                    </div>

                    <form className='signup-form' onSubmit={handleSubmit}>
                        <input 
                            type="text" 
                            placeholder="Username" 
                            className='username-input' 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required 
                        />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            className='password-input' 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required 
                        />
                        <button type="submit" className='signup-button'>Sign Up</button>
                    </form>
                    <div className='login-redirect'>
                        Already have an account? <a href="/login">Login!</a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup;