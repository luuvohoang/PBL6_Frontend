const UserTable = ({ users, onEdit, onDelete }) => {
  const handleDelete = async (id) => {
    try {
      await fetch('http://localhost:8081/api/deleteuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });
      onDelete(id);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.users_ID}>
              <td>{index + 1}</td>
              <td>{user.users_name}</td>
              <td>{user.full_name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.role_ID}</td>
              <td className="action-buttons">
                <button 
                  className="edit-btn"
                  onClick={() => onEdit(user)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(user.users_ID)}
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