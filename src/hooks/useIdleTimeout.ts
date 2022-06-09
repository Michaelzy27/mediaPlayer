import { useEffect, useMemo } from 'react';

const useIdleTimeout = (
  timeoutMs = 3600000,
  events: Array<'mousedown' | 'keydown' | 'touchstart'>,
  onTimeout: () => void,
  id?: string
) => {
  const timeoutKey = useMemo(() => {
    return id ? `${id}.cf.timeout` : null;
  }, [id]);

  useEffect(() => {
    const resetTimeout = () => {
      if (timeoutKey) {
        const newExpiry = new Date().getTime() + timeoutMs;
        window.localStorage.setItem(timeoutKey, newExpiry.toString());
      }
    };

    let idleCheckInterval: any;
    if (timeoutKey) {
      events.forEach((eventName: string) => {
        window.addEventListener(eventName, resetTimeout);
      });

      idleCheckInterval = setInterval(() => {
        const timeNow = new Date().getTime();
        const expTime = window.localStorage.getItem(timeoutKey);
        if (!expTime || timeNow >= parseInt(expTime)) {
          onTimeout();
        }
      }, 10000);

      resetTimeout();
    }

    // clean up
    return () => {
      // remove interval
      if (idleCheckInterval) {
        clearInterval(idleCheckInterval);
      }

      // remove listeners
      events.forEach((eventName: string) => {
        window.removeEventListener(eventName, resetTimeout);
      });

      // clean up local storage
      const keys = Object.keys(window.localStorage).filter((k: string) => {
        return k.endsWith('.cf.timeout');
      });
      if (keys.length) {
        keys.forEach((k: string) => {
          window.localStorage.removeItem(k);
        });
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeoutKey]);
};

export default useIdleTimeout;
