import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import Card from '../../components/UI/Card';
import './EquipmentDetail.css';

const EquipmentDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [equipment, setEquipment] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEquipmentDetails();
    }, [id]);

    const fetchEquipmentDetails = async () => {
        try {
            const [equipmentRes, requestsRes] = await Promise.all([
                api.get(`/equipment/${id}`),
                api.get(`/equipment/${id}/requests`)
            ]);
            setEquipment(equipmentRes.data.data);
            setRequests(requestsRes.data.data || []);
        } catch (err) {
            setError('Failed to load equipment details.');
            console.error('Error fetching equipment:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this equipment?')) {
            return;
        }
        try {
            await api.delete(`/equipment/${id}`);
            navigate('/equipment');
        } catch (err) {
            alert('Failed to delete equipment. It may have associated requests.');
            console.error('Error deleting equipment:', err);
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            active: { class: 'status-active', label: 'Active' },
            maintenance: { class: 'status-maintenance', label: 'Maintenance' },
            scrapped: { class: 'status-scrapped', label: 'Scrapped' }
        };
        const config = statusConfig[status] || statusConfig.active;
        return <span className={`status-badge ${config.class}`}>{config.label}</span>;
    };

    const getStageBadge = (stage) => {
        const stageConfig = {
            new: { class: 'stage-new', label: 'New' },
            'in-progress': { class: 'stage-progress', label: 'In Progress' },
            repaired: { class: 'stage-repaired', label: 'Repaired' },
            scrap: { class: 'stage-scrap', label: 'Scrap' }
        };
        const config = stageConfig[stage] || stageConfig.new;
        return <span className={`stage-badge ${config.class}`}>{config.label}</span>;
    };

    if (loading) {
        return <div className="loading-container">Loading equipment details...</div>;
    }

    if (error || !equipment) {
        return (
            <div className="error-container">
                <p>{error || 'Equipment not found'}</p>
                <Link to="/equipment" className="btn btn-primary">Back to Equipment List</Link>
            </div>
        );
    }

    return (
        <div className="equipment-detail-page">
            <div className="page-header">
                <div>
                    <Link to="/equipment" className="back-link">← Back to Equipment</Link>
                    <h1>{equipment.name}</h1>
                    <p className="serial-number">Serial: {equipment.serial_number}</p>
                </div>
                <div className="header-actions">
                    <Link to={`/equipment/${id}/edit`} className="btn btn-secondary">
                        ✏️ Edit
                    </Link>
                    <button onClick={handleDelete} className="btn btn-danger">
                        🗑️ Delete
                    </button>
                </div>
            </div>

            <div className="detail-grid">
                <Card title="Equipment Information">
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Status</span>
                            <div>{getStatusBadge(equipment.status)}</div>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Category</span>
                            <span className="info-value">{equipment.category}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Location</span>
                            <span className="info-value">{equipment.location}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Department</span>
                            <span className="info-value">{equipment.department?.name || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Maintenance Team</span>
                            <span className="info-value">{equipment.maintenance_team?.team_name || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Assigned Employee</span>
                            <span className="info-value">{equipment.assigned_employee?.name || 'Unassigned'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Purchase Date</span>
                            <span className="info-value">{new Date(equipment.purchase_date).toLocaleDateString()}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Warranty Expiry</span>
                            <span className="info-value">{new Date(equipment.warranty_expiry).toLocaleDateString()}</span>
                        </div>
                    </div>
                </Card>

                <Card title={`Maintenance History (${requests.length})`}>
                    {requests.length === 0 ? (
                        <p className="empty-message">No maintenance requests yet.</p>
                    ) : (
                        <div className="requests-list">
                            {requests.map((request) => (
                                <Link
                                    key={request._id}
                                    to={`/requests/${request._id}`}
                                    className="request-item"
                                >
                                    <div className="request-header">
                                        <h4>{request.subject}</h4>
                                        {getStageBadge(request.stage)}
                                    </div>
                                    <p className="request-description">{request.description}</p>
                                    <div className="request-meta">
                                        <span>Type: {request.type}</span>
                                        <span>Priority: {request.priority}</span>
                                        {request.assigned_technician && (
                                            <span>Technician: {request.assigned_technician.name}</span>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default EquipmentDetail;
