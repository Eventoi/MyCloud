import React from 'react';
import PropTypes from 'prop-types';

const FileEditForm = React.memo(function FileEditForm({
  newName, setNewName, newComment, setNewComment, handleSave, setEditingId
}) {
  return (
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
        <button onClick={handleSave} style={{ marginRight: 10 }}>Сохранить</button>
        <button onClick={() => setEditingId(null)}>Отмена</button>
      </div>
    </div>
  );
});

FileEditForm.propTypes = {
  newName: PropTypes.string.isRequired,
  setNewName: PropTypes.func.isRequired,
  newComment: PropTypes.string.isRequired,
  setNewComment: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  setEditingId: PropTypes.func.isRequired
};

export default FileEditForm;