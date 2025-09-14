const Home = () => {
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Active Projects</h2>
                    <p className="text-3xl font-bold">12</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Safety Reports</h2>
                    <p className="text-3xl font-bold">48</p>
                </div>
                <div className="p-6 bg-white rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">Team Members</h2>
                    <p className="text-3xl font-bold">24</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
