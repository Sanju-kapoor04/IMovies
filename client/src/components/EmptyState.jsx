import React from 'react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  icon = 'bi-inbox',
  title = 'No items found',
  description = 'There are currently no items matching your criteria.',
  actionText,
  actionLink,
  onAction,
}) => {
  return (
    <div className="text-center p-5 rounded-4 bg-dark bg-opacity-40 border border-secondary border-opacity-25 my-4">
      <div className="mb-3 text-secondary">
        <i className={`bi ${icon}`} style={{ fontSize: '3.5rem' }}></i>
      </div>
      <h4 className="text-white fw-bold mb-2">{title}</h4>
      <p className="text-secondary small mx-auto mb-4" style={{ maxWidth: '420px' }}>
        {description}
      </p>

      {actionText && actionLink && (
        <Link to={actionLink} className="btn btn-cinema-primary">
          {actionText}
        </Link>
      )}

      {actionText && onAction && (
        <button type="button" onClick={onAction} className="btn btn-cinema-primary">
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
