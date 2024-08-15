import { Link } from 'react-router-dom';
import './Navbar.css';
import LogoutLink from '../Auth/LogoutLink.tsx';

function Navbar() {
    return (
        <nav className="navbar">
            <ul className="navbar-menu">
                <li><Link to="/">Home</Link></li>                
                <li><Link to="/source-management">Add Source</Link></li>
                <li><Link to="/quote-management">Add Quote</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><LogoutLink>Logout</LogoutLink></li>
            </ul>
        </nav>
    );
}

export default Navbar;
