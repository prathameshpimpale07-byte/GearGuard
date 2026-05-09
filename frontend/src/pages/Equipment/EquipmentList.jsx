import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Card from '../../components/UI/Card';
import { dummyEquipment } from '../../utils/dummyData';
import './EquipmentList.css';

const EquipmentList = () => {
    const [equipment, setEquipment] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterCategory, setFilterCategory] = useState('all');

    useEffect(() => {
        fetchEquipment();
    }, []);

    const fetchEquipment = async () => {
        try {
            const response = await api.get('/equipment');
            const data = response.data?.data;

            if (Array.isArray(data) && data.length > 0) {
                setEquipment(data);
            } else {
                console.log('No backend data, using dummy equipment fallback');
                setEquipment(dummyEquipment);
            }
        } catch (err) {
            console.error('Error fetching equipment, using dummy data:', err);
            setEquipment(dummyEquipment);
        } finally {
            setLoading(false);
        }
    };

    const filteredEquipment = equipment.filter(item => {
        const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.serial_number.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
        return matchesSearch && matchesStatus && matchesCategory;
    });

    const categories = [...new Set(equipment.map(e => e.category))];

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { class: 'status-active', label: 'Active' },
            maintenance: { class: 'status-maintenance', label: 'Maintenance' },
            scrapped: { class: 'status-scrapped', label: 'Scrapped' }
        };
        const config = statusConfig[status] || statusConfig.active;
        return <span className={`status-badge ${config.class}`}>{config.label}</span>;
    };

    if (loading) {
        return <div className="loading-container">Loading equipment...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    return (
        <div className="equipment-list-page">
            <div className="page-header">
                <div>
                    <h1>Equipment Management</h1>
                    <p className="page-subtitle">Manage all machinery and assets</p>
                </div>
                <Link to="/equipment/create" className="btn btn-primary">
                    ➕ Add Equipment
                </Link>
            </div>

            <Card className="filters-card">
                <div className="filters-container">
                    <div className="search-box">
                        <input
                            type="text"
                            placeholder="Search by name or serial number..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                    <div className="filter-group">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="scrapped">Scrapped</option>
                        </select>
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="filter-select"
                        >
                            <option value="all">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </Card>

            <div className="equipment-stats">
                <div className="stat-item">
                    <span className="stat-label">Total Equipment:</span>
                    <span className="stat-value">{equipment.length}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Filtered Results:</span>
                    <span className="stat-value">{filteredEquipment.length}</span>
                </div>
            </div>

            {filteredEquipment.length === 0 ? (
                <Card>
                    <div className="empty-state">
                        <p>No equipment found matching your criteria.</p>
                    </div>
                </Card>
            ) : (
                <div className="equipment-grid">
                    {filteredEquipment.map((item) => (
                        <Card key={item._id} className="equipment-card">
                            <div className="equipment-card-header">
                                <h3>{item.name}</h3>
                                {getStatusBadge(item.status)}
                            </div>
                            <div className="equipment-details">
                                <div className="detail-row">
                                    <span className="detail-label">Serial:</span>
                                    <span className="detail-value">{item.serial_number}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Category:</span>
                                    <span className="detail-value">{item.category}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Location:</span>
                                    <span className="detail-value">{item.location}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Department:</span>
                                    <span className="detail-value">{item.department?.name || 'N/A'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">Team:</span>
                                    <span className="detail-value">{item.maintenance_team?.team_name || 'N/A'}</span>
                                </div>
                                {item.assigned_employee && (
                                    <div className="detail-row">
                                        <span className="detail-label">Assigned to:</span>
                                        <span className="detail-value">{item.assigned_employee.name}</span>
                                    </div>
                                )}
                            </div>
                            <div className="equipment-card-footer">
                                <Link to={`/equipment/${item._id}`} className="btn btn-secondary btn-sm">
                                    View Details
                                </Link>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default EquipmentList;
