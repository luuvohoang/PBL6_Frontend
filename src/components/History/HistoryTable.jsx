const HistoryTable = ({ data, isLoading }) => {
  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="inquiry">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Time</th>
            <th>Status</th>
            <th>OnSite</th>
            <th>Channel</th>
            <th>Error</th>
            <th>View details</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((error, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{error.timestamp}</td>
                <td>{error.status}</td>
                <td>{error.project_Name}</td>
                <td>{error.camera_name}</td>
                <td>{error.error_type}</td>
                <td>{error.descript}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7">No errors found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryTable;