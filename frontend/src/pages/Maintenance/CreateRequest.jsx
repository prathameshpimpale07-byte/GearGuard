import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import Card from '../../components/UI/Card';
import './CreateRequest.css';

const CreateRequest = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [equipment, setEquipment] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        type: 'corrective',
        priority: 'medium',
        equipment_id: '',
        assigned_technician: '',
        scheduled_date: ''
    });

    useEffect(() => {
        fetchDropdownData();
    }, []);

    const fetchDropdownData = async () => {
        try {
            const [equipmentRes, usersRes] = await Promise.all([
                api.get('/equipment'),
                api.get('/users')
            ]);
            setEquipment(equipmentRes.data.data || []);
            setTechnicians(usersRes.data.data?.filter(u => u.role === 'technician') || []);
        } catch (err) {
            console.error('Error fetching dropdown data:', err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await api.post('/requests', formData);
            navigate(`/requests/${response.data.data._id}`);
        } catch (err) {
            alert('Failed to create request. Please check all fields.');
            console.error('Error creating request:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-request-page">
            <div className="page-header">
                <h1>Create Maintenance Request</h1>
                <p className="page-subtitle">Report equipment issues or schedule preventive maintenance</p>
            </div>

            <Card>
                <form onSubmit={handleSubmit} className="request-form">
                    <div className="form-section">
                        <h3>Request Details</h3>
                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label htmlFor="subject">Subject *</label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    placeholder="Brief description of the issue"
                                />
                            </div>

                            <div className="form-group full-width">
                                <label htmlFor="description">Description *</label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    placeholder="Detailed description of the problem or maintenance needed"
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="type">Request Type *</label>
                                <select
                                    id="type"
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="corrective">Corrective (Fix Issue)</option>
                                    <option value="preventive">Preventive (Scheduled Maintenance)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="priority">Priority *</label>
                                <select
                                    id="priority"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="equipment_id">Equipment *</label>
                                <select
                                    id="equipment_id"
                                    name="equipment_id"
                                    value={formData.equipment_id}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Equipment</option>
                                    {equipment.map(eq => (
                                        <option key={eq._id} value={eq._id}>
                                            {eq.name} ({eq.serial_number})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group">
                                <label htmlFor="assigned_technician">Assign Technician (Optional)</label>
                                <select
                                    id="assigned_technician"
                                    name="assigned_technician"
                                    value={formData.assigned_technician}
                                    onChange={handleChange}
                                >
                                    <option value="">Auto-assign based on equipment team</option>
                                    {technicians.map(tech => (
                                        <option key={tech._id} value={tech._id}>
                                            {tech.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {formData.type === 'preventive' && (
                                <div className="form-group">
                                    <label htmlFor="scheduled_date">Scheduled Date</label>
                                    <input
                                        type="datetime-local"
                                        id="scheduled_date"
                                        name="scheduled_date"
                                        value={formData.scheduled_date}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-info">
                        <p>📝 <strong>Note:</strong> The request will be automatically assigned to the maintenance team responsible for the selected equipment.</p>
                        <p>👤 <strong>Created by:</strong> {user?.name}</p>
                    </div>

                    <div className="form-actions">
                        <button
                            type="button"
                            onClick={() => navigate('/requests')}
                            className="btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={loading}
                        >
                            {loading ? 'Creating...' : 'Create Request'}
                        </button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CreateRequest;
