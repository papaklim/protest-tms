import React, { useRef, useState } from 'react';
import { useResizer } from '../hooks/useResizer';
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';

export const IdeLayout = ({
  sidebar,
  sidebarWidth,
  setSidebarWidth,
  sidebarTitle = '',
  sidebarHeaderActions = null,
  sidebarMax = 600,

  children,

  bottomPanel,
  bottomPanelHeight,
  setBottomPanelHeight,
  isBottomPanelOpen,
  setIsBottomPanelOpen,
  className = '',
}) => {
  const sidebarRef     = useRef(null);
  const bottomPanelRef = useRef(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const leftResizer = useResizer({
    sidebarRef,
    type: 'width',
    direction: 'ltr',
    minSize: 42,
    maxSize: sidebarMax,
    onResize: (w) => {
      if (w < 100) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    },
    onResizeEnd: (w) => {
      if (w < 100) {
        setIsSidebarOpen(false);
      } else {
        setSidebarWidth(w);
        setIsSidebarOpen(true);
      }
    },
  });

  const bottomResizer = useResizer({
    sidebarRef: bottomPanelRef,
    type: 'height',
    minSize: 42,
    maxSize: 600,
    onResizeEnd: (h) => {
      if (h < 80) {
        setIsBottomPanelOpen(false);
        setBottomPanelHeight(250); // Reset for next open
      } else {
        setBottomPanelHeight(h);
        setIsBottomPanelOpen(true);
      }
    },
    onDragStart: () => {
      if (!isBottomPanelOpen) {
        setBottomPanelHeight(120);
        setIsBottomPanelOpen(true);
      }
    }
  });

  return (
    <div className={`flex flex-grow h-full w-full gap-3 items-stretch text-[#e6edf3] ${className}`}>

      {/* 1. Левая панель */}
      <div
        ref={sidebarRef}
        style={{ width: isSidebarOpen ? `${sidebarWidth}px` : '42px' }}
        className="flex flex-col flex-shrink-0 overflow-hidden rounded-[10px] border border-[#30363d] bg-[#161b22] h-full transition-colors duration-200 hover:border-[#0ea5e9]/35 hover:shadow-[0_4px_20px_rgba(14,165,233,0.05)]"
      >
        {/* Шапка левой панели в стиле нижней */}
        <div
          className="flex items-center justify-between border-b border-[#30363d] bg-[#1a1f26] px-4 py-2.5 text-xs font-semibold text-[#8b949e] cursor-pointer hover:bg-[#21262d] transition-colors select-none h-[42px] flex-shrink-0"
          onClick={() => {
            if (!isSidebarOpen) {
              setIsSidebarOpen(true);
              if (sidebarWidth < 100) setSidebarWidth(280);
            }
          }}
        >
          {isSidebarOpen ? (
            /* Разметка для открытого состояния */
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span>{sidebarTitle}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {sidebarHeaderActions}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSidebarOpen(false);
                  }}
                  className="rounded p-0.5 text-[#8b949e] hover:text-[#f0f6fc] cursor-pointer flex items-center justify-center"
                >
                  <ChevronLeft size={14} />
                </button>
              </div>
            </div>
          ) : (
            /* Разметка для закрытого состояния */
            <div className="flex justify-center w-full">
              <div className="rounded p-0.5 text-[#8b949e] flex items-center justify-center">
                <ChevronRight size={14} />
              </div>
            </div>
          )}
        </div>

        {/* Содержимое левой панели в открытом виде */}
        {isSidebarOpen ? (
          <div className="flex-grow overflow-y-auto py-4 pl-1 pr-1 flex flex-col min-h-0">
            {sidebar}
          </div>
        ) : (
          /* Название панели вертикально при складывании */
          <div 
            className="flex-grow flex flex-col items-center justify-center py-6 select-none cursor-pointer hover:bg-[#21262d]/20 transition-colors"
            onClick={() => {
              setIsSidebarOpen(true);
              if (sidebarWidth < 100) setSidebarWidth(280);
            }}
          >
            <span
              className="text-xs font-semibold text-[#8b949e] tracking-[0.25em]"
              style={{
                writingMode: 'vertical-rl',
                transform: 'rotate(180deg)',
                whiteSpace: 'nowrap'
              }}
            >
              {sidebarTitle}
            </span>
          </div>
        )}
      </div>

      {/* Левый ресайзер — теперь виден всегда */}
      <div className="resizer-bar" onMouseDown={leftResizer.onMouseDown} />

      {/* 2. Центральная колонка: editor + bottom */}
      <div className="flex flex-col flex-grow min-w-0 h-full gap-3">
        <div className="flex-grow min-h-0 rounded-[10px] border border-[#30363d] bg-[#161b22] w-full flex flex-col transition-colors duration-200 hover:border-[#0ea5e9]/35 hover:shadow-[0_4px_20px_rgba(14,165,233,0.05)] overflow-hidden">
          {children}
        </div>

        {/* Горизонтальный ресайзер */}
        <div
          className="resizer-bar-h"
          onMouseDown={bottomResizer.onMouseDown}
          onClick={() => { if (!bottomResizer.didDrag) setIsBottomPanelOpen(!isBottomPanelOpen); }}
        />

        {/* Нижняя панель */}
        <div
          ref={bottomPanelRef}
          style={{ height: isBottomPanelOpen ? `${bottomPanelHeight}px` : '42px' }}
          className="flex flex-col flex-shrink-0 overflow-hidden rounded-[10px] border border-[#30363d] bg-[#161b22] transition-colors duration-200 hover:border-[#0ea5e9]/35 hover:shadow-[0_4px_20px_rgba(14,165,233,0.05)]"
        >
          <div
            className="flex items-center justify-between border-b border-[#30363d] bg-[#1a1f26] px-4 py-2.5 text-xs font-semibold text-[#8b949e] cursor-pointer hover:bg-[#21262d] transition-colors select-none"
            onClick={() => setIsBottomPanelOpen(!isBottomPanelOpen)}
          >
            <span>ПАНЕЛЬ ИНСТРУМЕНТОВ</span>
            <div className="rounded p-1 text-[#8b949e]">
              {isBottomPanelOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </div>
          </div>
          {isBottomPanelOpen && (
            <div className="flex-grow overflow-y-auto p-4">{bottomPanel}</div>
          )}
        </div>
      </div>
    </div>
  );
};
