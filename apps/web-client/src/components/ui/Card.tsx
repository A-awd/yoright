import React from 'react';

type CardPadding = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  children: React.ReactNode;
  padding?: CardPadding;
  hover?: boolean;
  onClick?: () => void;
  className?: string;
}

const paddingStyles: Record<CardPadding, string> = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card: React.FC<CardProps> = ({
  children,
  padding = 'md',
  hover = false,
  onClick,
  className = '',
}) => {
  const isInteractive = !!onClick || hover;

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      onClick={onClick}
      className={`
        bg-white rounded-3xl shadow-card
        ${paddingStyles[padding]}
        ${isInteractive
          ? 'transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 cursor-pointer'
          : ''
        }
        ${onClick ? 'w-full text-left' : ''}
        ${className}
      `}
    >
      {children}
    </Component>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, className = '' }) => (
  <div className={`mb-4 ${className}`}>{children}</div>
);

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export const CardBody: React.FC<CardBodyProps> = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, className = '' }) => (
  <div className={`mt-4 pt-4 border-t border-charcoal-100 ${className}`}>{children}</div>
);

export default Card;
