import React from 'react';
import dynamic from 'next/dynamic';

// Dynamically import KonvaCanvas to completely disable SSR since Konva depends on the canvas browser API
const KonvaCanvas = dynamic(
  () => import('./KonvaCanvas').then((mod) => mod.KonvaCanvas),
  { ssr: false }
);

export function SmartCanvas() {
  return (
    <div className="relative w-full min-h-[500px]">
      <KonvaCanvas />
    </div>
  );
}


