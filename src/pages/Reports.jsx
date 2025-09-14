import React from 'react';

const Reports = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Safety Reports</h1>
            <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                {/* Report cards will go here */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Report 1</h2>
                    <p className="text-gray-600">Report details go here</p>
                </div>
            </div>
        </div>
    );
};

export default Reports;
