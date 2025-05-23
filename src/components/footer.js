import React from 'react';

function Footer() {
return (
    <footer className="footer">
        <div className="footer-content">
            <div>
                <h2 className="footer-title">Pothole Spotter</h2>
                <p className="footer-desc">Smart Infrastructure Monitoring System</p>
                <p className="footer-copyright">
                    © {new Date().getFullYear()} SmartRoads Project – All rights reserved
                </p>
            </div>
            <div className="footer-links">
                <a href="#about" className="footer-link">About</a>
                <a href="#contact" className="footer-link">Contact</a>
                <a href="#privacy" className="footer-link">Privacy</a>
            </div>
            <div className="footer-socials">
                <a href="https://x.com/Vi_brant_" target="_blank" rel="noopener noreferrer" className="footer-social-link">Twitter</a>
                <a href="https://github.com/StevenKariuki" target="_blank" rel="noopener noreferrer" className="footer-social-link">GitHub</a>
                <a href="https://www.linkedin.com/in/steven-muiruri-11b73a263/" target="_blank" rel="noopener noreferrer" className="footer-social-link">LinkedIn</a>
            </div>
        </div>
        <div className="footer-dev">
            Developed by <span className="dev-name">Steven Muiruri</span> • Powered by Azure & React
        </div>
    </footer>
);
}

export default Footer;
