import './signup.css';

function Signup(){
    return(
        <div className ='signup-page'>
            <div className='signup-box-background'>
                <div className='signup-title'>
                    Create Your Account
                </div>
                <div className='signup-description'>
                    Create posts and chat with fellow travelers!
                    <br></br>Stay in the loop by signing up today.
                </div>
                <form className='signup-form'>
                    <input type="text" placeholder="Full Name" className='name-input' required />
                    <input type="email" placeholder="Email" className='email-input' required />
                    <input type="password" placeholder="Password" className='password-input' required />

                    <button type="submit" className='signup-button'>Sign Up</button>
                </form>
                <div className='login-redirect'>
                    Already have an account? <a href="/login">Login!</a>
                </div>
            </div>
        </div>
    )
}

export default Signup;
