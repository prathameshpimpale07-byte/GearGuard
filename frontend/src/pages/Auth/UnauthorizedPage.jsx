import { Link } from 'react-router-dom';
import './UnauthorizedPage.css';

const UnauthorizedPage = () => {
    return (
        <div className="error-page">
            <div className="error-content">
                <h1 className="error-code">403</h1>
                <h2 className="error-title">Access Denied</h2>
                <p className="error-message">
                    You don't have permission to access this page.
                </p>
                <Link to="/dashboard" className="back-link">
                    Go to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default UnauthorizedPage;
