import './bar.css';
import AddPost from './newPost/add_post'; 
import { Link, NavLink } from "react-router-dom"; 
import Logo from '/title.png'

function Bar( {currentUser} ) {
    return(
        <div className='bar'>
            <div className = 'logo'>
            <Link to="/home"><img src= {Logo} alt="Logo goes here"  /></Link> 
            </div>
            <div className ='information'>
                <div className='addpost'>
                    <AddPost currentUser={currentUser} />
                </div>
                <NavLink to="/login" className="login">
                    Sign In
                </NavLink>
                <div className='about'>
                    <NavLink to="/about"  className={({ isActive }) => isActive ? 'active-link' : ''}>
                        About
                    </NavLink>
                </div>
                <div className='help'>
                    <NavLink to="/help"  className={({ isActive }) => isActive ? 'active-link' : ''}>
                        Help
                    </NavLink>                
                </div>
            </div>
        </div>
    )
}
export default Bar;