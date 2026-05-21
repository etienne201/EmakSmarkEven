import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useSmartDesignStore } from '@frontend/store/useSmartDesignStore';
import { Stage, Layer, Rect, Text, Image as KonvaImage, Line } from 'react-konva';
import useImage from 'use-image';
import { getSmartSnap } from '@frontend/hooks/useSmartSnap';

interface SmartTextProps {
  id: string;
  text: string;
  x: number;
  y: number;
  baseFontSize: number;
  fontFamily: string;
  fill: string;
  align: 'left' | 'center' | 'right';
  maxWidth: number;
  minFontSize?: number;
  letterSpacing?: number;
  onDragMove?: (e: any) => void;
  onDragEnd: (e: any) => void;
}

function SmartText({
  id,
  text,
  x,
  y,
  baseFontSize,
  fontFamily,
  fill,
  align,
  maxWidth,
  minFontSize = 16,
  letterSpacing = 0,
  onDragMove,
  onDragEnd
}: SmartTextProps) {
  
  // Calculate fitted font size based on text length and maxWidth
  const fittedFontSize = useMemo(() => {
    if (typeof window === 'undefined') return baseFontSize;
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) return baseFontSize;
 
    let currentSize = baseFontSize;
    while (currentSize > minFontSize) {
      context.font = `${currentSize}px ${fontFamily}`;
      const measured = context.measureText(text).width;
      if (measured <= maxWidth) {
        break;
      }
      currentSize -= 1; // fine-tune font-scaling
    }
    return currentSize;
  }, [text, baseFontSize, fontFamily, maxWidth, minFontSize]);

  return (
    <Text
      id={id}
      text={text}
      x={x}
      y={y}
      draggable
      fontSize={fittedFontSize}
      fontFamily={fontFamily}
      fill={fill}
      align={align}
      width={maxWidth}
      letterSpacing={letterSpacing}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
    />
  );
}

interface SmartQRProps {
  id: string;
  content: string;
  x: number;
  y: number;
  width: number;
  onDragMove?: (e: any) => void;
  onDragEnd: (e: any) => void;
}

function SmartQR({ id, content, x, y, width, onDragMove, onDragEnd }: SmartQRProps) {
  const qrUrl = useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${width}x${width}&data=${encodeURIComponent(content)}`;
  }, [content, width]);

  // CORS anonymous configurations are essential to prevent tainted canvas issue during exports
  const [qrImage] = useImage(qrUrl, 'anonymous');

  if (!qrImage) {
    return (
      <Rect
        id={id}
        x={x}
        y={y}
        width={width}
        height={width}
        fill="#e5e7eb"
        cornerRadius={12}
        draggable
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
      />
    );
  }

  return (
    <KonvaImage
      id={id}
      image={qrImage}
      x={x}
      y={y}
      width={width}
      height={width}
      draggable
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
    />
  );
}

interface SmartImageProps {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height?: number;
  onDragMove?: (e: any) => void;
  onDragEnd: (e: any) => void;
}

function SmartImage({ id, src, x, y, width, height, onDragMove, onDragEnd }: SmartImageProps) {
  // Always specify 'anonymous' to avoid tainting HTML5 Canvas when exporting
  const [img] = useImage(src, 'anonymous');

  if (!img) {
    return (
      <Rect
        id={id}
        x={x}
        y={y}
        width={width}
        height={height || width}
        fill="#e5e7eb"
        cornerRadius={12}
        draggable
        onDragMove={onDragMove}
        onDragEnd={onDragEnd}
      />
    );
  }

  return (
    <KonvaImage
      id={id}
      image={img}
      x={x}
      y={y}
      width={width}
      height={height || img.height * (width / img.width)}
      draggable
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
    />
  );
}

export function KonvaCanvas() {
  const elements = useSmartDesignStore(state => state.elements);
  const currentTemplate = useSmartDesignStore(state => state.currentTemplate);
  const updateElement = useSmartDesignStore(state => state.updateElementIntelligently);
  const setStoreStageRef = useSmartDesignStore(state => state.setStageRef);
  
  const width = currentTemplate?.width || 800;
  const height = currentTemplate?.height || 1200;

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const [scale, setScale] = useState(1);
  const [activeGuides, setActiveGuides] = useState<{ x: number[]; y: number[] }>({ x: [], y: [] });

  useEffect(() => {
    if (stageRef.current) {
      setStoreStageRef(stageRef.current);
    }
  }, [stageRef, setStoreStageRef]);

  useEffect(() => {
    if (!containerRef.current) return;
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width: containerWidth } = entry.contentRect;
        setScale(containerWidth / width);
      }
    });
    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [width]);

  // Prevent canvas taint for background template images
  const [bgImage] = useImage(
    currentTemplate?.backgroundUrl || 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=800',
    'anonymous'
  );

  const handleDragMove = (e: any) => {
    const node = e.target;
    const nodeWidth = node.width() || 200;
    const nodeHeight = node.height() || 40;

    const snapResult = getSmartSnap(
      elements,
      node.id(),
      node.x(),
      node.y(),
      nodeWidth,
      nodeHeight,
      width,
      height,
      8
    );

    node.x(snapResult.x);
    node.y(snapResult.y);

    setActiveGuides(snapResult.guides);
  };

  const handleDragEnd = (e: any) => {
    const node = e.target;
    
    setActiveGuides({ x: [], y: [] });

    updateElement(node.id(), {
      x: node.x(),
      y: node.y()
    });
  };

  return (
    <div ref={containerRef} className="relative w-full aspect-[2/3] bg-gray-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
      <Stage 
        ref={stageRef}
        width={width * scale} 
        height={height * scale} 
        scaleX={scale} 
        scaleY={scale}
      >
        <Layer>
          {bgImage ? (
            <KonvaImage image={bgImage} width={width} height={height} />
          ) : (
            <Rect width={width} height={height} fill="#ffffff" />
          )}

          {elements.map((el) => {
            const zone = currentTemplate?.dynamicZones.find(z => z.id === el.id);

            if (el.type === 'text') {
              return (
                <SmartText
                  key={el.id}
                  id={el.id}
                  text={el.content}
                  x={el.x}
                  y={el.y}
                  baseFontSize={zone?.stylePreset.fontSize || 32}
                  fontFamily={zone?.stylePreset.fontFamily || 'serif'}
                  fill={el.style?.color || zone?.stylePreset.fill || '#000000'}
                  align={zone?.stylePreset.align || 'center'}
                  maxWidth={zone?.maxWidth || el.width || 300}
                  minFontSize={zone?.rules?.minFontSize || 16}
                  letterSpacing={zone?.stylePreset.letterSpacing || 0}
                  onDragMove={handleDragMove}
                  onDragEnd={handleDragEnd}
                />
              );
            }

            if (el.type === 'flower') {
              return (
                <SmartQR
                  key={el.id}
                  id={el.id}
                  content={el.content}
                  x={el.x}
                  y={el.y}
                  width={el.width || 150}
                  onDragMove={handleDragMove}
                  onDragEnd={handleDragEnd}
                />
              );
            }

            if (el.type === 'image') {
              const widthVal = el.width || (el.style?.width ? parseInt(String(el.style.width)) : 150);
              const heightVal = el.height || (el.style?.height ? parseInt(String(el.style.height)) : undefined);
              return (
                <SmartImage
                  key={el.id}
                  id={el.id}
                  src={el.content}
                  x={el.x}
                  y={el.y}
                  width={widthVal}
                  height={heightVal}
                  onDragMove={handleDragMove}
                  onDragEnd={handleDragEnd}
                />
              );
            }

            return null;
          })}

          {/* Snap Alignment Guides - Rendered elegantly on top */}
          {activeGuides.x.map((gx, idx) => (
            <Line
              key={`guide-x-${idx}`}
              points={[gx, 0, gx, height]}
              stroke="#d4af37"
              strokeWidth={1.5}
              dash={[4, 4]}
              opacity={0.8}
            />
          ))}
          {activeGuides.y.map((gy, idx) => (
            <Line
              key={`guide-y-${idx}`}
              points={[0, gy, width, gy]}
              stroke="#d4af37"
              strokeWidth={1.5}
              dash={[4, 4]}
              opacity={0.8}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}


