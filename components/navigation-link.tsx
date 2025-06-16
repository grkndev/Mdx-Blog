"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useNavigationLoading } from "@/hooks/use-navigation-loading";
import { ComponentProps } from "react";

interface NavigationLinkProps extends ComponentProps<typeof Link> {
  children: React.ReactNode;
  className?: string;
}

export function NavigationLink({ 
  href, 
  children, 
  className,
  ...props 
}: NavigationLinkProps) {
  const router = useRouter();
  const { startLoading } = useNavigationLoading();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (props.onClick) {
      props.onClick(e);
    }
    
    // Start loading for external navigation
    if (typeof href === 'string' && href.startsWith('/')) {
      startLoading();
    }
  };

  return (
    <Link 
      href={href} 
      className={className}
      onClick={handleClick}
      {...props}
    >
      {children}
    </Link>
  );
} 