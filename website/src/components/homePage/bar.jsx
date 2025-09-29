import './bar.css';
import AddPost from './newPost/add_post'; 
import { Link, NavLink } from "react-router-dom"; 

function Bar(){
    return(
        <div className='bar'>
            <div className = 'logo'>
            <Link to="/">stay in the loop</Link> 
            </div>
            <div className ='information'>
                <div className='addpost'>
                    <AddPost />
                </div>
                <div className= 'signup'>
                    <NavLink to="/signup"  className={({ isActive }) => isActive ? 'active-link' : ''}>
                        Sign Up
                    </NavLink>
                </div>
                <div className='login'>
                    <NavLink to="/login"  className={({ isActive }) => isActive ? 'active-link' : ''}>
                        Log In
                    </NavLink>
                </div>
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