const CameraTable = ({ cameras, onDelete }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Camera ID</th>
            <th>Camera Name</th>
            <th>IP Address</th>
            <th>Status</th>
            <th>Project</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {cameras.map((camera, index) => (
            <tr key={camera.camera_ID}>
              <td>{index + 1}</td>
              <td>{camera.camera_name}</td>
              <td>{camera.IP_address}</td>
              <td>{camera.status}</td>
              <td>{camera.project_name}</td>
              <td>
                <button 
                  className="delete-btn"
                  onClick={() => onDelete(camera.camera_ID)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CameraTable;