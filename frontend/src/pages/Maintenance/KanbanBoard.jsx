import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Card from '../../components/UI/Card';
import { dummyRequests } from '../../utils/dummyData';
import './KanbanBoard.css';

const KanbanBoard = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const stages = [
        { id: 'new', label: 'New', color: '#3b82f6' },
        { id: 'in-progress', label: 'In Progress', color: '#f59e0b' },
        { id: 'repaired', label: 'Repaired', color: '#10b981' },
        { id: 'scrap', label: 'Scrap', color: '#ef4444' }
    ];

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await api.get('/requests');
            const data = response.data.data;
            if (data && data.length > 0) {
                setRequests(data);
            } else {
                setRequests(dummyRequests);
            }
        } catch (err) {
            console.error('Error fetching requests, using dummy data:', err);
            setRequests(dummyRequests);
            // setError('Failed to load requests.');
        } finally {
            setLoading(false);
        }
    };

    const handleStageChange = async (requestId, newStage) => {
        try {
            await api.put(`/requests/${requestId}/stage`, { stage: newStage });
            // Update local state
            setRequests(prev => prev.map(req =>
                req._id === requestId ? { ...req, stage: newStage } : req
            ));
        } catch (err) {
            alert('Failed to update request stage.');
            console.error('Error updating stage:', err);
        }
    };

    const getRequestsByStage = (stageId) => {
        return requests.filter(req => req.stage === stageId);
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

    const getTypeBadge = (type) => {
        return (
            <span className={`type-badge type-${type}`}>
                {type === 'preventive' ? '🛡️ Preventive' : '🔧 Corrective'}
            </span>
        );
    };

    if (loading) {
        return <div className="loading-container">Loading requests...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    return (
        <div className="kanban-board-page">
            <div className="page-header">
                <div>
                    <h1>Maintenance Requests Board</h1>
                    <p className="page-subtitle">Manage and track all maintenance requests</p>
                </div>
                <Link to="/requests/create" className="btn btn-primary">
                    ➕ Create Request
                </Link>
            </div>

            <div className="kanban-board">
                {stages.map(stage => {
                    const stageRequests = getRequestsByStage(stage.id);
                    return (
                        <div key={stage.id} className="kanban-column">
                            <div className="column-header" style={{ borderTopColor: stage.color }}>
                                <h3>{stage.label}</h3>
                                <span className="count-badge">{stageRequests.length}</span>
                            </div>
                            <div className="column-content">
                                {stageRequests.length === 0 ? (
                                    <div className="empty-column">No requests</div>
                                ) : (
                                    stageRequests.map(request => (
                                        <Card key={request._id} className="request-card">
                                            <Link to={`/requests/${request._id}`} className="request-link">
                                                <div className="request-header">
                                                    <h4>{request.subject}</h4>
                                                    {getPriorityBadge(request.priority)}
                                                </div>
                                                <p className="request-description">{request.description}</p>
                                                <div className="request-meta">
                                                    {getTypeBadge(request.type)}
                                                    <span className="equipment-name">
                                                        🏭 {request.equipment?.name || 'N/A'}
                                                    </span>
                                                </div>
                                                {request.assigned_technician && (
                                                    <div className="technician-info">
                                                        👤 {request.assigned_technician.name}
                                                    </div>
                                                )}
                                            </Link>
                                            <div className="stage-actions">
                                                {stage.id !== 'new' && (
                                                    <button
                                                        onClick={() => {
                                                            const prevStageIndex = stages.findIndex(s => s.id === stage.id) - 1;
                                                            if (prevStageIndex >= 0) {
                                                                handleStageChange(request._id, stages[prevStageIndex].id);
                                                            }
                                                        }}
                                                        className="stage-btn stage-btn-prev"
                                                    >
                                                        ←
                                                    </button>
                                                )}
                                                {stage.id !== 'scrap' && stage.id !== 'repaired' && (
                                                    <button
                                                        onClick={() => {
                                                            const nextStageIndex = stages.findIndex(s => s.id === stage.id) + 1;
                                                            if (nextStageIndex < stages.length) {
                                                                handleStageChange(request._id, stages[nextStageIndex].id);
                                                            }
                                                        }}
                                                        className="stage-btn stage-btn-next"
                                                    >
                                                        →
                                                    </button>
                                                )}
                                            </div>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default KanbanBoard;
