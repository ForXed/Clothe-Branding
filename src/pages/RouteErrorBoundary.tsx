import React from 'react';

interface RouteErrorBoundaryProps {
  children?: React.ReactNode;
}

interface RouteErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches a failed lazy chunk load.
 *
 * After a deploy the old hashed chunks are gone, so a tab that is still open can request
 * a file the CDN no longer serves and the dynamic import rejects. Without a boundary that
 * rejection unmounts the whole tree and leaves a blank page; here the user gets an
 * explanation and a reload that picks up the new build.
 */
class RouteErrorBoundary extends React.Component<RouteErrorBoundaryProps, RouteErrorBoundaryState> {
  state: RouteErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): RouteErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error) {
    // Surface it in the console for whoever is debugging, without a monitoring service.
    console.error('Route load failed', error);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const isChunkFailure = /dynamically imported module|Importing a module script failed|ChunkLoadError/i.test(
      error.message,
    );

    return (
      <div role="alert" style={styles.wrap}>
        <h1 style={styles.title}>
          {isChunkFailure ? 'This page needs a refresh' : 'Something went wrong'}
        </h1>
        <p style={styles.text}>
          {isChunkFailure
            ? 'A newer version of Brutige was deployed while this tab was open, so part of the app could not load.'
            : 'The page failed to render. Reloading usually fixes it; if it keeps happening, the details are in the browser console.'}
        </p>
        <button type="button" style={styles.button} onClick={() => window.location.reload()}>
          Reload
        </button>
      </div>
    );
  }
}

const styles: Record<string, React.CSSProperties> = {
  wrap: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '32px',
    textAlign: 'center',
  },
  title: { fontSize: '20px', fontWeight: 700, margin: 0, color: 'var(--brut-text, #0f172a)' },
  text: { fontSize: '14px', color: '#64748b', margin: 0, maxWidth: '420px', lineHeight: 1.55 },
  button: {
    marginTop: '8px',
    padding: '11px 22px',
    border: 'none',
    borderRadius: '10px',
    background: '#6c47ff',
    color: '#fff',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
  },
};

export default RouteErrorBoundary;
