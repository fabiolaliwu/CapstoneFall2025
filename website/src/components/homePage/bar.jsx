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