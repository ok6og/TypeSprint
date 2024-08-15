import Navbar from './Navbar.tsx';
import { Outlet } from 'react-router-dom'; // To render child routes

function Layout() {
    return (
        <div>
            <Navbar />
            <main>
                <Outlet /> {/* Renders the matched route's component */}
            </main>
        </div>
    );
}

export default Layout;