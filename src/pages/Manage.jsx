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
const API_BASE_URL = "http://localhost:8080/safetyconstruction";

// Hàm kiểm tra vai trò Admin
const checkIsAdmin = () => {
  const token = getToken();
  if (!token) return false;
  try {
    const decodedToken = jwtDecode(token);
    const authorities = decodedToken.scope || decodedToken.roles || [];
    return authorities.includes('ROLE_ADMIN') || authorities.includes('ADMIN');
  } catch (e) {
    console.error("Lỗi giải mã token:", e);
    return false;
  }
};

const Manage = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState(getToken());
  const [isAdmin, setIsAdmin] = useState(false);

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
        const headers = { Authorization: `Bearer ${token}` };

        // Tải projects
        const projectRes = await fetch(`${API_BASE_URL}/api/projects`, { headers });
        const projectData = await projectRes.json();
        if (projectData.code !== 1000) throw new Error(`Project Error: ${projectData.message}`);
        const loadedProjects = projectData.result.content || [];
        setProjects(loadedProjects);

        let loadedCameras = [];
        
        if (isAdmin) {
          // Admin: tải tất cả cameras
          const cameraRes = await fetch(`${API_BASE_URL}/api/cameras`, { headers });
          const cameraData = await cameraRes.json();
          if (cameraData.code !== 1000) throw new Error(`Camera Error: ${cameraData.message}`);
          loadedCameras = cameraData.result.content || [];
        } else {
          // Manager: tải cameras từ từng project (cần CAMERA_READ)
          const cameraPromises = loadedProjects.map(project => 
            fetch(`${API_BASE_URL}/api/projects/${project.id}/cameras`, { headers })
              .then(res => res.json())
              .then(data => {
                if (data.code === 1000) {
                  return data.result.content.map(cam => ({
                    ...cam,
                    projectName: project.name
                  }));
                }
                return [];
              })
              .catch(err => {
                console.error(`Error fetching cameras for project ${project.id}:`, err);
                return [];
              })
          );
          
          const camerasResults = await Promise.all(cameraPromises);
          loadedCameras = camerasResults.flat();
        }

        setCameras(loadedCameras);

        // Xử lý dữ liệu Admin (chỉ nếu là Admin)
        if (isAdmin) {
          const [userRes, roleRes, permRes] = await Promise.all([
            fetch(`${API_BASE_URL}/users`, { headers }),
            fetch(`${API_BASE_URL}/roles`, { headers }),
            fetch(`${API_BASE_URL}/permissions`, { headers })
          ]);

          const userData = await userRes.json();
          if (userData.code !== 1000) throw new Error(`User Error: ${userData.message}`);
          setUsers(userData.result);

          const roleData = await roleRes.json();
          if (roleData.code !== 1000) throw new Error(`Role Error: ${roleData.message}`);
          setRoles(roleData.result);

          const permData = await permRes.json();
          if (permData.code !== 1000) throw new Error(`Permission Error: ${permData.message}`);
          setAllPermissions(permData.result);
        }
        // console.log('Users data:', userData.result);
        // console.log('Projects data:', projectData.result.content);
        // console.log('First project manager:', projectData.result.content[0]?.manager);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.message);
      }
      setLoading(false);
    };

    fetchAllData();
  }, [token, isAdmin]);

  const handleAddProject = async (projectData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData), // (projectData là { name, description })
      });
      const data = await response.json();
      if (data.code !== 1000) throw new Error(data.message);
      
      setProjects([data.result, ...projects]); // Thêm dự án mới vào đầu danh sách
      setShowAddProject(false);
    } catch (err) {
      console.error('Error adding project:', err);
      setError(err.message);
    }
  };
  
  const handleOpenEditProject = (project) => {
    setSelectedProject(project);
    setShowEditProject(true);
  };

  const handleUpdateProject = async (projectId, projectData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData), // (projectData là { name, description })
      });
      const data = await response.json();
      if (data.code !== 1000) throw new Error(data.message);
      
      setProjects(projects.map(p => p.id === projectId ? data.result : p));
      setShowEditProject(false);
    } catch (err) {
      console.error('Error updating project:', err);
      setError(err.message);
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm("Bạn có chắc muốn xóa dự án này? Việc này KHÔNG THỂ hoàn tác.")) {
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.code !== 1000) throw new Error(data.message);
      
      setProjects(projects.filter(p => p.id !== projectId));
    } catch (err) {
      console.error('Error deleting project:', err);
      setError(err.message);
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
    const response = await fetch(
      `${API_BASE_URL}/api/projects/${cameraToDelete.projectId}/cameras/${cameraToDelete.id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    if (data.code !== 1000) throw new Error(data.message);
    
    // 1. Xóa camera khỏi state cameras
    setCameras(cameras.filter(camera => camera.id !== cameraToDelete.id));
    
    // 2. QUAN TRỌNG: Cập nhật state projects - xóa camera khỏi project
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === cameraToDelete.projectId 
          ? {
              ...project,
              cameras: project.cameras ? project.cameras.filter(cam => cam.id !== cameraToDelete.id) : []
            }
          : project
      )
    );
    
    console.log('Camera deleted and projects state updated');
  } catch (err) {
    console.error('Error deleting camera:', err);
    setError(err.message);
  }
};

  const handleAddCamera = async (projectId, cameraData) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/projects/${projectId}/cameras`, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(cameraData),
      }
    );
    const data = await response.json();
    if (data.code !== 1000) throw new Error(data.message);

    // TÌM PROJECT NAME CHÍNH XÁC
    const project = projects.find(p => p.id === parseInt(projectId));
    const projectName = project ? project.name : "Unknown Project";

    // Thêm camera mới với projectName chính xác
    const newCamera = {
      ...data.result,
      projectName: projectName
    };

    setCameras(prevCameras => [...prevCameras, newCamera]);

    // CẬP NHẬT STATE PROJECTS
    setProjects(prevProjects => 
      prevProjects.map(project => 
        project.id === parseInt(projectId) 
          ? {
              ...project,
              cameras: [...(project.cameras || []), data.result]
            }
          : project
      )
    );

    setShowAddCamera(false);
  } catch (err) {
    console.error('Error adding camera:', err);
    setError(err.message);
  }
};
  // --- Logic Xử lý User (chỉ Admin) ---
  const handleAddUser = async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (data.code !== 1000) throw new Error(data.message);

      setUsers([...users, data.result]);
      setShowAddUser(false);
    } catch (err) {
      console.error('Error adding user:', err);
      setError(err.message);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditUser(true);
  };

  const handleUpdateUser = async (userId, userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });
      const data = await response.json();
      if (data.code !== 1000) throw new Error(data.message);
      
      setUsers(users.map(user => user.id === userId ? data.result : user));
      setShowEditUser(false);
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.message);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.code !== 1000) throw new Error(data.message);
      
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.message);
    }
  };

  // --- Logic Xử lý Role (chỉ Admin) ---
  const handleAddRole = async (roleData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roleData),
      });
      const data = await response.json();
      if (data.code !== 1000) throw new Error(data.message);

      setRoles([...roles, data.result]);
      setShowAddRole(false);
    } catch (err) {
      console.error('Error adding role:', err);
      setError(err.message);
    }
  };

  const handleOpenEditRole = (role) => {
    setSelectedRole(role);
    setShowEditRole(true);
  };
  
  const handleUpdateRole = async (roleName, roleData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/roles/${roleName}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(roleData),
      });
      const data = await response.json();
      if (data.code !== 1000) throw new Error(data.message);

      setRoles(roles.map(r => r.name === roleName ? data.result : r));
      setShowEditRole(false);
    } catch (err) {
      console.error('Error updating role:', err);
      setError(err.message);
    }
  };

  const handleDeleteRole = async (roleName) => {
    try {
      const response = await fetch(`${API_BASE_URL}/roles/${roleName}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.code !== 1000) throw new Error(data.message);
      
      setRoles(roles.filter(role => role.name !== roleName));
    } catch (err) {
      console.error('Error deleting role:', err);
      setError(err.message);
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