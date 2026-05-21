import { useRef } from 'react';

import { useMedia } from '../media/MediaContext';

type Props = {
  compact?: boolean;
};

export const MediaSetup = ({ compact = false }: Props) => {
  const {
    serverBaseUrl,
    setServerBaseUrl,
    folderLabel,
    mediaCounts,
    loadMediaFolder,
    clearLocalMedia,
    isMediaConfigured,
  } = useMedia();
  const folderInputRef = useRef<HTMLInputElement>(null);

  const onFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    loadMediaFolder(files);
    e.target.value = '';
  };

  const totalIndexed =
    (mediaCounts?.photos ?? 0) + (mediaCounts?.audios ?? 0) + (mediaCounts?.videos ?? 0);

  return (
    <div className={`media-setup${compact ? ' media-setup--compact' : ''}`}>
      {!compact && (
        <p className="muted media-setup-hint">
          Браузер не может читать путь с диска (например <code>C:\media</code>) — выберите
          папку, внутри которой есть каталоги <code>photos</code>, <code>audios</code>,{' '}
          <code>videos</code> (как на медиа-сервере). Либо укажите URL сервера.
        </p>
      )}

      <div className="media-setup-row">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => folderInputRef.current?.click()}
        >
          {folderLabel ? 'Сменить папку' : 'Выбрать папку с медиа'}
        </button>
        <input
          ref={folderInputRef}
          type="file"
          {...({ webkitdirectory: '', directory: '' } as React.InputHTMLAttributes<HTMLInputElement>)}
          multiple
          hidden
          onChange={onFolderChange}
        />
        {folderLabel && (
          <button type="button" className="btn btn-secondary" onClick={clearLocalMedia}>
            Сбросить
          </button>
        )}
      </div>

      {folderLabel && (
        <p className="media-setup-status">
          <span title={folderLabel}>{folderLabel}</span>
          {totalIndexed > 0 && (
            <>
              {' '}
              · {mediaCounts?.photos ?? 0} фото, {mediaCounts?.audios ?? 0} аудио,{' '}
              {mediaCounts?.videos ?? 0} видео
            </>
          )}
        </p>
      )}

      <label className="media-setup-url">
        <span className="media-setup-url-label">URL медиа-сервера</span>
        <input
          type="url"
          className="media-setup-url-input"
          placeholder="https://media.example.com"
          value={serverBaseUrl}
          onChange={(e) => setServerBaseUrl(e.target.value)}
        />
      </label>

      {!compact && !isMediaConfigured() && (
        <p className="muted media-setup-optional">
          Медиа необязательны — без папки и URL будут только имена файлов в сообщениях.
        </p>
      )}
    </div>
  );
};
