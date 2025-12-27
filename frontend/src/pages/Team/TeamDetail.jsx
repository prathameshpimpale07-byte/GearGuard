import React from 'react';
import { useParams } from 'react-router-dom';

const TeamDetail = () => {
    const { id } = useParams();
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Team Details</h1>
            <p>Viewing details for team ID: {id}</p>
        </div>
    );
};

export default TeamDetail;
