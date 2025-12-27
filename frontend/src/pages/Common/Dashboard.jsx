import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Card from '../../components/UI/Card';
import './Dashboard.css';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalRequests: 0,
        newRequests: 0,
        inProgressRequests: 0,
        totalEquipment: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [requestsRes, equipmentRes] = await Promise.all([
                api.get('/requests'),
                api.get('/equipment')
            ]);

            const requests = requestsRes.data.data || [];
            const equipment = equipmentRes.data.data || [];

            setStats({
                totalRequests: requests.length,
                newRequests: requests.filter(r => r.stage === 'new').length,
                inProgressRequests: requests.filter(r => r.stage === 'in_progress').length,
                totalEquipment: equipment.length
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard">
            <div className="dashboard-header">
                <h1>Welcome back, {user?.name}! 👋</h1>
                <p className="dashboard-subtitle">Here's what's happening with your equipment today.</p>
            </div>

            <div className="stats-grid">
                <Card className="stat-card stat-card-primary">
                    <div className="stat-content">
                        <div className="stat-icon">📝</div>
                        <div>
                            <div className="stat-value">{stats.totalRequests}</div>
                            <div className="stat-label">Total Requests</div>
                        </div>
                    </div>
                </Card>

                <Card className="stat-card stat-card-info">
                    <div className="stat-content">
                        <div className="stat-icon">🆕</div>
                        <div>
                            <div className="stat-value">{stats.newRequests}</div>
                            <div className="stat-label">New Requests</div>
                        </div>
                    </div>
                </Card>

                <Card className="stat-card stat-card-warning">
                    <div className="stat-content">
                        <div className="stat-icon">⚙️</div>
                        <div>
                            <div className="stat-value">{stats.inProgressRequests}</div>
                            <div className="stat-label">In Progress</div>
                        </div>
                    </div>
                </Card>

                <Card className="stat-card stat-card-success">
                    <div className="stat-content">
                        <div className="stat-icon">🔧</div>
                        <div>
                            <div className="stat-value">{stats.totalEquipment}</div>
                            <div className="stat-label">Total Equipment</div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="dashboard-content">
                <Card title="Quick Actions">
                    <div className="quick-actions">
                        <a href="/requests" className="action-btn">
                            <span className="action-icon">📋</span>
                            <span>View Requests Board</span>
                        </a>
                        <a href="/equipment" className="action-btn">
                            <span className="action-icon">🏭</span>
                            <span>Manage Equipment</span>
                        </a>
                        <a href="/calendar" className="action-btn">
                            <span className="action-icon">📅</span>
                            <span>View Calendar</span>
                        </a>
                        <a href="/requests/create" className="action-btn">
                            <span className="action-icon">➕</span>
                            <span>Create Request</span>
                        </a>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default Dashboard;
