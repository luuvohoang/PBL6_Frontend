import { useState, useEffect } from 'react';
import CameraTable from '../components/Manage/CameraTable';
import UserTable from '../components/Manage/UserTable';
import AddCameraModal from '../components/Manage/AddCameraModal';
import AddUserModal from '../components/Manage/AddUserModal';
import EditUserModal from '../components/Manage/EditUserModal';
import '../assets/styles/manage.css';

const Manage = () => {
  const [cameras, setCameras] = useState([]);
  const [users, setUsers] = useState([]);
  const [showAddCamera, setShowAddCamera] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchCameras();
    fetchUsers();
  }, []);

  const fetchCameras = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/cameras');
      const data = await response.json();
      setCameras(data);
    } catch (error) {
      console.error('Error fetching cameras:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleDeleteCamera = async (id) => {
    try {
      await fetch(`http://localhost:8081/api/deletecamera`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idcamera: id }),
      });
      setCameras(cameras.filter(camera => camera.camera_ID !== id));
    } catch (error) {
      console.error('Error deleting camera:', error);
    }
  };

  const handleAddCamera = async (cameraData) => {
    try {
      const response = await fetch('http://localhost:8081/api/addcamera', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cameraData),
      });
      const data = await response.json();
      setCameras([...cameras, { ...cameraData, camera_ID: data.cameraId }]);
      setShowAddCamera(false);
    } catch (error) {
      console.error('Error adding camera:', error);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditUser(true);
  };

  const handleUpdateUser = async (userData) => {
    try {
      await fetch('http://localhost:8081/api/modifyuser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      setUsers(users.map(user => 
        user.users_ID === userData.userid ? { ...user, ...userData } : user
      ));
      setShowEditUser(false);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <div className="manage-page">
      <div className="box-title">
        <h1>Manage</h1>
      </div>

      <div className="manage-section">
        <div className="manage-cctv">
          <div className="section-header">
            <h2>Manage CCTV</h2>
            <button onClick={() => setShowAddCamera(true)}>
              Add New Camera
            </button>
          </div>
          <CameraTable 
            cameras={cameras} 
            onDelete={handleDeleteCamera}
          />
        </div>

        <div className="manage-users">
          <div className="section-header">
            <h2>Manage Users</h2>
            <button onClick={() => setShowAddUser(true)}>
              Add New User
            </button>
          </div>
          <UserTable 
            users={users}
            onEdit={handleEditUser}
            onDelete={id => setUsers(users.filter(user => user.users_ID !== id))}
          />
        </div>
      </div>

      {showAddCamera && (
        <AddCameraModal
          onClose={() => setShowAddCamera(false)}
          onAdd={handleAddCamera}
        />
      )}

      {showAddUser && (
        <AddUserModal
          onClose={() => setShowAddUser(false)}
          onAdd={userData => {
            setUsers([...users, userData]);
            setShowAddUser(false);
          }}
        />
      )}

      {showEditUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setShowEditUser(false)}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default Manage;