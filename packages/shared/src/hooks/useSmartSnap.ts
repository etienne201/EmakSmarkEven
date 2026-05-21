import { CanvasElement } from '@backend/eventConfig';

export interface SnapGuide {
  x: number[];
  y: number[];
}

export interface SnapResult {
  x: number;
  y: number;
  guides: SnapGuide;
}

/**
 * Moteur intelligent d'alignement aimanté (Smart Snap Engine)
 * Détecte les points stratégiques d'alignement entre l'élément déplacé,
 * le canvas (centre/bords) et les autres calques actifs.
 */
export function getSmartSnap(
  elements: CanvasElement[],
  draggedId: string,
  dragX: number,
  dragY: number,
  dragWidth: number,
  dragHeight: number,
  stageWidth: number,
  stageHeight: number,
  snapThreshold: number = 8
): SnapResult {
  const result = { x: dragX, y: dragY };
  const activeGuides: SnapGuide = { x: [], y: [] };

  // 1. Définir les guides verticaux (sur l'axe X) et horizontaux (sur l'axe Y) cibles
  const targetXGuides: { value: number; label: string }[] = [
    { value: 0, label: 'stage-left' },
    { value: stageWidth, label: 'stage-right' },
    { value: stageWidth / 2, label: 'stage-center-x' }
  ];

  const targetYGuides: { value: number; label: string }[] = [
    { value: 0, label: 'stage-top' },
    { value: stageHeight, label: 'stage-bottom' },
    { value: stageHeight / 2, label: 'stage-center-y' }
  ];

  // Ajouter les bords et centres des AUTRES éléments présents
  elements.forEach((el) => {
    if (el.id === draggedId) return;

    const elWidth = el.width || 200;
    const elHeight = el.height || 40;

    targetXGuides.push(
      { value: el.x, label: `el-left-${el.id}` },
      { value: el.x + elWidth, label: `el-right-${el.id}` },
      { value: el.x + elWidth / 2, label: `el-center-x-${el.id}` }
    );

    targetYGuides.push(
      { value: el.y, label: `el-top-${el.id}` },
      { value: el.y + elHeight, label: `el-bottom-${el.id}` },
      { value: el.y + elHeight / 2, label: `el-center-y-${el.id}` }
    );
  });

  // 2. Définir les lignes d'accroche de l'élément déplacé
  const dragLeft = dragX;
  const dragRight = dragX + dragWidth;
  const dragCenterX = dragX + dragWidth / 2;

  const dragTop = dragY;
  const dragBottom = dragY + dragHeight;
  const dragCenterY = dragY + dragHeight / 2;

  // 3. Calculer l'aimantation pour X
  let snappedX = false;
  for (const guide of targetXGuides) {
    // Cas A : Bord gauche de l'élément s'aligne sur le guide
    if (Math.abs(dragLeft - guide.value) < snapThreshold) {
      result.x = guide.value;
      activeGuides.x.push(guide.value);
      snappedX = true;
      break;
    }
    // Cas B : Bord droit de l'élément s'aligne sur le guide
    if (Math.abs(dragRight - guide.value) < snapThreshold) {
      result.x = guide.value - dragWidth;
      activeGuides.x.push(guide.value);
      snappedX = true;
      break;
    }
    // Cas C : Le centre vertical de l'élément s'aligne sur le guide
    if (Math.abs(dragCenterX - guide.value) < snapThreshold) {
      result.x = guide.value - dragWidth / 2;
      activeGuides.x.push(guide.value);
      snappedX = true;
      break;
    }
  }

  // 4. Calculer l'aimantation pour Y
  let snappedY = false;
  for (const guide of targetYGuides) {
    // Cas A : Haut de l'élément s'aligne sur le guide
    if (Math.abs(dragTop - guide.value) < snapThreshold) {
      result.y = guide.value;
      activeGuides.y.push(guide.value);
      snappedY = true;
      break;
    }
    // Cas B : Bas de l'élément s'aligne sur le guide
    if (Math.abs(dragBottom - guide.value) < snapThreshold) {
      result.y = guide.value - dragHeight;
      activeGuides.y.push(guide.value);
      snappedY = true;
      break;
    }
    // Cas C : Le centre horizontal de l'élément s'aligne sur le guide
    if (Math.abs(dragCenterY - guide.value) < snapThreshold) {
      result.y = guide.value - dragHeight / 2;
      activeGuides.y.push(guide.value);
      snappedY = true;
      break;
    }
  }

  return {
    x: result.x,
    y: result.y,
    guides: activeGuides
  };
}
