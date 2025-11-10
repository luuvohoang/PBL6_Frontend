import React from 'react';

const ProjectTable = ({ projects, onEdit, onDelete }) => {
  
  const formatManager = (manager) => {
    if (!manager) {
      return 'N/A';
    }
    return manager.name || 'N/A';
  };

  const formatDescription = (description) => {
    if (!description) return 'No description';
    return description.length > 50 ? `${description.substring(0, 50)}...` : description;
  };

  /**
   * Hàm trợ giúp để hiển thị số lượng cameras - ĐÃ SỬA
   */
  const formatCameraCount = (cameras) => {
    if (!cameras || cameras.length === 0) {
      return '0 cameras';
    }
    return `${cameras.length} camera${cameras.length > 1 ? 's' : ''}`;
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Project Name</th>
            <th>Description</th>
            <th>Manager</th>
            <th>Cameras</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, index) => (
            <tr key={project.id}>
              <td>{index + 1}</td>
              <td>{project.name}</td>
              <td title={project.description}>{formatDescription(project.description)}</td>
              <td>{formatManager(project.manager)}</td>
              <td>{formatCameraCount(project.cameras)}</td>
              <td className="action-buttons">
                <button 
                  className="edit-btn"
                  onClick={() => onEdit(project)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => onDelete(project.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {projects.length === 0 && (
        <div className="no-data">
          <p>No projects found</p>
        </div>
      )}
    </div>
  );
};

export default ProjectTable;