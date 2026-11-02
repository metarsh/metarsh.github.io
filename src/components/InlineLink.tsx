import React, { type ReactNode } from "react";

export const InlineLink: React.FC<{
  href: string;
  icon?: ReactNode;
  children: ReactNode;
  external?: boolean;
  className?: string;
}> = ({ href, icon, children, external = true, className = "" }) => {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`inline-flex items-center gap-1 text-white hover:text-white transition-colors group cursor-pointer ${className}`}
    >
      {icon && (
        <span
          className="inline-flex shrink-0 items-center justify-center text-xs opacity-90 group-hover:opacity-100 transition-opacity"
          aria-hidden="true"
        >
          {icon}
        </span>
      )}
      <span className="border-b border-dashed border-zinc-500 group-hover:border-zinc-200 transition-colors">
        {children}
      </span>
    </a>
  );
};
