// File: src/components/Manage/RoleTable.jsx
import React from 'react';

// Nhận thêm prop 'onEdit'
const RoleTable = ({ roles, onEdit, onDelete }) => {

  const formatPermissions = (permissions) => {
    if (!permissions || permissions.length === 0) return 'No permissions';
    return permissions.map(perm => perm.name).join(', ');
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Role Name</th>
            <th>Description</th>
            <th>Permissions</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.name}>
              <td>{role.name}</td>
              <td>{role.description}</td>
              <td>{formatPermissions(role.permissions)}</td>
              <td className="action-buttons">
                {/* THÊM NÚT EDIT */}
                <button 
                  className="edit-btn"
                  onClick={() => onEdit(role)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => onDelete(role.name)}
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

export default RoleTable;