import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/Storage/FileUpload';
import FileList from '../components/Storage/FileList';

export default function StoragePage() {
  const user = useSelector(state => state.user.user);
  const navigate = useNavigate();
  const fileListRef = useRef();

  useEffect(() => {
    if (!user) navigate('/login');
  }, [user, navigate]);

  return (
    <div className="container" style={{ padding: 20 }}>
      <h3>Моё хранилище</h3>
      <FileUpload onUploaded={() => fileListRef.current && fileListRef.current.loadFiles()} />
      <FileList ref={fileListRef} />
    </div>
  );
}