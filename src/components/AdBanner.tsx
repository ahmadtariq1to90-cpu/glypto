import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
}

export function AdBanner({ className }: AdBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && !containerRef.current.querySelector('iframe')) {
      const iframe = document.createElement('iframe');
      iframe.width = '320';
      iframe.height = '50';
      iframe.frameBorder = '0';
      iframe.scrolling = 'no';
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';
      iframe.title = 'Advertisement';

      containerRef.current.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (iframeDoc) {
        iframeDoc.open();
        iframeDoc.write(`
          <html>
            <body style="margin:0;padding:0;display:flex;justify-content:center;align-items:center;background:transparent;">
              <div id="ad-slot"></div>
              <script type="text/javascript">
                atOptions = {
                  'key' : 'bac4b95a2d8e3c8e844d031ea3e89947',
                  'format' : 'iframe',
                  'height' : 50,
                  'width' : 320,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="//www.highperformanceformat.com/bac4b95a2d8e3c8e844d031ea3e89947/invoke.js"></script>
            </body>
          </html>
        `);
        iframeDoc.close();
      }
    }
  }, []);

  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-[8px] font-black uppercase tracking-widest text-text-muted/40 text-center">Sponsored</p>
      <div className="flex justify-center items-center min-h-[50px] w-full bg-bg-card/30 rounded-lg border border-border-main/50 overflow-hidden">
        <div ref={containerRef} className="w-[320px] h-[50px] flex items-center justify-center" />
      </div>
    </div>
  );
}
