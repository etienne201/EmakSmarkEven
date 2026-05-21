import { useState, useCallback } from 'react';
import { useSmartDesignStore } from '@frontend/store/useSmartDesignStore';

interface SnapResult {
  x: number;
  y: number;
  snappedX: boolean;
  snappedY: boolean;
}

export function useSmartLayout(canvasWidth: number, canvasHeight: number) {
  const [activeSnapLines, setActiveSnapLines] = useState<{ x: number | null, y: number | null }>({ x: null, y: null });
  const smartModeActive = useSmartDesignStore(state => state.smartModeActive);
  
  // Snap threshold in pixels
  const SNAP_THRESHOLD = 15;

  const calculateSnap = useCallback((x: number, y: number, elWidth: number, elHeight: number): SnapResult => {
    if (!smartModeActive) {
      setActiveSnapLines({ x: null, y: null });
      return { x, y, snappedX: false, snappedY: false };
    }

    let finalX = x;
    let finalY = y;
    let snappedX = false;
    let snappedY = false;

    // Define smart guide lines (center, golden ratio margins)
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    
    // Element center coords
    const elCenterX = x + elWidth / 2;
    const elCenterY = y + elHeight / 2;

    // X-axis snapping
    if (Math.abs(elCenterX - centerX) < SNAP_THRESHOLD) {
      finalX = centerX - elWidth / 2;
      snappedX = true;
    }

    // Y-axis snapping
    if (Math.abs(elCenterY - centerY) < SNAP_THRESHOLD) {
      finalY = centerY - elHeight / 2;
      snappedY = true;
    }

    setActiveSnapLines({
      x: snappedX ? centerX : null,
      y: snappedY ? centerY : null
    });

    return { x: finalX, y: finalY, snappedX, snappedY };
  }, [smartModeActive, canvasWidth, canvasHeight]);

  const clearSnapLines = useCallback(() => {
    setActiveSnapLines({ x: null, y: null });
  }, []);

  return {
    calculateSnap,
    activeSnapLines,
    clearSnapLines
  };
}
