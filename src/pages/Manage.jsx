import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../services/localStorageService';
import { Box, CircularProgress, Typography } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import CameraTable from '../components/Manage/CameraTable';
import UserTable from '../components/Manage/UserTable';
import AddCameraModal from '../components/Manage/AddCameraModal';
import AddUserModal from '../components/Manage/AddUserModal';
import EditUserModal from '../components/Manage/EditUserModal';
import RoleTable from '../components/Manage/RoleTable';
import AddRoleModal from '../components/Manage/AddRoleModal';
import EditRoleModal from '../components/Manage/EditRoleModal';
import ProjectTable from '../components/Manage/ProjectTable';
import AddProjectModal from '../components/Manage/AddProjectModal';
import EditProjectModal from '../components/Manage/EditProjectModal';
import '../assets/styles/manage.css';

// URL Gốc của API Backend
import { 
  projectsApi, 
  camerasApi, 
  userApi,
  roleApi,
  permissionApi
} from '../services/api';

// Hàm kiểm tra vai trò Admin
const checkIsAdmin = () => {
  const token = getToken();
  if (!token) return false;
  try {
    const decodedToken = jwtDecode(token);
    console.log("Decoded Token:", decodedToken);
    const authorities = decodedToken.scope || decodedToken.authorities || [];
    console.log("Decoded Token:", authorities);
    console.log("Decoded Token:", authorities.includes('ROLE_ADMIN'));
    return authorities.includes('ROLE_ADMIN') || authorities.includes('ADMIN');
    
  } catch (e) {
    console.error("Lỗi giải mã token:", e);
    return false;
  }
};

const Manage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(getToken());
  const [isAdmin, setIsAdmin] = useState(() => checkIsAdmin(getToken()));;

  // --- State dữ liệu ---
  const [projects, setProjects] = useState([]);
  const [cameras, setCameras] = useState([]);
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [allPermissions, setAllPermissions] = useState([]);

  // --- State giao diện ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddCamera, setShowAddCamera] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddRole, setShowAddRole] = useState(false);
  const [showEditRole, setShowEditRole] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // 1. Kiểm tra xác thực và vai trò
  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      setIsAdmin(checkIsAdmin());
    }
  }, [token, navigate]);

  // 2. Tải dữ liệu có điều kiện - ĐÃ SỬA LỖI CAMERA
  useEffect(() => {
    if (!token) return;

    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Interceptor của apiService sẽ tự động xử lý token và lỗi 401

        // --- 1. Luôn tải Projects ---
        const projRes = await projectsApi.getAll();
        const loadedProjects = projRes.data.result.content || [];
        setProjects(loadedProjects);

        // --- 2. Tải Cameras (Tùy theo Role) ---
        let loadedCameras = [];
        if (isAdmin) {
          // A. ADMIN: Gọi API Toàn cục
          const camRes = await camerasApi.getAllGlobal();
          loadedCameras = camRes.data.result.content || [];
        } else {
          // B. MANAGER: Lặp qua từng Project đã tải
          const cameraPromises = loadedProjects.map(project =>
            camerasApi.getAllByProject(project.id)
              .then(res => res.data.result.content || [])
              .catch(err => {
                console.error(`Lỗi tải camera cho dự án ${project.id}:`, err);
                return []; 
              })
          );
          const camerasResults = await Promise.all(cameraPromises);
          loadedCameras = camerasResults.flat();
        }

        // Gắn projectName vào camera
        const camerasWithProjectName = loadedCameras.map(cam => {
          const project = loadedProjects.find(p => p.id === cam.projectId);
          return { ...cam, projectName: project ? project.name : 'Unknown' };
        });
        setCameras(camerasWithProjectName);

        // --- 3. Tải dữ liệu Admin (NẾU là Admin) ---
        if (isAdmin) {
          const [userRes, roleRes, permRes] = await Promise.all([
            userApi.getAll(),
            roleApi.getAll(),
            permissionApi.getAll(),
          ]);
          setUsers(userRes.data.result || []);
          setRoles(roleRes.data.result || []);
          setAllPermissions(permRes.data.result || []);
        }

      } catch (err) {
        // Lỗi 401 đã được Interceptor xử lý (tự động logout)
        // Đây là các lỗi khác (403, 404, 500...)
        console.error('Error fetching data:', err);
        setError(err.response ? err.response.data.message : err.message);
      }
      setLoading(false);
    };

    fetchAllData();
  }, [token, isAdmin]);

  // --- Logic Xử lý Project ---
const handleAddProject = async (projectData) => {
  try {
    const response = await projectsApi.create(projectData);
    setProjects([response.data.result, ...projects]);
    setShowAddProject(false);
  } catch (err) {
    console.error('Error adding project:', err);
    setError(err.response?.data?.message || err.message);
  }
};

const handleOpenEditProject = (project) => {
  setSelectedProject(project);
  setShowEditProject(true);
};

const handleUpdateProject = async (projectId, projectData) => {
  try {
    const response = await projectsApi.update(projectId, projectData);
    setProjects(projects.map(p => p.id === projectId ? response.data.result : p));
    setShowEditProject(false);
  } catch (err) {
    console.error('Error updating project:', err);
    setError(err.response?.data?.message || err.message);
  }
};

const handleDeleteProject = async (projectId) => {
  if (!window.confirm("Bạn có chắc muốn xóa dự án này? Việc này KHÔNG THỂ hoàn tác.")) return;
  try {
    await projectsApi.delete(projectId);
    setProjects(projects.filter(p => p.id !== projectId));
  } catch (err) {
    console.error('Error deleting project:', err);
    setError(err.response?.data?.message || err.message);
  }
};


// --- Logic Xử lý Camera ---
const handleDeleteCamera = async (cameraToDelete) => {
  if (!cameraToDelete.projectId) {
    console.error("Lỗi: Không thể xóa camera vì thiếu projectId.");
    setError("Dữ liệu camera bị lỗi, thiếu projectId.");
    return;
  }
  try {
    await camerasApi.delete(cameraToDelete.projectId, cameraToDelete.id);
    setCameras(cameras.filter(camera => camera.id !== cameraToDelete.id));

    // Cập nhật lại state projects
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === cameraToDelete.projectId
          ? {
              ...project,
              cameras: project.cameras
                ? project.cameras.filter(cam => cam.id !== cameraToDelete.id)
                : [],
            }
          : project
      )
    );
  } catch (err) {
    console.error('Error deleting camera:', err);
    setError(err.response?.data?.message || err.message);
  }
};

const handleAddCamera = async (projectId, cameraData) => {
  try {
    const response = await camerasApi.create(projectId, cameraData);
    const newCamera = response.data.result;

    // Tìm tên project
    const project = projects.find(p => p.id === parseInt(projectId));
    const projectName = project ? project.name : "Unknown Project";

    // Gắn projectName vào camera
    setCameras(prev => [...prev, { ...newCamera, projectName }]);

    // Cập nhật state projects
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === parseInt(projectId)
          ? { ...project, cameras: [...(project.cameras || []), newCamera] }
          : project
      )
    );

    setShowAddCamera(false);
  } catch (err) {
    console.error('Error adding camera:', err);
    setError(err.response?.data?.message || err.message);
  }
};


// --- Logic Xử lý User ---
const handleAddUser = async (userData) => {
  try {
    const response = await userApi.create(userData);
    setUsers([...users, response.data.result]);
    setShowAddUser(false);
  } catch (err) {
    console.error('Error adding user:', err);
    setError(err.response?.data?.message || err.message);
  }
};

const handleEditUser = (user) => {
  setSelectedUser(user);
  setShowEditUser(true);
};

const handleUpdateUser = async (userId, userData) => {
  try {
    const response = await userApi.update(userId, userData);
    setUsers(users.map(u => (u.id === userId ? response.data.result : u)));
    setShowEditUser(false);
  } catch (err) {
    console.error('Error updating user:', err);
    setError(err.response?.data?.message || err.message);
  }
};

const handleDeleteUser = async (userId) => {
  try {
    await userApi.delete(userId);
    setUsers(users.filter(u => u.id !== userId));
  } catch (err) {
    console.error('Error deleting user:', err);
    setError(err.response?.data?.message || err.message);
  }
};


// --- Logic Xử lý Role ---
const handleAddRole = async (roleData) => {
  try {
    const response = await roleApi.create(roleData);
    setRoles([...roles, response.data.result]);
    setShowAddRole(false);
  } catch (err) {
    console.error('Error adding role:', err);
    setError(err.response?.data?.message || err.message);
  }
};

const handleOpenEditRole = (role) => {
  setSelectedRole(role);
  setShowEditRole(true);
};

const handleUpdateRole = async (roleName, roleData) => {
  try {
    const response = await roleApi.update(roleName, roleData);
    setRoles(roles.map(r => (r.name === roleName ? response.data.result : r)));
    setShowEditRole(false);
  } catch (err) {
    console.error('Error updating role:', err);
    setError(err.response?.data?.message || err.message);
  }
};

const handleDeleteRole = async (roleName) => {
  try {
    await roleApi.delete(roleName);
    setRoles(roles.filter(r => r.name !== roleName));
  } catch (err) {
    console.error('Error deleting role:', err);
    setError(err.response?.data?.message || err.message);
  }
};


  // --- Render Logic ---
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
        <Typography ml={2}>Loading Management Data...</Typography>
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">Lỗi tải dữ liệu: {error}</Typography>;
  }

  return (
    <div className="manage-page">
      <div className="box-title">
        <h1>Manage</h1>
      </div>

      <div className="manage-section">
        <div className="manage-projects">
          <div className="section-header">
            <h2>Manage Projects</h2>
            <button onClick={() => setShowAddProject(true)}>
              Add New Project
            </button>
          </div>
          <ProjectTable 
            projects={projects}
            onEdit={handleOpenEditProject}
            onDelete={handleDeleteProject}
          />
        </div>
        {/* Phần Camera - Hiển thị cho cả Admin và Manager */}
        <div className="manage-cctv">
          <div className="section-header">
            <h2>Manage CCTV</h2>
            {/* SỬA: Hiển thị nút Add New Camera cho cả Admin và Manager */}
            <button onClick={() => setShowAddCamera(true)}>
              Add New Camera
            </button>
          </div>
          {cameras.length > 0 ? (
            <CameraTable 
              cameras={cameras} 
              onDelete={handleDeleteCamera}  // Chỉ cho phép xóa nếu là Admin
              canEdit={isAdmin} // Truyền prop để biết có thể edit không
            />
          ) : (
            <Typography variant="body1" color="textSecondary" style={{ padding: '20px', textAlign: 'center' }}>
              {isAdmin ? 'No cameras found.' : 'You do not have permission to view cameras.'}
            </Typography>
          )}
        </div>

        {/* Phần Users và Roles - Chỉ hiển thị nếu là Admin */}
        {isAdmin && (
          <>
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
                onDelete={handleDeleteUser}
              />
            </div>

            <div className="manage-roles">
              <div className="section-header">
                <h2>Manage Roles & Permissions</h2>
                <button onClick={() => setShowAddRole(true)}>
                  Add New Role
                </button>
              </div>
              <RoleTable 
                roles={roles}
                onEdit={handleOpenEditRole}
                onDelete={handleDeleteRole}
              />
            </div>
          </>
        )}
      </div>
      {showAddProject && (
        <AddProjectModal
          managers={users.filter(user => 
            user.roles?.some(role => role.name === 'MANAGER' || role.name === 'ROLE_MANAGER')
          )}
          onClose={() => setShowAddProject(false)}
          onAdd={handleAddProject}
        />
      )}

      {showEditProject && (
        <EditProjectModal
          project={selectedProject}
          managers={users.filter(user => 
            user.roles?.some(role => role.name === 'MANAGER' || role.name === 'ROLE_MANAGER')
          )}
          onClose={() => setShowEditProject(false)}
          onUpdate={(updatedData) => handleUpdateProject(selectedProject.id, updatedData)}
        />
      )}
      {/* Modals cho Camera - Hiển thị cho cả Admin và Manager */}
      {showAddCamera && (
        <AddCameraModal
          projects={projects}
          onClose={() => setShowAddCamera(false)}
          onAdd={handleAddCamera}
        />
      )}

      {/* Modals cho Users và Roles - Chỉ hiển thị nếu là Admin */}
      {isAdmin && (
        <>
          {showAddUser && ( 
            <AddUserModal 
              roles={roles}
              onClose={() => setShowAddUser(false)}
              onAdd={handleAddUser}
            />
          )}

          {showEditUser && (
            <EditUserModal
              user={selectedUser}
              allRoles={roles}
              onClose={() => setShowEditUser(false)}
              onUpdate={(updatedData) => handleUpdateUser(selectedUser.id, updatedData)}
            />
          )}
          
          {showAddRole && (
            <AddRoleModal
              allPermissions={allPermissions}
              onClose={() => setShowAddRole(false)}
              onAdd={handleAddRole}
            />
          )}
          
          {showEditRole && (
            <EditRoleModal
              role={selectedRole}
              allPermissions={allPermissions}
              onClose={() => setShowEditRole(false)}
              onUpdate={handleUpdateRole}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Manage;