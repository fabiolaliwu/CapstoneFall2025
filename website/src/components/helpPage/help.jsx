import './help.css';
import linkedin_logo from './linkedin_logo.png';
import instagram_logo from './instagram_logo.jpg';


function Help(){
    return(
        <div className ='help-page'>
            <div className='left-container'>
                <div className='help-title'>
                Contact Us
                </div>
                <div className='help-description'>
                    Have feedback or run into an issue? We’d love to hear from you.
                </div>
                <div className='help-logo-container'>
                    <img src={linkedin_logo} alt="Logo" className="help-logo" />
                    <img src={instagram_logo} alt="Logo" className="help-logo" />
                </div>
            </div>

            <div className='right-container'>
                <form className='form'>                
                    <input type="text" placeholder="Full Name" className='input-box' required />
                    <input type="email" placeholder="Email" className='input-box' required />
                    <input type="text" placeholder="Subject" className='input-box' required />
                    <textarea type="text" placeholder="Message" className='input-box'></textarea>  
                    <div className='form-button'>
                        <button type="submit">Submit</button>
                    </div>                   
                </form>
            </div>
        </div>
    )
}
export default Help;
