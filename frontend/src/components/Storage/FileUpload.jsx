import React, { useState } from 'react';
import API from '../../api';

export default function FileUpload({ onUploaded, userId = null }) {
  const [files, setFiles] = useState([]);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    setMessage('');
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage('Файл(ы) не выбраны!');
      return;
    }
    setIsUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('comment', comment);
        let url = 'storage/files/';
        if (userId) url += `?user_id=${userId}`;
        await API.post(url, formData);
      }
      setMessage('Файл(ы) успешно загружены!');
      setFiles([]);
      setComment('');
      if (onUploaded) onUploaded();
    } catch (err) {
      setMessage('Ошибка при загрузке файла(ов).');
      console.log('Ошибка:', err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="file-input"
        style={{ marginBottom: 12 }}
      />
      <input
        placeholder="Комментарий"
        value={comment}
        onChange={e => setComment(e.target.value)}
        className="file-input"
        style={{ marginBottom: 12 }}
      />
      <button
        type="button"
        onClick={handleUpload}
        disabled={isUploading}
        style={{ marginBottom: 12 }}
      >
        {isUploading ? 'Загрузка...' : 'Загрузить'}
      </button>
      <span className="file-upload-message">{message}</span>
      {files.length > 0 && (
        <div>
          <b>Выбрано файлов: {files.length}</b>
          <ul>
            {files.map((file, idx) => (
              <li key={idx}>
                {file.name} ({file.size} байт)
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}