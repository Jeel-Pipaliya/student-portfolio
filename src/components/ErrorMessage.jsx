function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <h3>Failed to Load Repositories</h3>
      <p className="error-text">{message || "An unexpected error occurred while fetching data."}</p>
      {onRetry && (
        <button className="retry-btn" onClick={onRetry}>
          🔄 Retry Fetch
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
