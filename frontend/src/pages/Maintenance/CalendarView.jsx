import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import Card from '../../components/UI/Card';
import { dummyCalendarRequests } from '../../utils/dummyData';
import './CalendarView.css';

const CalendarView = () => {

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        fetchScheduledRequests();
    }, []);

    const fetchScheduledRequests = async () => {
        try {
            const response = await api.get('/requests/calendar');
            const data = response.data.data;
            if (data && data.length > 0) {
                setRequests(data);
            } else {
                setRequests(dummyCalendarRequests);
            }
        } catch (err) {
            console.error('Error fetching calendar requests, using dummy data:', err);
            setRequests(dummyCalendarRequests);
            // setError('Failed to load scheduled requests.');
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        return { daysInMonth, startingDayOfWeek, year, month };
    };

    const getRequestsForDate = (date) => {
        return requests.filter(req => {
            if (!req.scheduled_date) return false;
            const reqDate = new Date(req.scheduled_date);
            return reqDate.toDateString() === date.toDateString();
        });
    };

    const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

    const previousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    if (loading) {
        return <div className="loading-container">Loading calendar...</div>;
    }

    if (error) {
        return <div className="error-container">{error}</div>;
    }

    return (
        <div className="calendar-view-page">
            <div className="page-header">
                <h1>Maintenance Calendar</h1>
                <p className="page-subtitle">Scheduled preventive maintenance</p>
            </div>

            <Card>
                <div className="calendar-header">
                    <button onClick={previousMonth} className="btn btn-secondary">
                        ← Previous
                    </button>
                    <h2>
                        {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h2>
                    <button onClick={nextMonth} className="btn btn-secondary">
                        Next →
                    </button>
                </div>

                <div className="calendar-grid">
                    <div className="calendar-day-header">Sun</div>
                    <div className="calendar-day-header">Mon</div>
                    <div className="calendar-day-header">Tue</div>
                    <div className="calendar-day-header">Wed</div>
                    <div className="calendar-day-header">Thu</div>
                    <div className="calendar-day-header">Fri</div>
                    <div className="calendar-day-header">Sat</div>

                    {[...Array(startingDayOfWeek)].map((_, i) => (
                        <div key={`empty-${i}`} className="calendar-day empty"></div>
                    ))}

                    {[...Array(daysInMonth)].map((_, i) => {
                        const day = i + 1;
                        const date = new Date(year, month, day);
                        const dayRequests = getRequestsForDate(date);
                        const isToday = date.toDateString() === new Date().toDateString();

                        return (
                            <div
                                key={day}
                                className={`calendar-day ${isToday ? 'today' : ''} ${dayRequests.length > 0 ? 'has-requests' : ''}`}
                            >
                                <div className="day-number">{day}</div>
                                <div className="day-requests">
                                    {dayRequests.map(req => (
                                        <Link
                                            key={req._id}
                                            to={`/requests/${req._id}`}
                                            className="request-pill"
                                            title={req.subject}
                                        >
                                            {req.subject.substring(0, 20)}
                                            {req.subject.length > 20 ? '...' : ''}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            <Card title="Upcoming Scheduled Maintenance">
                {requests.length === 0 ? (
                    <p className="empty-message">No scheduled maintenance requests.</p>
                ) : (
                    <div className="requests-list">
                        {requests.slice(0, 10).map(req => (
                            <Link key={req._id} to={`/requests/${req._id}`} className="request-item">
                                <div>
                                    <strong>{req.subject}</strong>
                                    <p style={{ color: '#6b7280', margin: '0.25rem 0' }}>
                                        {req.equipment?.name || 'N/A'}
                                    </p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div>{new Date(req.scheduled_date).toLocaleDateString()}</div>
                                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                        {new Date(req.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default CalendarView;
