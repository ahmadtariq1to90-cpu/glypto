import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

export function SocialBarManager() {
  const location = useLocation();
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const scriptId = 'adsterra-social-bar-script';
  const isAdVisibleRef = useRef(false);

  const injectSocialBar = () => {
    // If ad is already visible, don't re-inject
    if (isAdVisibleRef.current) return;

    // Remove existing script if any
    const existingScript = document.getElementById(scriptId);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://pl29003205.profitablecpmratenetwork.com/88/a1/ee/88a1ee9665c441b7575bda546e234b4b.js?t=${Date.now()}`;
    script.async = true;
    document.body.appendChild(script);
    isAdVisibleRef.current = true;
  };

  useEffect(() => {
    // Initial injection on mount
    injectSocialBar();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        // Detect when ad is added
        for (const addedNode of mutation.addedNodes) {
          if (addedNode instanceof HTMLElement) {
            if (addedNode.id.includes('adsterra') || addedNode.className.includes('social-bar')) {
              isAdVisibleRef.current = true;
            }
          }
        }

        // Detect when ad is closed/removed
        for (const removedNode of mutation.removedNodes) {
          if (removedNode instanceof HTMLElement) {
            const isAd = removedNode.id.includes('adsterra') || 
                         removedNode.className.includes('social-bar') ||
                         removedNode.querySelector('a[href*="adsterra"]');
            
            if (isAd) {
              isAdVisibleRef.current = false;
              if (timerRef.current) clearTimeout(timerRef.current);
              timerRef.current = setTimeout(() => {
                injectSocialBar();
              }, 20000); // 20 seconds delay after close
            }
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // On route change, we check if ad is still there. If not, we could re-inject, 
  // but the user said it appears "too fast", so we'll just let the observer handle it.
  // However, the user said "jasa hi new page open Kara tab bi yahi function ho", 
  // which means they WANT it to show on new page if it's not there.
  useEffect(() => {
    if (!isAdVisibleRef.current) {
      injectSocialBar();
    }
  }, [location.pathname]);

  return null;
}
