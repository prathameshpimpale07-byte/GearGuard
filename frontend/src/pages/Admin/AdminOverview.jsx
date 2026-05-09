import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import './AdminOverview.css';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const AdminOverview = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('all'); // all, new, in-progress, critical

    // Dummy data for fallback
    const DUMMY_STATS = {
        counts: {
            totalUsers: 12,
            technicians: 5,
            activeEquipment: 45,
            openRequests: 8
        },
        charts: {
            status: [
                { _id: 'new', count: 3 },
                { _id: 'in-progress', count: 5 },
                { _id: 'repaired', count: 12 },
                { _id: 'scrap', count: 1 }
            ]
        },
        recentRequests: [
            { _id: '1', subject: 'Conveyor Halt', equipment: { name: 'Belt #4' }, assigned_technician: { name: 'John Doe' }, stage: 'new' },
            { _id: '2', subject: 'Pump Noise', equipment: { name: 'Pump A-1' }, assigned_technician: { name: 'Jane Smith' }, stage: 'in-progress' },
            { _id: '3', subject: 'Sensor Fail', equipment: { name: 'Sensor X' }, assigned_technician: { name: 'Bob Wilson' }, stage: 'repaired' },
            { _id: '4', subject: 'Motor Burnout', equipment: { name: 'Motor M5' }, assigned_technician: { name: 'Alice Brown' }, stage: 'scrap' },
            { _id: '5', subject: 'Hydraulic Leak', equipment: { name: 'Press P-9' }, assigned_technician: { name: 'Mike Ross' }, stage: 'new' }
        ]
    };

    const fetchStats = async () => {
        setLoading(true);
        try {
            // Simulate network delay for "interactive" feel
            await new Promise(resolve => setTimeout(resolve, 800));
            // Using the api utility which handles the base URL and headers
            const res = await api.get('/admin/stats');
            setStats(res.data.data);
            setError(null);
        } catch (err) {
            console.error('Failed to fetch admin stats', err);
            setStats(DUMMY_STATS);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading && !stats) return <div className="loading">Loading Admin Dashboard...</div>;

    const currentStats = stats || DUMMY_STATS;

    // Filter logic
    const filteredRequests = currentStats.recentRequests.filter(req => {
        if (filter === 'all') return true;
        if (filter === 'critical') return req.stage === 'scrap' || req.stage === 'new'; // defining critical as scrap or new/unattended
        return req.stage === filter;
    });

    // Prepare Chart Data
    const statusData = currentStats.charts.status.map(item => ({
        name: item._id.toUpperCase(),
        value: item.count
    }));

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>System overview and statistics</p>
                </div>
                <button onClick={fetchStats} className={`refresh-btn ${loading ? 'loading' : ''}`}>
                    🔄 {loading ? 'Refeshing...' : 'Refresh Data'}
                </button>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <StatCard title="Total Users" value={currentStats.counts.totalUsers} color="#3b82f6" />
                <StatCard title="Technicians" value={currentStats.counts.technicians} color="#6366f1" />
                <StatCard title="Active Equipment" value={currentStats.counts.activeEquipment} color="#22c55e" />
                <StatCard title="Open Requests" value={currentStats.counts.openRequests} color="#ef4444" />
            </div>

            <div className="dashboard-charts-grid">
                {/* Bar Chart: Request Status */}
                <div className="chart-card">
                    <h2 className="card-title">Request Status Distribution</h2>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statusData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip cursor={{ fill: 'transparent' }} />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" name="Requests" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity List */}
                <div className="activity-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 className="card-title" style={{ marginBottom: 0 }}>Recent Activity</h2>
                        <div className="section-header-actions">
                            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
                            <button className={`filter-btn ${filter === 'new' ? 'active' : ''}`} onClick={() => setFilter('new')}>New</button>
                            <button className={`filter-btn ${filter === 'in-progress' ? 'active' : ''}`} onClick={() => setFilter('in-progress')}>In Progress</button>
                            <button className={`filter-btn ${filter === 'critical' ? 'active' : ''}`} onClick={() => setFilter('critical')}>Critical</button>
                        </div>
                    </div>

                    <div className="table-container">
                        <table className="activity-table">
                            <thead>
                                <tr>
                                    <th>Subject</th>
                                    <th>Equipment</th>
                                    <th>Tech</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRequests.length > 0 ? (
                                    filteredRequests.map(req => (
                                        <tr key={req._id}>
                                            <td>{req.subject}</td>
                                            <td>{req.equipment?.name || 'N/A'}</td>
                                            <td>{req.assigned_technician?.name || 'Unassigned'}</td>
                                            <td>
                                                <span className={`status-badge status-${req.stage}`}>
                                                    {req.stage}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" style={{ textAlign: 'center', color: '#999', padding: '2rem' }}>No requests found for this filter.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, color }) => (
    <div className="stat-card" style={{ backgroundColor: color }}>
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
    </div>
);

export default AdminOverview;
