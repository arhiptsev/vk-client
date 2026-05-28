import {
  BrowserRouter,
  HashRouter,
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

const AppRouter =
  typeof window !== 'undefined' && window.location.protocol === 'file:'
    ? HashRouter
    : BrowserRouter;

import { FilePicker } from './components/FilePicker';
import { MediaSetup } from './components/MediaSetup';
import { DbProvider, useDb } from './db/DbContext';
import { MediaProvider } from './media/MediaContext';
import { DialogPage } from './pages/DialogPage';
import { DialogsPage } from './pages/DialogsPage';

const AppHeader = () => {
  const { fileName, reset } = useDb();
  const { pathname } = useLocation();
  const onDialogsList = pathname === '/';

  return (
    <header className="app-header">
      {onDialogsList ? (
        <h1>Диалоги</h1>
      ) : (
        <Link to="/" className="app-header-title">
          ← Диалоги
        </Link>
      )}
      {fileName && (
        <span className="file-name" title={fileName}>
          {fileName}
        </span>
      )}
      <MediaSetup compact />
      <button type="button" className="btn btn-secondary" onClick={reset}>
        Другой файл
      </button>
    </header>
  );
};

const AppRoutes = () => {
  const { ready, loading, error } = useDb();

  if (!ready) {
    return (
      <div className="start-screen centered">
        <h2>vkclient — веб</h2>
        <p className="muted">
          Выберите файл SQLite с экспортом VK (тот же <code>sqlite.db</code>, что и для
          мобильного приложения). База обрабатывается локально в браузере через WebAssembly
          (sql.js), на сервер ничего не отправляется.
        </p>
        <FilePicker />
        <MediaSetup />
        {loading && <p className="muted">Открываем SQLite…</p>}
        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="app-shell">
      <AppHeader />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<DialogsPage />} />
          <Route path="/dialog/:id" element={<DialogPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default function App() {
  return (
    <MediaProvider>
      <DbProvider>
        <AppRouter>
          <div className="app-viewport">
            <AppRoutes />
          </div>
        </AppRouter>
      </DbProvider>
    </MediaProvider>
  );
}
