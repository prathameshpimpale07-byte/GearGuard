import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const AdminOverview = () => {
    const { token } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const res = await axios.get('http://localhost:5000/api/admin/stats', config);
                setStats(res.data.data);
            } catch (err) {
                setError('Failed to fetch dashboard statistics.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, [token]);

    if (loading) return <div className="p-6 text-center">Loading Dashboard...</div>;
    if (error) return <div className="p-6 text-center text-red-500">{error}</div>;

    // Prepare Chart Data
    const statusData = stats.charts.status.map(item => ({
        name: item._id.toUpperCase(),
        value: item.count
    }));

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard title="Total Users" value={stats.counts.totalUsers} color="bg-blue-500" />
                <StatCard title="Technicians" value={stats.counts.technicians} color="bg-indigo-500" />
                <StatCard title="Active Equipment" value={stats.counts.activeEquipment} color="bg-green-500" />
                <StatCard title="Open Requests" value={stats.counts.openRequests} color="bg-red-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Bar Chart: Request Status */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Request Status Distribution</h2>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={statusData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#8884d8" name="Requests" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Activity List */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Recent Critical Activity</h2>
                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="pb-2">Subject</th>
                                    <th className="pb-2">Equipment</th>
                                    <th className="pb-2">Tech</th>
                                    <th className="pb-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentRequests.map(req => (
                                    <tr key={req._id} className="border-b hover:bg-gray-50">
                                        <td className="py-2 text-sm font-medium">{req.subject}</td>
                                        <td className="py-2 text-sm text-gray-600">{req.equipment?.name || 'N/A'}</td>
                                        <td className="py-2 text-sm text-gray-600">{req.assigned_technician?.name || 'Unassigned'}</td>
                                        <td className="py-2">
                                            <span className={`text-xs px-2 py-1 rounded-full ${req.stage === 'new' ? 'bg-blue-100 text-blue-800' :
                                                    req.stage === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                                                        req.stage === 'repaired' ? 'bg-green-100 text-green-800' :
                                                            'bg-red-100 text-red-800'
                                                }`}>
                                                {req.stage}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, color }) => (
    <div className={`${color} text-white p-6 rounded-lg shadow-lg`}>
        <h3 className="text-lg font-medium opacity-90">{title}</h3>
        <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
);

export default AdminOverview;
