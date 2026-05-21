import { useRef } from 'react';

import { useDb } from '../db/DbContext';

export const FilePicker = () => {
  const { loadFile, loading } = useDb();
  const inputRef = useRef<HTMLInputElement>(null);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await loadFile(file);
    e.target.value = '';
  };

  return (
    <div className="file-picker">
      <button
        type="button"
        className="btn"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
      >
        {loading ? 'Открываем…' : 'Выбрать .db'}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".db,application/x-sqlite3,application/vnd.sqlite3"
        hidden
        onChange={onChange}
      />
    </div>
  );
};
