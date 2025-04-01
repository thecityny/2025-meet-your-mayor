import React from "react";

export const OutboundLink: React.FC<{
  to: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}> = ({ to, children, className, style }) => {
  return (
    <a
      className={className}
      style={style}
      href={to}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
};
