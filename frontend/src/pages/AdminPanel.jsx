import React, { useEffect, useState } from 'react';
import API from '../api';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UserList from '../components/Admin/UserList';
import UserEdit from '../components/Admin/UserEdit';
import FileList from '../components/Storage/FileList';

export default function AdminPanel() {
  const user = useSelector(state => state.user.user);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [viewingStorageUserId, setViewingStorageUserId] = useState(null);
  const [stats, setStats] = useState([]);

  useEffect(() => {
    if (!user?.is_administrator) navigate('/');
    else {
      loadUsers();
      loadStats();
    }
    // eslint-disable-next-line
  }, [user]);

  const loadUsers = async () => {
    const res = await API.get('users/admin/users/');
    setUsers(res.data);
  };

  const loadStats = async () => {
    const res = await API.get('storage/stats/');
    setStats(res.data);
  };

  const handleDelete = async id => {
    if (window.confirm('Удалить пользователя?')) {
      await API.delete(`users/admin/users/${id}/`);
      loadUsers();
      loadStats();
      if (viewingStorageUserId === id) setViewingStorageUserId(null);
    }
  };

  const handleOpenStorage = userId => {
    setViewingStorageUserId(userId);
  };

  const handleCloseStorage = () => {
    setViewingStorageUserId(null);
  };

  // Объединяем users и stats по user.id
  const usersWithStats = users.map(u => ({
    ...u,
    ...(stats.find(s => s.id === u.id) || {})
  }));

  return (
    <div className="container">
      <h2 style={{ marginBottom: 24 }}>Админ-панель</h2>
      <UserList
        users={usersWithStats}
        onDelete={handleDelete}
        onEdit={setEditing}
        onOpenStorage={handleOpenStorage}
      />
      {editing && (
        <UserEdit
          user={editing}
          onClose={() => setEditing(null)}
          onUpdated={() => { loadUsers(); loadStats(); }}
        />
      )}
      {viewingStorageUserId && (
        <div style={{ marginTop: 32, border: '2px solid #1976d2', borderRadius: 6, padding: 16, background: '#f8fafc' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
            <h3 style={{ margin: 0, marginRight: 16 }}>Хранилище пользователя: <b>{(users.find(u => u.id === viewingStorageUserId)?.username) || viewingStorageUserId}</b></h3>
            <button onClick={handleCloseStorage} style={{ marginLeft: 'auto' }}>Закрыть</button>
          </div>
          <FileList userId={viewingStorageUserId} isAdminView={true} />
        </div>
      )}
    </div>
  );
}