import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SOCIAL_BAR_DISMISS_KEY = 'protoolix_social_bar_dismissed_until';
const DISMISS_DURATION = 20000; // 20 seconds

export function SocialBarManager() {
  const location = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const scriptId = 'adsterra-social-bar-script';
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const injectSocialBar = () => {
    const dismissedUntil = localStorage.getItem(SOCIAL_BAR_DISMISS_KEY);
    if (dismissedUntil && Date.now() < parseInt(dismissedUntil)) {
      setIsVisible(false);
      return;
    }

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
    setIsVisible(true);
  };

  useEffect(() => {
    injectSocialBar();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        // Detect when ad is closed/removed by user
        for (const removedNode of mutation.removedNodes) {
          if (removedNode instanceof HTMLElement) {
            const isAd = removedNode.id.includes('adsterra') || 
                         removedNode.className.includes('social-bar') ||
                         removedNode.querySelector('a[href*="adsterra"]');
            
            if (isAd) {
              // User closed the ad
              const dismissUntil = Date.now() + DISMISS_DURATION;
              localStorage.setItem(SOCIAL_BAR_DISMISS_KEY, dismissUntil.toString());
              setIsVisible(false);

              if (timerRef.current) clearTimeout(timerRef.current);
              timerRef.current = setTimeout(() => {
                injectSocialBar();
              }, DISMISS_DURATION);
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

  // On route change, re-inject if not dismissed
  useEffect(() => {
    const dismissedUntil = localStorage.getItem(SOCIAL_BAR_DISMISS_KEY);
    if (!dismissedUntil || Date.now() >= parseInt(dismissedUntil)) {
      injectSocialBar();
    }
  }, [location.pathname]);

  return null;
}
