'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

// Silently refreshes the page every N minutes to pick up new articles
// without a hard reload — uses Next.js router.refresh() (ISR-aware)
export default function AutoRefresh({ intervalMinutes = 5 }: { intervalMinutes?: number }) {
  const router = useRouter();
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    const id = setInterval(() => {
      if (isMounted.current && document.visibilityState === 'visible') {
        router.refresh();
      }
    }, intervalMinutes * 60 * 1000);

    return () => {
      isMounted.current = false;
      clearInterval(id);
    };
  }, [router, intervalMinutes]);

  return null; // invisible
}
