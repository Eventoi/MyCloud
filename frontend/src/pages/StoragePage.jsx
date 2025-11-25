import React, { useRef } from 'react';
import FileUpload from '../components/Storage/FileUpload';
import FileList from '../components/Storage/FileList';

export default function StoragePage() {
  const fileListRef = useRef();

  return (
    <div className="container" style={{ padding: 20 }}>
      <h3>Моё хранилище</h3>
      <FileUpload onUploaded={() => fileListRef.current && fileListRef.current.loadFiles()} />
      <FileList ref={fileListRef} />
    </div>
  );
}