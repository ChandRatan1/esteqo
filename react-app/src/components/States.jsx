export function Loading({ label = 'Loading…' }) {
  return (
    <div className="state" role="status" aria-live="polite">
      <div className="spinner" />
      <p>{label}</p>
    </div>
  );
}

export function ErrorState({ error, onRetry }) {
  return (
    <div className="state" role="alert">
      <p>{error?.message || 'Something went wrong.'}</p>
      {onRetry && (
        <p style={{ marginTop: 18 }}>
          <button type="button" className="btn btn--secondary" onClick={onRetry}>
            Try again
          </button>
        </p>
      )}
    </div>
  );
}

export function EmptyState({ children }) {
  return <div className="state">{children}</div>;
}

export function CardSkeletons({ count = 4 }) {
  return (
    <div className="grid grid--4">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton skeleton--card" />
      ))}
    </div>
  );
}
