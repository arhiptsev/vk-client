import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { DEFAULT_MEDIA_URL } from '../common/constants';
import {
  buildIndexFromFiles,
  resolveLocalUrl,
  revokeIndex,
  type LocalMediaIndex,
  type MediaKind,
} from './localMediaIndex';

const SERVER_URL_KEY = 'vkclient.web.mediaServerUrl';

type MediaContextValue = {
  serverBaseUrl: string;
  setServerBaseUrl: (url: string) => void;
  localIndex: LocalMediaIndex | null;
  folderLabel: string | null;
  mediaCounts: { photos: number; audios: number; videos: number } | null;
  loadMediaFolder: (files: FileList) => void;
  clearLocalMedia: () => void;
  getPhotoUrl: (file: string) => string | null;
  getAudioUrl: (file: string) => string | null;
  getVideoUrl: (file: string) => string | null;
  isMediaConfigured: () => boolean;
};

const MediaContext = createContext<MediaContextValue | null>(null);

function normalizeBaseUrl(url: string) {
  return url.trim().replace(/\/$/, '');
}

export const MediaProvider = ({ children }: { children: ReactNode }) => {
  const [serverBaseUrl, setServerBaseUrlState] = useState(() => {
    const stored = localStorage.getItem(SERVER_URL_KEY);
    return normalizeBaseUrl(stored ?? DEFAULT_MEDIA_URL);
  });
  const [localIndex, setLocalIndex] = useState<LocalMediaIndex | null>(null);
  const [folderLabel, setFolderLabel] = useState<string | null>(null);
  const [mediaCounts, setMediaCounts] = useState<{
    photos: number;
    audios: number;
    videos: number;
  } | null>(null);

  useEffect(() => {
    return () => revokeIndex(localIndex);
  }, [localIndex]);

  const setServerBaseUrl = useCallback((url: string) => {
    const normalized = normalizeBaseUrl(url);
    setServerBaseUrlState(normalized);
    if (normalized) {
      localStorage.setItem(SERVER_URL_KEY, normalized);
    } else {
      localStorage.removeItem(SERVER_URL_KEY);
    }
  }, []);

  const clearLocalMedia = useCallback(() => {
    setLocalIndex((prev) => {
      revokeIndex(prev);
      return null;
    });
    setFolderLabel(null);
    setMediaCounts(null);
  }, []);

  const loadMediaFolder = useCallback((files: FileList) => {
    if (files.length === 0) return;

    const { index, rootLabel, counts } = buildIndexFromFiles(files);

    setLocalIndex((prev) => {
      revokeIndex(prev);
      return index;
    });
    setFolderLabel(rootLabel);
    setMediaCounts(counts);
  }, []);

  const resolveUrl = useCallback(
    (kind: MediaKind, file: string): string | null => {
      const local = resolveLocalUrl(localIndex, kind, file);
      if (local) return local;

      if (serverBaseUrl) {
        return `${serverBaseUrl}/${kind}/${file}`;
      }
      return null;
    },
    [localIndex, serverBaseUrl]
  );

  const value = useMemo(
    () => ({
      serverBaseUrl,
      setServerBaseUrl,
      localIndex,
      folderLabel,
      mediaCounts,
      loadMediaFolder,
      clearLocalMedia,
      getPhotoUrl: (file: string) => resolveUrl('photos', file),
      getAudioUrl: (file: string) => resolveUrl('audios', file),
      getVideoUrl: (file: string) => resolveUrl('videos', file),
      isMediaConfigured: () =>
        localIndex != null ||
        serverBaseUrl.length > 0 ||
        DEFAULT_MEDIA_URL.length > 0,
    }),
    [
      serverBaseUrl,
      setServerBaseUrl,
      localIndex,
      folderLabel,
      mediaCounts,
      loadMediaFolder,
      clearLocalMedia,
      resolveUrl,
    ]
  );

  return <MediaContext.Provider value={value}>{children}</MediaContext.Provider>;
};

export const useMedia = (): MediaContextValue => {
  const ctx = useContext(MediaContext);
  if (!ctx) {
    throw new Error('useMedia должен использоваться внутри MediaProvider');
  }
  return ctx;
};
