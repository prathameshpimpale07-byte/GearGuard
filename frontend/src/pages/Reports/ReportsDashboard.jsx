import React, { useState, useEffect } from 'react';
import api from '../../utils/api';
import './ReportsDashboard.css';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, Legend, PieChart, Pie, Cell
} from 'recharts';

const ReportsDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('30d'); // 7d, 30d, 1y
    const [selectedFaultType, setSelectedFaultType] = useState(null);

    // Robust dummy data sets for simulation
    const MOCK_DATA = {
        '7d': {
            kpi: { totalMaintenanceCost: 2400, avgRepairTime: 3.2, completedRequests: 14, preventiveCompliance: 98 },
            costOverTime: [
                { match: 'Mon', cost: 300 }, { match: 'Tue', cost: 450 }, { match: 'Wed', cost: 200 },
                { match: 'Thu', cost: 600 }, { match: 'Fri', cost: 350 }, { match: 'Sat', cost: 150 }, { match: 'Sun', cost: 350 }
            ],
            faultsByType: [
                { name: 'Electrical', value: 3 }, { name: 'Mechanical', value: 5 }, { name: 'Hydraulic', value: 1 }, { name: 'Software', value: 1 }
            ],
            requestsByTeam: [
                { name: 'Alpha', completed: 5, open: 1 }, { name: 'Beta', completed: 4, open: 2 }, { name: 'Gamma', completed: 5, open: 0 }
            ]
        },
        '30d': {
            kpi: { totalMaintenanceCost: 12500, avgRepairTime: 4.5, completedRequests: 86, preventiveCompliance: 92 },
            costOverTime: [
                { match: 'Week 1', cost: 2500 }, { match: 'Week 2', cost: 3200 }, { match: 'Week 3', cost: 2800 }, { match: 'Week 4', cost: 4000 }
            ],
            faultsByType: [
                { name: 'Electrical', value: 12 }, { name: 'Mechanical', value: 18 }, { name: 'Hydraulic', value: 6 }, { name: 'Software', value: 4 }
            ],
            requestsByTeam: [
                { name: 'Alpha', completed: 24, open: 4 }, { name: 'Beta', completed: 18, open: 7 }, { name: 'Gamma', completed: 30, open: 2 }
            ]
        },
        '1y': {
            kpi: { totalMaintenanceCost: 145000, avgRepairTime: 5.1, completedRequests: 1042, preventiveCompliance: 89 },
            costOverTime: [
                { match: 'Jan', cost: 12000 }, { match: 'Feb', cost: 15000 }, { match: 'Mar', cost: 11000 }, { match: 'Apr', cost: 14000 },
                { match: 'May', cost: 9000 }, { match: 'Jun', cost: 22000 }, { match: 'Jul', cost: 13000 }, { match: 'Aug', cost: 16000 },
                { match: 'Sep', cost: 14000 }, { match: 'Oct', cost: 18000 }, { match: 'Nov', cost: 12000 }, { match: 'Dec', cost: 19000 }
            ],
            faultsByType: [
                { name: 'Electrical', value: 120 }, { name: 'Mechanical', value: 250 }, { name: 'Hydraulic', value: 80 }, { name: 'Software', value: 45 }
            ],
            requestsByTeam: [
                { name: 'Alpha', completed: 350, open: 12 }, { name: 'Beta', completed: 290, open: 15 }, { name: 'Gamma', completed: 402, open: 8 }
            ]
        }
    };

    // Dummy drill-down data
    const DRILL_DOWN_DATA = {
        'Electrical': [
            { id: 101, equip: 'Motor A1', issue: 'Short Circuit', cost: 200 },
            { id: 102, equip: 'Panel B', issue: 'Fuse Blown', cost: 50 }
        ],
        'Mechanical': [
            { id: 201, equip: 'Conv Belt', issue: 'Bearing Fail', cost: 450 },
            { id: 202, equip: 'Pump P3', issue: 'Leakage', cost: 300 }
        ],
        'Hydraulic': [
            { id: 301, equip: 'Press H1', issue: 'Pressure Loss', cost: 800 }
        ],
        'Software': [
            { id: 401, equip: 'PLC Unit', issue: 'Firmware Bug', cost: 0 }
        ]
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    useEffect(() => {
        // Simulate API fetch delay when filter changes
        setLoading(true);
        setTimeout(() => {
            setStats(MOCK_DATA[timeRange]);
            setLoading(false);
            setSelectedFaultType(null); // Reset drilldown on range change
        }, 600);
    }, [timeRange]);

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(stats));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `report_${timeRange}.json`);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const handlePieClick = (data) => {
        setSelectedFaultType(data.name === selectedFaultType ? null : data.name);
    };

    if (loading) return <div className="loading">Updating Analytics...</div>;

    const currentStats = stats || MOCK_DATA['30d'];

    return (
        <div className="reports-dashboard">
            <div className="reports-header-interactive">
                <div>
                    <h1>Reports & Analytics</h1>
                    <p>Performance metrics, maintenance costs, and operational insights.</p>
                </div>
                <div className="controls">
                    <div className="time-filter">
                        <button className={timeRange === '7d' ? 'active' : ''} onClick={() => setTimeRange('7d')}>7 Days</button>
                        <button className={timeRange === '30d' ? 'active' : ''} onClick={() => setTimeRange('30d')}>30 Days</button>
                        <button className={timeRange === '1y' ? 'active' : ''} onClick={() => setTimeRange('1y')}>This Year</button>
                    </div>
                    <button className="export-btn" onClick={handleExport}>
                        📥 Export Data
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-grid">
                <div className="kpi-card kpi-blue">
                    <div className="kpi-label">Total Maintenance Cost</div>
                    <div className="kpi-value">${currentStats.kpi.totalMaintenanceCost.toLocaleString()}</div>
                </div>
                <div className="kpi-card kpi-green">
                    <div className="kpi-label">Avg. Repair Time</div>
                    <div className="kpi-value">{currentStats.kpi.avgRepairTime} hrs</div>
                </div>
                <div className="kpi-card kpi-purple">
                    <div className="kpi-label">Completed Requests</div>
                    <div className="kpi-value">{currentStats.kpi.completedRequests}</div>
                </div>
                <div className="kpi-card kpi-orange">
                    <div className="kpi-label">Preventive Compliance</div>
                    <div className="kpi-value">{currentStats.kpi.preventiveCompliance}%</div>
                </div>
            </div>

            <div className="charts-row">
                {/* Cost Over Time Area Chart */}
                <div className="report-section">
                    <h2 className="section-title">Maintenance Cost Trends</h2>
                    <div className="chart-container-large">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={currentStats.costOverTime}>
                                <defs>
                                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="match" />
                                <YAxis />
                                <CartesianGrid strokeDasharray="3 3" />
                                <Tooltip />
                                <Area type="monotone" dataKey="cost" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCost)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Faults by Type Pie Chart with Drill-down */}
                <div className="report-section">
                    <h2 className="section-title">Fault Distribution (Click Slice to Filter)</h2>
                    <div className="chart-container-large">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={currentStats.faultsByType}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                    onClick={handlePieClick}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {currentStats.faultsByType.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={COLORS[index % COLORS.length]}
                                            stroke={entry.name === selectedFaultType ? '#000' : 'none'}
                                            strokeWidth={2}
                                            opacity={selectedFaultType && selectedFaultType !== entry.name ? 0.3 : 1}
                                        />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    {selectedFaultType && (
                        <div className="drill-down-panel">
                            <h3>Details for: {selectedFaultType}</h3>
                            <table className="drill-down-table">
                                <thead>
                                    <tr><th>Equip</th><th>Issue</th><th>Cost</th></tr>
                                </thead>
                                <tbody>
                                    {DRILL_DOWN_DATA[selectedFaultType]?.map(row => (
                                        <tr key={row.id}>
                                            <td>{row.equip}</td>
                                            <td>{row.issue}</td>
                                            <td>${row.cost}</td>
                                        </tr>
                                    )) || <tr><td colSpan="3">No details available</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <div className="report-section">
                <h2 className="section-title">Team Performance</h2>
                <div className="chart-container-medium">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={currentStats.requestsByTeam}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="completed" name="Completed" fill="#22c55e" />
                            <Bar dataKey="open" name="Open" fill="#ef4444" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default ReportsDashboard;
