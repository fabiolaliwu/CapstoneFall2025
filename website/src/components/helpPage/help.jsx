import { useState } from 'react';
import './help.css';
import linkedin_logo from './linkedin_logo.png';
import instagram_logo from './instagram_logo.jpg';
import Bar from '../homePage/bar'

function Help(){
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [type, setType] = useState('');
    const [message, setMessage] = useState('');
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch("http://localhost:4000/api/Contacts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, email, subject, type, message }),
            });

            if (!response.ok) throw new Error("Failed to submit form");

            // Reset form fields
            alert('Form submitted successfully!');
            setFullName('');
            setEmail('');
            setSubject('');
            setType('');
            setMessage('');
            
        } catch (err) {
            console.error('Error submitting form:', err);
            alert(`Error submitting form: ${err.message || 'Something went wrong'}`);
        }
    };

    return(
        <div className ='help-page'>
            <Bar />
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
                <form className='form' onSubmit={handleSubmit}>                
                    <input 
                        type="text" 
                        placeholder="Full Name" 
                        className='input-box' 
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)} 
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        className='input-box' 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <input 
                        type="text" 
                        placeholder="Subject" 
                        className='input-box' 
                        required 
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)} 
                    />
                    <select
                        className='input-box'
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        required
                    >
                        <option value="" disabled>Select Type</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Issue">Issue</option>
                        <option value="Other">Other</option>
                    </select>
                    <textarea 
                        placeholder="Message" 
                        className='input-box'
                        required
                        value={message}
                        onChange={(e) => setMessage(e.target.value)} 
                    ></textarea>  
                    <button type="submit" className='form-button'>Submit</button>                 
                </form>
            </div>
        </div>
    )
}
export default Help;


/**
 *  Citation: 
 *    - https://www.youtube.com/watch?v=n5XyBfKNqK4&t=1345s 
 *    - Referenced some code from incidentForm.jsx
 */
