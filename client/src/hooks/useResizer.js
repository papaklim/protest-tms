import { useRef } from 'react';

export const useResizer = ({
  sidebarRef,
  type = 'width', // 'width' или 'height'
  direction = 'ltr', // 'ltr' для левой панели, 'rtl' для правой
  minSize = 150,
  maxSize = 800,
  onResize,
  onResizeEnd,
  onDragStart
}) => {
  const didDragRef = useRef(false);

  const onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation(); // не пробрасываем click на родителя
    const sidebar = sidebarRef.current;
    if (!sidebar) return;

    didDragRef.current = false;
    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = sidebar.offsetWidth;
    const startHeight = sidebar.offsetHeight;

    const dragClass = type === 'height' ? 'dragging-h' : 'dragging';
    document.body.classList.add(dragClass);

    const doDrag = (moveEvent) => {
      if (type === 'width') {
        const deltaX = moveEvent.clientX - startX;
        if (Math.abs(deltaX) > 3) {
          if (!didDragRef.current && onDragStart) onDragStart();
          didDragRef.current = true;
        }
        const widthModifier = direction === 'rtl' ? -deltaX : deltaX;
        const finalWidth = Math.max(minSize, Math.min(maxSize, startWidth + widthModifier));
        sidebar.style.width = `${finalWidth}px`;
        if (onResize) onResize(finalWidth);
      } else {
        const deltaY = moveEvent.clientY - startY;
        if (Math.abs(deltaY) > 3) {
          if (!didDragRef.current && onDragStart) onDragStart();
          didDragRef.current = true;
        }
        const finalHeight = Math.max(minSize, Math.min(maxSize, startHeight - deltaY));
        sidebar.style.height = `${finalHeight}px`;
        if (onResize) onResize(finalHeight);
      }
    };

    const stopDrag = () => {
      document.body.classList.remove(dragClass);
      document.removeEventListener('mousemove', doDrag);
      document.removeEventListener('mouseup', stopDrag);

      const finalSize = type === 'width' ? sidebar.offsetWidth : sidebar.offsetHeight;
      if (onResizeEnd) {
        onResizeEnd(finalSize);
      }
    };

    document.addEventListener('mousemove', doDrag);
    document.addEventListener('mouseup', stopDrag);
  };

  // didDrag — чтобы click-handler мог отличить клик от перетаскивания
  return {
    onMouseDown,
    get didDrag() { return didDragRef.current; },
  };
};
