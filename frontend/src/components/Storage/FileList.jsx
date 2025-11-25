import React, { useEffect, useState, forwardRef, useImperativeHandle, useCallback } from 'react';
import PropTypes from 'prop-types';
import API from '../../api';
import FileItem from './FileItem';
import FileEditForm from './FileEditForm';

const FileList = forwardRef(function FileList({ userId = null, isAdminView = false }, ref) {
  const [files, setFiles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  const loadFiles = useCallback(async () => {
    try {
      let url = 'storage/files/';
      if (userId) url += `?user_id=${userId}`;
      const res = await API.get(url);
      setFiles(res.data);
    } catch {
      setFiles([]);
    }
  }, [userId]);

  useImperativeHandle(ref, () => ({
    loadFiles
  }));

  useEffect(() => { loadFiles(); }, [loadFiles]);

  const handleDelete = useCallback(async id => {
    if (window.confirm('Удалить файл?')) {
      await API.delete(`storage/files/${id}/`);
      loadFiles();
    }
  }, [loadFiles]);

  const handleEdit = useCallback((f) => {
    setEditingId(f.id);
    setNewName(f.original_name);
    setNewComment(f.comment || '');
  }, []);

  const handleSave = useCallback(async () => {
    await API.patch(`storage/files/${editingId}/`, { new_name: newName, comment: newComment });
    setEditingId(null);
    loadFiles();
  }, [editingId, newName, newComment, loadFiles]);

  const handleCopyLink = useCallback((specialLink) => {
    const url = `http://127.0.0.1:8000/download/s/${specialLink}/`;
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url)
        .then(() => alert('Ссылка скопирована!'))
        .catch(err => {
          alert('Ошибка копирования: ' + err);
        });
    } else {
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      try {
        document.execCommand('copy');
        alert('Ссылка скопирована!');
      } catch (err) {
        alert('Не удалось скопировать ссылку');
      }
      document.body.removeChild(input);
    }
  }, []);

  const handleDownload = useCallback(id => {
    setError('');
    const url = `http://127.0.0.1:8000/api/storage/files/${id}/download/`;
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', '');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, []);

  return (
    <div style={{ marginTop: 20 }}>
      <h4 style={{ marginBottom: 18 }}>{isAdminView ? 'Файлы выбранного пользователя:' : 'Мои файлы:'}</h4>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {files.length === 0 && <p>Нет файлов</p>}
      <div className="file-list">
        {files.map(f =>
          editingId === f.id ? null : (
            <FileItem
              key={f.id}
              file={f}
              onDownload={handleDownload}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onCopyLink={handleCopyLink}
            />
          )
        )}
      </div>
      {editingId && (
        <FileEditForm
          newName={newName}
          setNewName={setNewName}
          newComment={newComment}
          setNewComment={setNewComment}
          handleSave={handleSave}
          setEditingId={setEditingId}
        />
      )}
    </div>
  );
});

FileList.propTypes = {
  userId: PropTypes.number,
  isAdminView: PropTypes.bool
};

export default FileList;