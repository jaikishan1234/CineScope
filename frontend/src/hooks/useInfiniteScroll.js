import { useEffect, useRef, useCallback } from 'react';

/**
 * Triggers a callback when user scrolls near the bottom of the page.
 * Used for infinite scroll pagination.
 */
const useInfiniteScroll = (callback, hasMore, isLoading) => {
  const observer = useRef(null);

  const lastElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          callback();
        }
      }, { threshold: 0.1 });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, callback]
  );

  useEffect(() => {
    return () => {
      if (observer.current) observer.current.disconnect();
    };
  }, []);

  return lastElementRef;
};

export default useInfiniteScroll;
