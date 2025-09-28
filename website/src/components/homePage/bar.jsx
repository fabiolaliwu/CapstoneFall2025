import './bar.css';
import AddPost from './newPost/add_post'; 
import { Link } from "react-router-dom"; 

function Bar(){
    return(
        <div className='bar'>
            <div className = 'logo'>
                stay in the loop
            </div>
            <div className ='information'>
                <div className='addpost'>
                    <AddPost />
                </div>
                <div className='about'>
                    <Link to="/about">About</Link>
                </div>
                <div className='help'>
                    <Link to="/help">Help</Link>                </div>
            </div>
        </div>
    )
}
export default Bar;