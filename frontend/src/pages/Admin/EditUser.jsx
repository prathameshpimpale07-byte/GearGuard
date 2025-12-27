import React from 'react';
import { useParams } from 'react-router-dom';

const EditUser = () => {
    const { id } = useParams();
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Edit User</h1>
            <p>Editing user with ID: {id}</p>
        </div>
    );
};

export default EditUser;
