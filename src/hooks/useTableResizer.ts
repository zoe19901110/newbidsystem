import React, { useState, useCallback, useRef, useEffect } from 'react';

export const useTableResizer = (initialWidths: (number | string)[]) => {
  const [widths, setWidths] = useState<(number | string)[]>(initialWidths);
  const resizingIndex = useRef<number | null>(null);
  const startX = useRef<number>(0);
  const startWidth = useRef<number>(0);

  const onMouseDown = useCallback((index: number, e: React.MouseEvent) => {
    resizingIndex.current = index;
    startX.current = e.clientX;
    
    // Get current width in pixels
    const target = e.currentTarget.parentElement;
    if (target) {
      startWidth.current = target.getBoundingClientRect().width;
    }
    
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, []);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (resizingIndex.current === null) return;

      const deltaX = e.clientX - startX.current;
      const newWidth = Math.max(80, startWidth.current + deltaX);
      
      setWidths(prev => {
        const next = [...prev];
        next[resizingIndex.current!] = newWidth;
        return next;
      });
    };

    const onMouseUp = () => {
      resizingIndex.current = null;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  return { widths, onMouseDown };
};
