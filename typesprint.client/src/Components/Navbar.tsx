import { Link } from 'react-router-dom';
import './Navbar.css'; // Add styles for your navbar here
import LogoutLink from './LogoutLink.tsx';

function Navbar() {
    return (
        <nav className="navbar">
            <ul className="navbar-menu">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/add-quote">Add Quote</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><LogoutLink>Logout</LogoutLink></li>
            </ul>
        </nav>
    );
}

export default Navbar;
