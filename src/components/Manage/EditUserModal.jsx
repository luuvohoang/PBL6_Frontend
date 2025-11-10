import { useState, useEffect } from 'react';

/**
 * Component này giờ nhận thêm prop 'allRoles'
 * (Manage.jsx cần được sửa để truyền prop này vào)
 */
const EditUserModal = ({ user, allRoles, onClose, onUpdate }) => {
  
  // Sửa: State phải khớp với UserUpdateRequest DTO
  const [formData, setFormData] = useState({
    email: '',
    password: '', // Luôn rỗng khi edit
    status: true,
    locale: '',
    roles: [] // Mảng các tên vai trò (ví dụ: ["ADMIN"])
  });

  // Tự động điền (populate) form khi 'user' prop thay đổi
  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        password: '', // Luôn để trống
        status: user.status === true, // Đảm bảo là boolean
        locale: user.locale || '',
        // Sửa: 'user.roles' là mảng đối tượng [{name: 'ADMIN'}]
        // Chúng ta cần mảng tên ['ADMIN']
        roles: user.roles ? user.roles.map(role => role.name) : []
      });
    }
  }, [user]); // Chạy lại khi 'user' thay đổi

  // Xử lý các input text/email/password
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Xử lý checkbox 'status'
  const handleStatusChange = (e) => {
    setFormData({
      ...formData,
      status: e.target.checked
    });
  };

  // Xử lý các checkbox 'roles'
  const handleRolesChange = (e) => {
    const { value, checked } = e.target;
    const currentRoles = formData.roles;

    if (checked) {
      setFormData({ ...formData, roles: [...currentRoles, value] });
    } else {
      setFormData({ ...formData, roles: currentRoles.filter(roleName => roleName !== value) });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Tạo payload (dữ liệu gửi đi)
    const payload = {
      ...formData
    };

    // QUAN TRỌNG: Nếu password rỗng, xóa nó khỏi payload
    // Backend Service sẽ hiểu là "không thay đổi mật khẩu"
    if (!payload.password || payload.password.trim() === '') {
      delete payload.password;
    }
    
    // Gọi hàm 'onUpdate' (truyền lên Manage.jsx)
    onUpdate(payload);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          {/* Hiển thị tên user đang sửa */}
          <h2>Edit User: {user.name}</h2> 
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* Tên đăng nhập (Username) - Không cho phép sửa */}
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={user.name || ''} // Hiển thị tên từ 'user' prop
              disabled // Không cho sửa
            />
          </div>
          
          {/* Xóa: fullname (không có trong DTO) */}
          
          {/* Sửa: 'email' (khớp DTO) */}
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          {/* Xóa: 'phone' (không có trong DTO) */}

          {/* Sửa: 'password' (khớp DTO) */}
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Để trống nếu không muốn đổi"
            />
          </div>

          {/* Thêm: 'locale' */}
          <div className="form-group">
            <label htmlFor="locale">Locale:</label>
            <input
              type="text"
              id="locale"
              name="locale"
              value={formData.locale}
              onChange={handleChange}
              placeholder="e.g., en_US"
            />
          </div>

          {/* Thêm: 'status' (dạng checkbox) */}
          <div className="form-group">
            <label>Status:</label>
            <div className="checkbox-item">
              <input
                type="checkbox"
                id="status"
                name="status"
                checked={formData.status}
                onChange={handleStatusChange}
              />
              <label htmlFor="status">Active</label>
            </div>
          </div>

          {/* Sửa: 'roles' (dạng checkboxes) */}
          <div className="form-group">
            <label>Roles:</label>
            {allRoles && allRoles.length > 0 ? (
              allRoles.map(role => (
                <div key={role.name} className="checkbox-item">
                  <input
                    type="checkbox"
                    id={`role-edit-${role.name}`}
                    name="roles"
                    value={role.name}
                    // Kiểm tra xem role.name có trong mảng formData.roles không
                    checked={formData.roles.includes(role.name)}
                    onChange={handleRolesChange}
                  />
                  <label htmlFor={`role-edit-${role.name}`}>{role.name}</label>
                </div>
              ))
            ) : (
              <p>Đang tải Roles...</p>
            )}
          </div>

          <div className="modal-actions">
            <button type="submit">Update User</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;