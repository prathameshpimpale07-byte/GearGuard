import React from 'react';
import { useParams } from 'react-router-dom';

const EditEquipment = () => {
    const { id } = useParams();
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Edit Equipment</h1>
            <p>Editing equipment ID: {id}</p>
        </div>
    );
};

export default EditEquipment;
