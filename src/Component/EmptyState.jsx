import React from 'react';

// Presentational empty state: one serif line, one helpful sentence, one action.
const EmptyState = ({ title, body, actionLabel, onAction }) => (
  <div className="empty-state">
    <p className="empty-state-title">{title}</p>
    <p className="empty-state-body">{body}</p>
    {actionLabel && onAction ? (
      <button type="button" onClick={onAction}>{actionLabel}</button>
    ) : null}
  </div>
);

export default EmptyState;
