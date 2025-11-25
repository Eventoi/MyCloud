import React from 'react';
import { formatBytes } from '../Storage/utils/formatBytes';

// Список пользователей с статистикой и действиями
export default function UserList({ users, onDelete, onEdit, onOpenStorage }) {
  return (
    <table className="user-table">
      <thead>
        <tr>
          <th>Логин</th>
          <th>Email</th>
          <th>Полное имя</th>
          <th>Админ</th>
          <th>Файлов</th>
          <th>Общий размер</th>
          <th>Управление файлами</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {users.map(u => (
          <tr key={u.id}>
            <td><b>{u.username}</b></td>
            <td>{u.email}</td>
            <td>{u.full_name}</td>
            <td>{u.is_administrator ? 'Да' : ''}</td>
            <td>{u.files_count ?? 0}</td>
            <td>{u.total_size ? formatBytes(u.total_size) : '0 Б'}</td>
            <td>
              <button onClick={() => onOpenStorage(u.id)}>Открыть хранилище</button>
            </td>
            <td>
              <button onClick={() => onEdit(u)}>Изменить</button>
              <button onClick={() => onDelete(u.id)}>Удалить</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}