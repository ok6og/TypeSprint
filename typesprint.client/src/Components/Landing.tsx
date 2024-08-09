// LandingPage.tsx
import { useNavigate } from 'react-router-dom';
import './LandingPage.css'; // Import any specific styles for your landing page

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="landing-page">
            <header className="landing-header">
                <h1>Welcome to TypeSprinter</h1>
                <p>Improve your typing skills with fun and engaging typing tests.</p>
                <button onClick={() => navigate('/login')}>Login</button>
                <button onClick={() => navigate('/register')}>Register</button>
            </header>
        </div>
    );
}

export default LandingPage;
