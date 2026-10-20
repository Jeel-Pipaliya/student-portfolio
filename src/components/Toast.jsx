/**
 * Toast Component for Supplementary Problem 3 (Practical 6)
 * Provides animated feedback for all API operations (create, update, delete, error)
 */
import React, { useEffect } from 'react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  const { id, type = 'info', title, message, duration = 4000 } = toast;

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✓';
      case 'error':
        return '⚠';
      case 'warning':
        return '⚡';
      default:
        return 'ℹ';
    }
  };

  const getStyleClass = () => {
    switch (type) {
      case 'success':
        return 'toast-success';
      case 'error':
        return 'toast-error';
      case 'warning':
        return 'toast-warning';
      default:
        return 'toast-info';
    }
  };

  return (
    <div className={`toast-item ${getStyleClass()}`} role="alert">
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-content">
        {title && <div className="toast-title">{title}</div>}
        <div className="toast-message">{message}</div>
      </div>
      <button
        type="button"
        className="toast-close"
        onClick={() => onClose(id)}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
}
