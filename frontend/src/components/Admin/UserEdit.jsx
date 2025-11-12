import React, { useState } from 'react';
import API from '../../api';

// Форма редактирования пользователя
export default function UserEdit({ user, onClose, onUpdated }) {
  const [fullName, setFullName] = useState(user.full_name || '');
  const [isAdmin, setIsAdmin] = useState(user.is_administrator);

  const handleSave = async () => {
    try {
      await API.patch(`users/admin/users/${user.id}/`, {
        full_name: fullName,
        is_administrator: isAdmin
      });
      onUpdated();
      onClose();
    } catch {
      alert('Ошибка при сохранении изменений');
    }
  };

  return (
    <div style={{ border: '1px solid gray', padding: 10, marginTop: 10 }}>
      <h4>Редактировать пользователя: {user.username}</h4>
      <label>
        Полное имя:{' '}
        <input value={fullName} onChange={e => setFullName(e.target.value)} />
      </label>
      <br />
      <label>
        Администратор:{' '}
        <input
          type="checkbox"
          checked={isAdmin}
          onChange={e => setIsAdmin(e.target.checked)}
        />
      </label>
      <br />
      <button onClick={handleSave}>Сохранить</button>{' '}
      <button onClick={onClose}>Отмена</button>
    </div>
  );
}
