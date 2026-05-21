export type MediaKind = 'photos' | 'audios' | 'videos';

export type LocalMediaIndex = {
  photos: Map<string, string>;
  audios: Map<string, string>;
  videos: Map<string, string>;
};

const SUBDIR: Record<MediaKind, RegExp> = {
  photos: /(?:^|\/)photos\/(.+)$/i,
  audios: /(?:^|\/)audios\/(.+)$/i,
  videos: /(?:^|\/)videos\/(.+)$/i,
};

export function createEmptyIndex(): LocalMediaIndex {
  return {
    photos: new Map(),
    audios: new Map(),
    videos: new Map(),
  };
}

export function revokeIndex(index: LocalMediaIndex | null) {
  if (!index) return;
  for (const kind of ['photos', 'audios', 'videos'] as const) {
    for (const url of index[kind].values()) {
      URL.revokeObjectURL(url);
    }
  }
}

export function buildIndexFromFiles(files: FileList | File[]): {
  index: LocalMediaIndex;
  rootLabel: string | null;
  counts: { photos: number; audios: number; videos: number };
} {
  const index = createEmptyIndex();
  let rootLabel: string | null = null;
  const fileArray = Array.from(files);

  for (const file of fileArray) {
    const relative =
      (file as File & { webkitRelativePath?: string }).webkitRelativePath || file.name;
    const normalized = relative.replace(/\\/g, '/');

    if (!rootLabel && normalized.includes('/')) {
      rootLabel = normalized.split('/')[0] ?? null;
    }

    const url = URL.createObjectURL(file);

    for (const kind of ['photos', 'audios', 'videos'] as const) {
      const match = normalized.match(SUBDIR[kind]);
      if (match) {
        const fileName = match[1].split('/').pop() ?? match[1];
        index[kind].set(fileName, url);
      }
    }
  }

  if (!rootLabel && fileArray.length > 0) {
    rootLabel = 'локальная папка';
  }

  return {
    index,
    rootLabel,
    counts: {
      photos: index.photos.size,
      audios: index.audios.size,
      videos: index.videos.size,
    },
  };
}

export function resolveLocalUrl(
  index: LocalMediaIndex | null,
  kind: MediaKind,
  file: string
): string | null {
  if (!index) return null;
  return index[kind].get(file) ?? null;
}
