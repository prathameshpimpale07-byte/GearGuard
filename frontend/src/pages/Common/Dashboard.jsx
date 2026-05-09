import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    LineChart, Line, XAxis, YAxis, CartesianGrid, BarChart, Bar
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Card from '../../components/UI/Card';
import { dummyStats, dummyRecentActivity, dummyCalendarRequests } from '../../utils/dummyData';
import './Dashboard.css';

const SystemHealthWidget = () => (
    <div className="system-health-card">
        <div className="health-header">
            <h3>System Status</h3>
            <span className="pulsing-dot"></span>
        </div>
        <div className="health-metrics">
            <div className="health-metric">
                <span className="metric-label">Server Load</span>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: '24%', background: '#10b981' }}></div>
                </div>
                <span className="metric-value">24%</span>
            </div>
            <div className="health-metric">
                <span className="metric-label">Database</span>
                <div className="status-badge-small status-success">Optimal</div>
            </div>
            <div className="health-metric">
                <span className="metric-label">API Latency</span>
                <span className="metric-value">45ms</span>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        totalRequests: 0,
        newRequests: 0,
        inProgressRequests: 0,
        totalEquipment: 0
    });
    const [chartData, setChartData] = useState([]);
    const [equipmentChartData, setEquipmentChartData] = useState([]);
    const [trendData, setTrendData] = useState([]); // New state for line chart
    const [recentActivity, setRecentActivity] = useState([]);
    const [upcomingMaintenance, setUpcomingMaintenance] = useState([]);
    const [loading, setLoading] = useState(true);

    const COLORS = ['#3b82f6', '#f59e0b', '#10b981', '#ef4444'];

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [requestsRes, equipmentRes, calendarRes] = await Promise.all([
                api.get('/requests').catch(() => ({ data: { data: [] } })),
                api.get('/equipment').catch(() => ({ data: { data: [] } })),
                api.get('/requests/calendar').catch(() => ({ data: { data: [] } }))
            ]);

            const requests = requestsRes.data.data;
            const equipment = equipmentRes.data.data;
            const calendarRequests = calendarRes.data.data;

            const hasData = (requests && requests.length > 0) || (equipment && equipment.length > 0);

            if (hasData) {
                // Calculate Stats
                setStats({
                    totalRequests: requests.length,
                    newRequests: requests.filter(r => r.stage === 'new').length,
                    inProgressRequests: requests.filter(r => r.stage === 'in_progress').length,
                    totalEquipment: equipment.length
                });

                // Calculate Chart Data (Pie)
                const stageCounts = requests.reduce((acc, curr) => {
                    acc[curr.stage] = (acc[curr.stage] || 0) + 1;
                    return acc;
                }, {});

                const chart = [
                    { name: 'New', value: stageCounts['new'] || 0 },
                    { name: 'In Progress', value: stageCounts['in_progress'] || 0 },
                    { name: 'Repaired', value: stageCounts['repaired'] || 0 },
                    { name: 'Scrap', value: stageCounts['scrap'] || 0 }
                ].filter(item => item.value > 0);

                setChartData(chart);

                // Calculate Equipment Chart Data
                const statusCounts = equipment.reduce((acc, curr) => {
                    acc[curr.status] = (acc[curr.status] || 0) + 1;
                    return acc;
                }, {});

                const equipChart = [
                    { name: 'Active', value: statusCounts['active'] || 0 },
                    { name: 'Maintenance', value: statusCounts['maintenance'] || 0 },
                    { name: 'Scrapped', value: statusCounts['scrapped'] || 0 }
                ];
                setEquipmentChartData(equipChart);

                // Upcoming Maintenance (Real)
                if (calendarRequests && calendarRequests.length > 0) {
                    setUpcomingMaintenance(calendarRequests.slice(0, 3));
                } else {
                    setUpcomingMaintenance(dummyCalendarRequests.slice(0, 3));
                }

            } else {
                console.log('Using dummy data for dashboard');
                setStats(dummyStats);
                setChartData([
                    { name: 'New', value: 3 },
                    { name: 'In Progress', value: 5 },
                    { name: 'Repaired', value: 2 },
                    { name: 'Scrap', value: 1 }
                ]);
                setEquipmentChartData([
                    { name: 'Active', value: 5 },
                    { name: 'Maintenance', value: 2 },
                    { name: 'Scrapped', value: 1 }
                ]);
                setUpcomingMaintenance(dummyCalendarRequests.slice(0, 3));
            }

            // Dummy Trend Data
            setTrendData([
                { day: 'Mon', created: 4, completed: 2 },
                { day: 'Tue', created: 3, completed: 4 },
                { day: 'Wed', created: 5, completed: 3 },
                { day: 'Thu', created: 2, completed: 5 },
                { day: 'Fri', created: 6, completed: 4 },
                { day: 'Sat', created: 1, completed: 1 },
                { day: 'Sun', created: 2, completed: 0 }
            ]);

            // Always use dummy for recent activity as we don't have an endpoint yet
            setRecentActivity(dummyRecentActivity);

        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setStats(dummyStats);
            setChartData([
                { name: 'New', value: 3 },
                { name: 'In Progress', value: 5 },
                { name: 'Repaired', value: 2 },
                { name: 'Scrap', value: 1 }
            ]);
            setEquipmentChartData([
                { name: 'Active', value: 5 },
                { name: 'Maintenance', value: 2 },
                { name: 'Scrapped', value: 1 }
            ]);
            setRecentActivity(dummyRecentActivity);
            setUpcomingMaintenance(dummyCalendarRequests.slice(0, 3));
            setTrendData([
                { day: 'Mon', created: 4, completed: 2 },
                { day: 'Tue', created: 3, completed: 4 },
                { day: 'Wed', created: 5, completed: 3 },
                { day: 'Thu', created: 2, completed: 5 },
                { day: 'Fri', created: 6, completed: 4 }
            ]);
        } finally {
            setLoading(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="dashboard fade-in">
            <div className="dashboard-header-modern">
                <div className="header-text">
                    <h1>{getGreeting()}, {user?.name.split(' ')[0]}!</h1>
                    <p className="dashboard-subtitle">Here's your operational overview for today.</p>
                </div>
                <SystemHealthWidget />
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

            <div className="dashboard-grid">
                <div className="main-content">
                    {/* Activity Trend Chart */}
                    <Card title="Activity Trend (Last 7 Days)">
                        <div className="chart-container">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="day" axisLine={false} tickLine={false} />
                                    <YAxis axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }} />
                                    <Legend />
                                    <Line type="monotone" dataKey="created" stroke="#8884d8" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Opened" />
                                    <Line type="monotone" dataKey="completed" stroke="#82ca9d" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} name="Completed" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <br />

                    <div className="chart-row-split">
                        <Card title="Request Status">
                            <div className="chart-container-small">
                                {chartData.length > 0 ? (
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={chartData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={45}
                                                outerRadius={70}
                                                fill="#8884d8"
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend wrapperStyle={{ fontSize: '12px' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                ) : (
                                    <div className="no-data">No data available</div>
                                )}
                            </div>
                        </Card>

                        <Card title="Quick Actions">
                            <div className="quick-actions-compact">
                                <Link to="/maintenance" className="action-btn-compact">
                                    <span className="action-icon-small">📋</span>
                                    <span>Requests</span>
                                </Link>
                                <Link to="/equipment" className="action-btn-compact">
                                    <span className="action-icon-small">🏭</span>
                                    <span>Equipment</span>
                                </Link>
                                <Link to="/maintenance/calendar" className="action-btn-compact">
                                    <span className="action-icon-small">📅</span>
                                    <span>Calendar</span>
                                </Link>
                                <Link to="/maintenance/create" className="action-btn-compact">
                                    <span className="action-icon-small">➕</span>
                                    <span>Create</span>
                                </Link>
                            </div>
                        </Card>
                    </div>

                    <br />

                    <Card title="Equipment Status Overview">
                        <div className="chart-container">
                            {equipmentChartData.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={equipmentChartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            ) : (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                    No data available to display chart
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="side-widgets">
                    <Card title="Upcoming Maintenance">
                        <div className="upcoming-list">
                            {upcomingMaintenance.map(item => (
                                <Link to={`/requests/${item._id}`} key={item._id} className="upcoming-item">
                                    <div className="upcoming-info">
                                        <h4>{item.subject}</h4>
                                        <span className="sub-text">
                                            {item.equipment?.name}
                                        </span>
                                    </div>
                                    <div className="upcoming-date">
                                        {new Date(item.scheduled_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                </Link>
                            ))}
                            {upcomingMaintenance.length === 0 && <p className="text-muted">No upcoming maintenance.</p>}
                        </div>
                    </Card>

                    <br />

                    <Card title="Recent Activity">
                        <div className="activity-list">
                            {recentActivity.map(activity => (
                                <div key={activity.id} className="activity-item">
                                    <div className="activity-avatar">
                                        {activity.user.charAt(0)}
                                    </div>
                                    <div className="activity-details">
                                        <p>
                                            <strong>{activity.user}</strong> {activity.action} <strong>{activity.target}</strong>
                                        </p>
                                        <div className="activity-time">{activity.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
