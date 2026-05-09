import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Card from '../../components/UI/Card';
import './TeamList.css';

const TeamList = () => {
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchTeams();
    }, []);

    const fetchTeams = async () => {
        try {
            const response = await api.get('/teams');
            setTeams(response.data.data || []);
        } catch (err) {
            setError('Failed to load teams.');
            console.error('Error fetching teams:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading-container">Loading teams...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    return (
        <div className="team-list-page">
            <div className="page-header">
                <div>
                    <h1>Maintenance Teams</h1>
                    <p className="page-subtitle">Manage all maintenance teams and their members</p>
                </div>
                <Link to="/teams/create" className="btn btn-primary">
                    ➕ Create Team
                </Link>
            </div>

            {teams.length === 0 ? (
                <Card>
                    <div className="empty-state">
                        <p>No teams found. Create your first team to get started.</p>
                    </div>
                </Card>
            ) : (
                <div className="teams-grid">
                    {teams.map((team) => (
                        <Card key={team._id} className="team-card">
                            <div className="team-header">
                                <h3>{team.team_name}</h3>
                                <span className="member-count">
                                    👥 {team.members?.length || 0} members
                                </span>
                            </div>
                            <p className="team-description">{team.description}</p>
                            <div className="team-members">
                                {team.members && team.members.length > 0 ? (
                                    <div className="members-list">
                                        {team.members.slice(0, 3).map((member) => (
                                            <div key={member._id} className="member-item">
                                                <span className="member-avatar">
                                                    {member.name.charAt(0).toUpperCase()}
                                                </span>
                                                <span className="member-name">{member.name}</span>
                                            </div>
                                        ))}
                                        {team.members.length > 3 && (
                                            <span className="more-members">
                                                +{team.members.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <p className="no-members">No members assigned yet</p>
                                )}
                            </div>
                            <div className="team-footer">
                                <Link to={`/teams/${team._id}`} className="btn btn-secondary btn-sm">
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

export default TeamList;
