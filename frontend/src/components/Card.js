import React from 'react';

function Card({ 
  title, 
  icon, 
  children, 
  className = '', 
  headerClassName = '', 
  bodyClassName = '',
  footerContent = null 
}) {
  return (
    <div className={`card ${className}`}>
      {title && (
        <div className={`card-header d-flex align-items-center justify-content-between ${headerClassName}`}>
          <h5 className="card-title mb-0">
            {icon && <i className={`${icon} me-2`}></i>}
            {title}
          </h5>
        </div>
      )}
      <div className={`card-body ${bodyClassName}`}>
        {children}
      </div>
      {footerContent && (
        <div className="card-footer">
          {footerContent}
        </div>
      )}
    </div>
  );
}

export default Card;
