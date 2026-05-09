import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import Card from '../../components/UI/Card';
import './RequestDetail.css';

const RequestDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchRequestDetail();
    }, [id]);

    const fetchRequestDetail = async () => {
        try {
            const response = await api.get(`/requests/${id}`);
            setRequest(response.data.data);
        } catch (err) {
            setError('Failed to load request details.');
            console.error('Error fetching request:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleStageChange = async (newStage) => {
        try {
            await api.put(`/requests/${id}/stage`, { stage: newStage });
            setRequest(prev => ({ ...prev, stage: newStage }));
        } catch (err) {
            alert('Failed to update stage.');
            console.error('Error updating stage:', err);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this request?')) {
            return;
        }
        try {
            await api.delete(`/requests/${id}`);
            navigate('/requests');
        } catch (err) {
            alert('Failed to delete request.');
            console.error('Error deleting request:', err);
        }
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

    const getPriorityBadge = (priority) => {
        const priorityConfig = {
            low: { class: 'priority-low', label: 'Low' },
            medium: { class: 'priority-medium', label: 'Medium' },
            high: { class: 'priority-high', label: 'High' }
        };
        const config = priorityConfig[priority] || priorityConfig.medium;
        return <span className={`priority-badge ${config.class}`}>{config.label}</span>;
    };

    if (loading) {
        return <div className="loading-container">Loading request details...</div>;
    }

    if (error || !request) {
        return (
            <div className="error-container">
                <p>{error || 'Request not found'}</p>
                <Link to="/requests" className="btn btn-primary">Back to Requests</Link>
            </div>
        );
    }

    return (
        <div className="request-detail-page">
            <div className="page-header">
                <div>
                    <Link to="/requests" className="back-link">← Back to Requests</Link>
                    <h1>{request.subject}</h1>
                    <div className="header-badges">
                        {getStageBadge(request.stage)}
                        {getPriorityBadge(request.priority)}
                        <span className={`type-badge type-${request.type}`}>
                            {request.type === 'preventive' ? '🛡️ Preventive' : '🔧 Corrective'}
                        </span>
                    </div>
                </div>
                <div className="header-actions">
                    <button onClick={handleDelete} className="btn btn-danger">
                        🗑️ Delete
                    </button>
                </div>
            </div>

            <div className="detail-grid">
                <Card title="Request Information">
                    <div className="info-section">
                        <h4>Description</h4>
                        <p className="description-text">{request.description}</p>
                    </div>
                    <div className="info-grid">
                        <div className="info-item">
                            <span className="info-label">Equipment</span>
                            <Link to={`/equipment/${request.equipment?._id}`} className="info-link">
                                {request.equipment?.name || 'N/A'}
                            </Link>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Serial Number</span>
                            <span className="info-value">{request.equipment?.serial_number || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Assigned Team</span>
                            <span className="info-value">{request.assigned_team?.team_name || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Assigned Technician</span>
                            <span className="info-value">{request.assigned_technician?.name || 'Unassigned'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Created By</span>
                            <span className="info-value">{request.created_by?.name || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Created At</span>
                            <span className="info-value">{new Date(request.createdAt).toLocaleString()}</span>
                        </div>
                        {request.scheduled_date && (
                            <div className="info-item">
                                <span className="info-label">Scheduled Date</span>
                                <span className="info-value">{new Date(request.scheduled_date).toLocaleString()}</span>
                            </div>
                        )}
                        {request.completion_date && (
                            <div className="info-item">
                                <span className="info-label">Completion Date</span>
                                <span className="info-value">{new Date(request.completion_date).toLocaleString()}</span>
                            </div>
                        )}
                        {request.hours_spent && (
                            <div className="info-item">
                                <span className="info-label">Hours Spent</span>
                                <span className="info-value">{request.hours_spent} hours</span>
                            </div>
                        )}
                    </div>
                </Card>

                <Card title="Stage Management">
                    <div className="stage-actions">
                        <button
                            onClick={() => handleStageChange('new')}
                            className={`stage-btn ${request.stage === 'new' ? 'active' : ''}`}
                            disabled={request.stage === 'new'}
                        >
                            New
                        </button>
                        <button
                            onClick={() => handleStageChange('in-progress')}
                            className={`stage-btn ${request.stage === 'in-progress' ? 'active' : ''}`}
                            disabled={request.stage === 'in-progress'}
                        >
                            In Progress
                        </button>
                        <button
                            onClick={() => handleStageChange('repaired')}
                            className={`stage-btn ${request.stage === 'repaired' ? 'active' : ''}`}
                            disabled={request.stage === 'repaired'}
                        >
                            Repaired
                        </button>
                        <button
                            onClick={() => handleStageChange('scrap')}
                            className={`stage-btn ${request.stage === 'scrap' ? 'active' : ''}`}
                            disabled={request.stage === 'scrap'}
                        >
                            Scrap
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default RequestDetail;
