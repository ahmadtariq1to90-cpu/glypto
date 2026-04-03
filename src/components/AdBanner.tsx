import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  className?: string;
}

export function AdBanner({ className }: AdBannerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(`
          <html>
            <body style="margin:0;padding:0;display:flex;justify-content:center;align-items:center;background:transparent;">
              <script type="text/javascript">
                atOptions = {
                  'key' : 'bac4b95a2d8e3c8e844d031ea3e89947',
                  'format' : 'iframe',
                  'height' : 50,
                  'width' : 320,
                  'params' : {}
                };
              </script>
              <script type="text/javascript" src="https://www.highperformanceformat.com/bac4b95a2d8e3c8e844d031ea3e89947/invoke.js"></script>
            </body>
          </html>
        `);
        doc.close();
      }
    }
  }, []);

  return (
    <div className={className}>
      <div className="flex justify-center items-center min-h-[50px] w-full overflow-hidden">
        <iframe
          ref={iframeRef}
          width="320"
          height="50"
          frameBorder="0"
          scrolling="no"
          title="Advertisement"
          className="max-w-full"
        />
      </div>
    </div>
  );
}
