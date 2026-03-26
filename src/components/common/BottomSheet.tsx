import React, { useEffect, useRef, useState, useCallback } from 'react';

export type SnapPoint = 'peek' | 'half' | 'full';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  snapPoints?: SnapPoint[];
  defaultSnap?: SnapPoint;
}

const SNAP_HEIGHT: Record<SnapPoint, string> = {
  peek: '15vh',
  half: '50vh',
  full: '90vh',
};

const SNAP_PX: Record<SnapPoint, number> = {
  peek: 0.15,
  half: 0.50,
  full: 0.90,
};

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
  snapPoints = ['half', 'full'],
  defaultSnap = 'half',
}) => {
  const [currentSnap, setCurrentSnap] = useState<SnapPoint>(defaultSnap);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const dragStartY = useRef<number>(0);
  const dragStartOffset = useRef<number>(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  // Reset snap when sheet opens
  useEffect(() => {
    if (isOpen) {
      setCurrentSnap(defaultSnap);
      setDragOffset(0);
    }
  }, [isOpen, defaultSnap]);

  const getSnapPx = useCallback((snap: SnapPoint): number => {
    return SNAP_PX[snap] * window.innerHeight;
  }, []);

  const handleDragStart = useCallback((clientY: number) => {
    setIsDragging(true);
    dragStartY.current = clientY;
    dragStartOffset.current = 0;
  }, []);

  const handleDragMove = useCallback((clientY: number) => {
    if (!isDragging) return;
    const delta = clientY - dragStartY.current;
    setDragOffset(delta); // allow both up (negative) and down (positive)
  }, [isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const sortedSnaps = [...snapPoints].sort((a, b) => SNAP_PX[a] - SNAP_PX[b]);
    const currentIndex = sortedSnaps.indexOf(currentSnap);
    const currentHeight = getSnapPx(currentSnap);

    if (dragOffset > Math.min(80, currentHeight * 0.3)) {
      // Dragged down — snap to lower or close
      if (currentIndex <= 0) {
        onClose();
      } else {
        setCurrentSnap(sortedSnaps[currentIndex - 1]);
      }
    } else if (dragOffset < -60) {
      // Dragged up — snap to higher
      if (currentIndex < sortedSnaps.length - 1) {
        setCurrentSnap(sortedSnaps[currentIndex + 1]);
      }
    }

    setDragOffset(0);
  }, [isDragging, dragOffset, currentSnap, snapPoints, onClose, getSnapPx]);

  // Touch events
  const onTouchStart = (e: React.TouchEvent) => {
    handleDragStart(e.touches[0].clientY);
  };
  const onTouchMove = (e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientY);
  };
  const onTouchEnd = () => {
    handleDragEnd();
  };

  // Mouse events (for desktop testing)
  const onMouseDown = (e: React.MouseEvent) => {
    handleDragStart(e.clientY);
  };

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientY);
    const handleMouseUp = () => handleDragEnd();
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  if (!isOpen) return null;

  const sheetHeight = SNAP_HEIGHT[currentSnap];
  const translateY = Math.max(-40, dragOffset); // allow slight upward visual resistance

  return (
    <div className="fixed inset-0 z-[2000] flex flex-col justify-end pointer-events-none">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px] pointer-events-auto transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="relative pointer-events-auto w-full bg-slate-900 border-t border-white/10 rounded-t-[2rem] shadow-2xl flex flex-col"
        style={{
          height: sheetHeight,
          transform: `translateY(${translateY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1), height 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
          maxHeight: '90vh',
        }}
      >
        {/* Drag Handle */}
        <div
          className="flex-shrink-0 flex flex-col items-center pt-3 pb-2 cursor-grab active:cursor-grabbing select-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onMouseDown={onMouseDown}
        >
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Title */}
        {title && (
          <div className="flex-shrink-0 px-5 pb-3 border-b border-white/10">
            <h3 className="text-base font-black text-white tracking-tight">{title}</h3>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain scrollbar-none" style={{ scrollbarWidth: 'none' }}>
          {children}
        </div>
      </div>
    </div>
  );
};
