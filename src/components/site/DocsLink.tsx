import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

export function DocsLink({
  slug,
  className,
  children,
  onClick,
}: {
  slug: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link to="/docs/$slug" params={{ slug }} className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
