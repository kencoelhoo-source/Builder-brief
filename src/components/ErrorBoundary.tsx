import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

const CHUNK_RE =
  /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk|error loading dynamically imported module/i;

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Kavach render error:', error, info.componentStack);
    const msg = `${error?.name || ''} ${error?.message || ''}`;
    if (!CHUNK_RE.test(msg)) return;
    try {
      if (!sessionStorage.getItem('kavach_chunk_reload')) {
        sessionStorage.setItem('kavach_chunk_reload', '1');
        window.location.reload();
      }
    } catch {
      /* ignore */
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          padding: 24,
          fontFamily: 'system-ui, sans-serif',
          background: '#f4efe6',
          color: '#2a241c',
        }}
      >
        <div style={{ maxWidth: 420, textAlign: 'center' }}>
          <p style={{ fontWeight: 700, fontSize: 20, margin: 0 }}>Kavach could not finish rendering</p>
          <p style={{ marginTop: 10, color: '#6b6156', lineHeight: 1.5 }}>
            Reload the page. A saved draft stays on this device if storage is available.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              marginTop: 18,
              padding: '10px 18px',
              borderRadius: 999,
              border: 0,
              background: '#1c1c1c',
              color: '#fffdf8',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
