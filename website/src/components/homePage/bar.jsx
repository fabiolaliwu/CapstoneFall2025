import './bar.css';
import AddPost from './newPost/add_post';  

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
                    about
                </div>
                <div className='help'>
                    help
                </div>
            </div>
        </div>
    )
}
export default Bar;