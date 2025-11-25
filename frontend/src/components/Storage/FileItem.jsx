import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { formatLocalDate } from './utils/formatLocalDate';
import { formatBytes } from './utils/formatBytes';
import API from '../../api';

const FileItem = React.memo(function FileItem({
  file, onDownload, onEdit, onDelete, onCopyLink
}) {
  const handleCopyLink = useCallback(async () => {
    const res = await API.post(`storage/files/${file.id}/share/`);
    onCopyLink(res.data.special_link);
  }, [file.id, onCopyLink]);

  return (
    <div className="file-card">
      <div className="file-info-row">
        <b>{file.original_name}</b> <span className="file-size">({formatBytes(file.size)})</span>
        {file.comment && <span className="file-comment">&nbsp;— {file.comment}</span>}
      </div>
      <div className="file-meta">
        Загрузка: {formatLocalDate(file.uploaded_at)} | Последнее скачивание: {formatLocalDate(file.last_downloaded_at)}
      </div>
      <div className="file-actions">
        <button onClick={() => onDownload(file.id)}>Скачать</button>
        <button onClick={() => onEdit(file)}>Редактировать</button>
        <button onClick={() => onDelete(file.id)}>Удалить</button>
        <button onClick={handleCopyLink}>Копировать ссылку</button>
      </div>
    </div>
  );
});

FileItem.propTypes = {
  file: PropTypes.object.isRequired,
  onDownload: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onCopyLink: PropTypes.func.isRequired
};

export default FileItem;