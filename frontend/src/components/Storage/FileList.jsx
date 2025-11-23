import React, { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import API from '../../api';

// Функция преобразования строки даты из UTC в local time
function formatLocalDate(utcString) {
  if (!utcString) return '—';
  const date = new Date(utcString); // Парсит как UTC
  return date.toLocaleString('ru-RU'); // Показывает время по локали и таймзоне браузера
}

const FileList = forwardRef(function FileList({ userId = null, isAdminView = false }, ref) {
  const [files, setFiles] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState('');
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');

  const loadFiles = async () => {
    try {
      let url = 'storage/files/';
      if (userId) url += `?user_id=${userId}`;
      const res = await API.get(url);
      setFiles(res.data);
    } catch {
      setFiles([]);
    }
  };

  useImperativeHandle(ref, () => ({
    loadFiles
  }));

  useEffect(() => { loadFiles(); }, [userId]);

  const handleDelete = async id => {
    if (window.confirm('Удалить файл?')) {
      await API.delete(`storage/files/${id}/`);
      loadFiles();
    }
  };

  const handleEdit = (f) => {
    setEditingId(f.id);
    setNewName(f.original_name);
    setNewComment(f.comment || '');
  };

  const handleSave = async id => {
    await API.patch(`storage/files/${id}/`, { new_name: newName, comment: newComment });
    setEditingId(null);
    loadFiles();
  };

  const handleCopyLink = (specialLink) => {
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
  };

  const handleDownload = id => {
    setError('');
    const url = `http://127.0.0.1:8000/api/storage/files/${id}/download/`;
    const a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', '');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h4 style={{ marginBottom: 18 }}>{isAdminView ? 'Файлы выбранного пользователя:' : 'Мои файлы:'}</h4>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {files.length === 0 && <p>Нет файлов</p>}
      <div className="file-list">
        {files.map(f => (
          <div className="file-card" key={f.id}>
            {editingId === f.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: 350 }}>
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="file-input"
                  style={{ marginBottom: 6 }}
                />
                <input
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  className="file-input"
                  style={{ marginBottom: 6 }}
                />
                <div style={{ marginTop: 4 }}>
                  <button onClick={() => handleSave(f.id)} style={{ marginRight: 10 }}>Сохранить</button>
                  <button onClick={() => setEditingId(null)}>Отмена</button>
                </div>
              </div>
            ) : (
              <div>
                <div className="file-info-row">
                  <b>{f.original_name}</b> <span className="file-size">({formatBytes(f.size)})</span>
                  {f.comment && <span className="file-comment">&nbsp;— {f.comment}</span>}
                </div>
                <div className="file-meta">
                  Загрузка: {formatLocalDate(f.uploaded_at)} | Последнее скачивание: {formatLocalDate(f.last_downloaded_at)}
                </div>
                <div className="file-actions">
                  <button onClick={() => handleDownload(f.id)}>Скачать</button>
                  <button onClick={() => handleEdit(f)}>Редактировать</button>
                  <button onClick={() => handleDelete(f.id)}>Удалить</button>
                  <button onClick={async () => {
                    const res = await API.post(`storage/files/${f.id}/share/`);
                    handleCopyLink(res.data.special_link);
                  }}>Копировать ссылку</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
});

function formatBytes(bytes) {
  if (bytes === 0) return '0 Б';
  const k = 1024;
  const sizes = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export default FileList;