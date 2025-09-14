const DetectionHistory = ({ errors }) => {
  return (
    <div className="all-detection-history">
      <div className="element-title">
        <h3>All Detection History</h3>
        <span>Information After Query</span>
      </div>

      <div className="box-inquiry">
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
              {errors && errors.length > 0 ? (
                errors.map((error, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{error.timesptamp}</td>
                    <td>{error.stastus}</td>
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
      </div>
    </div>
  );
};

export default DetectionHistory;