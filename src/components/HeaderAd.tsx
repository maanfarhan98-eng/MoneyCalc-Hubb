import React, { useEffect, useRef, memo } from 'react';

export const HeaderAd = memo(function HeaderAd() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Prevent duplicate ad instances
    container.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.title = 'Header Advertisement';
    iframe.width = '320';
    iframe.height = '50';
    iframe.scrolling = 'no';
    iframe.setAttribute('frameBorder', '0');
    iframe.style.border = '0';
    iframe.style.width = '320px';
    iframe.style.height = '50px';
    iframe.style.overflow = 'hidden';
    iframe.style.display = 'block';

    const adHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=320, initial-scale=1">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body {
      width: 320px;
      height: 50px;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  </style>
</head>
<body>
  <script type="text/javascript">
    atOptions = {
      'key' : '094391ba6bf9dee20be90a22c610a856',
      'format' : 'iframe',
      'height' : 50,
      'width' : 320,
      'params' : {}
    };
  </script>
  <script type="text/javascript" src="https://www.highrevenueformat.com/094391ba6bf9dee20be90a22c610a856/invoke.js"></script>
</body>
</html>`;

    iframe.srcdoc = adHtml;
    container.appendChild(iframe);

    return () => {
      container.innerHTML = '';
    };
  }, []);

  return (
    <div
      aria-label="Advertisement"
      className="w-full bg-slate-50/80 dark:bg-slate-900/60 border-t border-slate-200/70 dark:border-slate-800/80 py-2 px-2 flex flex-col items-center justify-center transition-colors select-none overflow-x-hidden"
    >
      <span className="text-[9px] tracking-wider uppercase text-slate-400 dark:text-slate-500 font-medium mb-1">
        Advertisement
      </span>
      <div
        ref={containerRef}
        className="w-full max-w-[320px] h-[50px] overflow-hidden flex items-center justify-center bg-slate-100/50 dark:bg-slate-800/30 rounded-xs"
      />
    </div>
  );
});
