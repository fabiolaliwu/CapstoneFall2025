import './bar.css';
import AddPost from './newPost/add_post'; 
import { Link, NavLink } from "react-router-dom"; 
import Logo from '/title.png'

function Bar(){
    return(
        <div className='bar'>
            <div className = 'logo'>
            <Link to="/home"><img src= {Logo} alt="Logo goes here"  /></Link> 
            </div>
            <div className ='information'>
                <div className='addpost'>
                    <AddPost />
                </div>
                <div className='login'>
                    <NavLink to="/login"  className={({ isActive }) => isActive ? 'active-link' : ''}>
                        Sign In
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