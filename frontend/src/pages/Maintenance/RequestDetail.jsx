import React from 'react';
import { useParams } from 'react-router-dom';

const RequestDetail = () => {
    const { id } = useParams();
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Request Details</h1>
            <p>Viewing maintenance request ID: {id}</p>
        </div>
    );
};

export default RequestDetail;
