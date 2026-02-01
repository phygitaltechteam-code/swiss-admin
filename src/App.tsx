import {RouterProvider, createRouter} from '@tanstack/react-router';
import React, {useEffect, useRef, useState} from 'react';

// Import the generated route tree
import {routeTree} from './routeTree.gen';

import AuthContextProvider from './context/AuthContextProvider';
import {ModalProvider} from './context/ModalContext';
import NotFound404 from './layouts/NotFound404';
import {Toaster} from 'react-hot-toast';
import QueryProvider from './lib/react-query/QueryProvider';

// Create a new router instance
const router = createRouter({
  routeTree,
  defaultNotFoundComponent: NotFound404,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const App: React.FC = () => {
  const [isPulling, setIsPulling] = useState(false);
  const pullRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* ---------- helper ---------- */
    const forceReload = () => {
      // 1 – standard
      try {
        window.location.reload();
      } catch (_) {}
      // 2 – history.go fallback
      try {
        setTimeout(() => history.go(0), 50);
      } catch (_) {}
      // 3 – hard refresh (cache‑buster)
      try {
        setTimeout(() => {
          window.location.replace(
            window.location.href.split('#')[0] + '?refresh=' + Date.now(),
          );
        }, 100);
      } catch (_) {}
    };

    /* ---------- pull‑to‑refresh ---------- */
    const THRESHOLD = 80;
    let startY = 0;
    let pulling = false;
    let triggered = false;

    const onStart = (e: TouchEvent) => {
      if (window.scrollY === 0) {
        pulling = true;
        triggered = false;
        startY = e.touches[0].clientY;
        setIsPulling(true); // ✅ Show spinner
      }
    };

    const onMove = (e: TouchEvent) => {
      if (!pulling || triggered) return;

      const distance = e.touches[0].clientY - startY;
      const el = pullRef.current;

      if (distance > 0 && el)
        el.style.transform = `translateY(${Math.min(distance, THRESHOLD)}px)`;

      if (distance > THRESHOLD) {
        triggered = true;

        if (el) {
          el.style.transition = 'transform 0.25s ease';
          el.style.transform = `translateY(${THRESHOLD}px)`;
        }

        // ✅ delay reload to show spinner
        setTimeout(() => {
          setIsPulling(false); // hide spinner just before reload
          forceReload();
        }, 500); // give spinner ~500ms to show
      }
    };

    const onEnd = () => {
      pulling = false;
      const el = pullRef.current;

      if (!triggered && el) {
        el.style.transition = 'transform 0.25s ease';
        el.style.transform = 'translateY(0px)';
      }

      setTimeout(() => {
        setIsPulling(false); // ✅ Hide spinner after cancel
      }, 250);
    };

    window.addEventListener('touchstart', onStart, {passive: true});
    window.addEventListener('touchmove', onMove, {passive: true});
    window.addEventListener('touchend', onEnd, {passive: true});

    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, []);

  return (
    <>
      <div
        ref={pullRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          transform: 'translateY(0)',
          transition: 'transform 0.2s ease',
          pointerEvents: 'none',
        }}
      >
        <div style={{opacity: isPulling ? 1 : 0, transition: 'opacity 0.3s'}}>
          <div
            style={{
              width: 24,
              height: 24,
              border: '3px solid #ccc',
              borderTop: '3px solid #000',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
            }}
          ></div>
        </div>
      </div>{' '}
      <AuthContextProvider>
        <ModalProvider>
          <QueryProvider>
            <Toaster />
            <RouterProvider router={router} />
          </QueryProvider>
        </ModalProvider>
      </AuthContextProvider>
    </>
  );
};

export default App;
