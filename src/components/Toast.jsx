/**
 * Toast Component for Supplementary Problem 3 (Practical 6)
 * Provides animated feedback for all API operations (create, update, delete, error)
 */
import React, { useEffect } from 'react';

export default function Toast({ toast, onClose }) {
  const id = toast?.id;
  const duration = toast?.duration ?? 4000;

  useEffect(() => {
    if (!toast || duration <= 0) return;
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose, toast]);

  if (!toast) return null;

  const { type = 'info', title, message } = toast;

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
