import './common.css';

export const Card = ({ 
  children, 
  className = '', 
  hoverable = true,
  ...props 
}) => {
  return (
    <div 
      className={`card ${hoverable ? 'card-hoverable' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardImage = ({ src, alt, className = '' }) => (
  <div className={`card-image ${className}`}>
    <img src={src} alt={alt} loading="lazy" />
  </div>
);

export const CardContent = ({ children, className = '' }) => (
  <div className={`card-content ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`card-title ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`card-description ${className}`}>
    {children}
  </p>
);

export default Card;
