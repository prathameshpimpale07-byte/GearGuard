import React from 'react';

const ForgotPassword = () => {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="p-8 bg-white rounded shadow-md">
                <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
                <p>Enter your email to receive a reset link.</p>
                {/* Form will go here */}
            </div>
        </div>
    );
};

export default ForgotPassword;
