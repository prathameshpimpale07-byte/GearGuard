import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, logout, hasRole } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/dashboard" className="navbar-brand">
                    <span className="brand-icon">⚙️</span>
                    <span className="brand-text">GearGuard</span>
                </Link>

                <div className="navbar-menu">
                    <Link to="/dashboard" className="nav-link">Dashboard</Link>
                    <Link to="/equipment" className="nav-link">Equipment</Link>
                    <Link to="/requests" className="nav-link">Requests</Link>
                    <Link to="/calendar" className="nav-link">Calendar</Link>

                    {hasRole(['admin', 'manager']) && (
                        <Link to="/teams" className="nav-link">Teams</Link>
                    )}

                    {hasRole('admin') && (
                        <Link to="/admin" className="nav-link">Admin</Link>
                    )}
                </div>

                <div className="navbar-right">
                    <div className="user-menu">
                        <div className="user-avatar">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                            <span className="user-name">{user?.name}</span>
                            <span className="user-role">{user?.role}</span>
                        </div>
                        <button className="logout-btn" onClick={handleLogout}>
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
