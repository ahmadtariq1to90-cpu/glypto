import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
}

export function AdBanner({ className }: AdBannerProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adRef.current && !adRef.current.firstChild) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//www.highperformanceformat.com/bac4b95a2d8e3c8e844d031ea3e89947/invoke.js';
      
      const options = document.createElement('script');
      options.type = 'text/javascript';
      options.innerHTML = `
        atOptions = {
          'key' : 'bac4b95a2d8e3c8e844d031ea3e89947',
          'format' : 'iframe',
          'height' : 50,
          'width' : 320,
          'params' : {}
        };
      `;

      adRef.current.appendChild(options);
      adRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-[8px] font-black uppercase tracking-widest text-text-muted/40 text-center">Sponsored</p>
      <div className="flex justify-center items-center min-h-[50px] w-full bg-bg-card/30 rounded-lg border border-border-main/50 overflow-hidden">
        <div ref={adRef} id="ad-container" className="w-[320px] h-[50px] flex items-center justify-center" />
      </div>
    </div>
  );
}
