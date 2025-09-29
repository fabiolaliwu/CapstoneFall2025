import './login.css';
import Bar from '../homePage/bar';


function Login(){
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
                    <form className='login-form'>
                        <input type="email" placeholder="Email" className='email-input' required />
                        <input type="password" placeholder="Password" className='password-input' required />
                        <div className='forgot-password'>
                            <a href="/reset-password">Forgot Password?</a> 
                            {/* not sure about creating this feature */}
                        </div>
                        <button type="submit" className='login-button'>Log In</button>
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
