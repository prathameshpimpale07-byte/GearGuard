import { Link } from 'react-router-dom';
import './UnauthorizedPage.css';

const SessionExpiredPage = () => {
    return (
        <div className="error-page">
            <div className="error-content">
                <h1 className="error-code">⏱️</h1>
                <h2 className="error-title">Session Expired</h2>
                <p className="error-message">
                    Your session has expired. Please login again to continue.
                </p>
                <Link to="/login" className="back-link">
                    Go to Login
                </Link>
            </div>
        </div>
    );
};

export default SessionExpiredPage;
