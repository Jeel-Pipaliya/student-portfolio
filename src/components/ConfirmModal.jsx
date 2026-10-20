/**
 * Confirmation Dialog Component for Supplementary Problem 2 (Practical 6)
 * Confirms task deletion before executing DELETE /tasks/:id against MongoDB
 */
import React, { useEffect } from 'react';

export default function ConfirmModal({
  isOpen,
  title = 'Confirm Permanent Deletion',
  message,
  taskTitle,
  taskId,
  onConfirm,
  onCancel,
  loading = false,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={loading ? undefined : onCancel}>
      <div
        className="modal-content confirm-modal-box"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <div className="confirm-icon-wrapper">
          <span className="confirm-warning-icon">⚠</span>
        </div>

        <h3 id="confirm-modal-title" className="confirm-modal-title">
          {title}
        </h3>

        <p className="confirm-modal-text">
          {message || (
            <>
              Are you sure you want to remove{' '}
              <strong>"{taskTitle || `Task #${taskId}`}"</strong>?
              <br />
              <span className="text-secondary" style={{ fontSize: '0.85rem' }}>
                This action will permanently delete the document from the MongoDB <code>tasks</code> collection.
              </span>
            </>
          )}
        </p>

        <div className="confirm-modal-actions">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting from MongoDB...' : 'Confirm Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
