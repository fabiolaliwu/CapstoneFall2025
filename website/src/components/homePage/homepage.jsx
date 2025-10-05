import './homepage.css';
import Bar from './bar';
import Body from './body';
import Map from '../Map';
import Buttons from './buttons';

function Homepage() {
    return (
        <div className='homepage'>
            <div className = 'background'>
                <Map />
            </div>
            <div className='content'>
                <Bar />
            </div>
            <Buttons />
        </div>
    )
}
export default Homepage;
    