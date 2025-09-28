import './homepage.css';
import Bar from './bar';
import Body from './body';
import Map from '../Map';

function Homepage() {
    return (
        <div className='homepage'>
            <div className = 'background'>
                <Map />
            </div>
            <div className='content'>
                <Bar />
                <Body />
            </div>
        </div>
    )
}
export default Homepage;
    