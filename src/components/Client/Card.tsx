import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  action,
}) => {
  return (
    <div
      className={`bg-surface-light dark:bg-surface-dark dark:border-border-dark flex flex-col overflow-hidden rounded-xl border border-stroke shadow-sm ${className}`}
    >
      {title && (
        <div className="dark:border-border-dark dark:bg-surface-dark flex items-center justify-between border-b border-stroke bg-white px-6 py-4">
          <h3 className="text-text-light dark:text-text-dark text-lg font-semibold">
            {title}
          </h3>
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="flex-1 bg-white p-6">{children}</div>
    </div>
  );
};
