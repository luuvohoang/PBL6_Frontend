import React from 'react';

const CameraTable = ({ cameras, onDelete }) => {
  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Camera Name</th>
            <th>IP Address</th>
            <th>Location</th> {/* Sửa: Hiển thị Location */}
            <th>Project ID</th> {/* Sửa: Hiển thị Project ID */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Sửa: Dùng tên trường (field) mới từ DTO (id, name, ipAddress, ...) */}
          {cameras.map((camera) => (
            <tr key={camera.id}>
              <td>{camera.id}</td>
              <td>{camera.name}</td>
              <td>{camera.ipAddress}</td>
              <td>{camera.location}</td>
              <td>{camera.projectName}</td>
              <td>
                <button 
                  className="delete-btn"
                  // Sửa: Gửi toàn bộ đối tượng 'camera'
                  // (Vì Manage.jsx cần camera.projectId và camera.id)
                  onClick={() => onDelete(camera)}
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