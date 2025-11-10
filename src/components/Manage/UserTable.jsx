import React from 'react';

const UserTable = ({ users, onEdit, onDelete }) => {
  
  // XÓA: Toàn bộ logic 'handleDelete' (fetch) đã được xóa.
  // Logic đó đã nằm ở component cha 'Manage.jsx'.

  /**
   * Hàm trợ giúp để hiển thị danh sách Role (vai trò)
   * Giả sử user.roles là một mảng (Array) các chuỗi (string)
   */
  const formatRoles = (roles) => {
    if (!roles || roles.length === 0) {
      return 'N/A';
    }
    // Lấy 'name' từ mỗi đối tượng role và nối chúng lại
    return roles.map(role => role.name).join(', '); 
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role(s)</th> {/* Sửa tên cột */}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* Sửa: Dùng tên trường DTO (id, name, email, roles) */}
          {users.map((user, index) => (
            <tr key={user.id}> {/* Sửa key */}
              <td>{index + 1}</td>
              <td>{user.name}</td> {/* Sửa tên trường */}
              <td>{user.email}</td> {/* Sửa tên trường */}
              <td>{formatRoles(user.roles)}</td> {/* Dùng hàm format mới */}
              <td className="action-buttons">
                <button 
                  className="edit-btn"
                  onClick={() => onEdit(user)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => onDelete(user.id)} // Gọi prop từ Manage.jsx
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

export default UserTable;