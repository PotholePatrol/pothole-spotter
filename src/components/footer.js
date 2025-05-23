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
        </div>
        <div className="footer-dev">
            Developed by <span className="dev-name">Steven Muiruri</span> • Powered by Azure & React
        </div>
    </footer>
);
}

export default Footer;
