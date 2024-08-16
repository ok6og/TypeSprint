import './Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faInstagram, faLinkedin } from '@fortawesome/free-brands-svg-icons';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; 2024 TypeSprint. Test your limits.</p>
                <div className="footer-links">
                    <a href="/">Home</a>
                    <a href="/about">About Us</a>
                    <a href="/contact">Contact</a>
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                    <a href="/FAQ">FAQ</a>
                </div>
                <div className="footer-social-icons">
                    <a href="https://twitter.com" aria-label="Twitter">
                        <FontAwesomeIcon icon={faTwitter} />
                    </a>
                    <a href="https://facebook.com" aria-label="Facebook">
                        <FontAwesomeIcon icon={faFacebook} />
                    </a>
                    <a href="https://instagram.com" aria-label="Instagram">
                        <FontAwesomeIcon icon={faInstagram} />
                    </a>
                    <a href="https://linkedin.com" aria-label="LinkedIn">
                        <FontAwesomeIcon icon={faLinkedin} />
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
