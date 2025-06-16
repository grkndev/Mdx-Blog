"use client";

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export function LoadingBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setIsLoading(true);
    setProgress(20);

    const timer1 = setTimeout(() => setProgress(50), 100);
    const timer2 = setTimeout(() => setProgress(80), 300);
    const timer3 = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    }, 500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [pathname]);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-[999] h-1">
      <div 
        className="h-full bg-primary transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
} 