import Navbar from './Navbar.tsx';
import { Outlet } from 'react-router-dom';
import Footer from './Footer.tsx';
function Layout() {
    return (
        <div>
            <Navbar />
            <main>
                <Outlet />
            </main>
            <Footer/>
        </div>
    );
}

export default Layout;