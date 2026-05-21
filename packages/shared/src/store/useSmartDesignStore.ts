import { create } from 'zustand';
import { DesignPersonality, CanvasElement } from '@backend/eventConfig';
import { getSmartTypography } from '@frontend/ai/typography-engine/useTypographyEngine';
import { TemplateDefinition } from '@backend/templateEngine';
import { TEMPLATE_PRESETS } from '@backend/presets/templates.preset';

export interface SmartDesignState {
  // Mode & Configuration
  smartModeActive: boolean;
  designPersonality: DesignPersonality;
  
  // Canvas Elements
  elements: CanvasElement[];
  
  // Intelligence & Assistance
  aiRecommendations: string[];
  designScore: {
    readability: number;
    balance: number;
    elegance: number;
  };
  
  // Layout Engine
  snapLines: { x: number[]; y: number[] };
  
  // Template Personalization Engine
  currentTemplate: TemplateDefinition | null;
  dynamicValues: Record<string, any>;
  
  // Actions
  toggleSmartMode: () => void;
  setPersonality: (personality: DesignPersonality) => void;
  setTemplate: (templateId: string) => void;
  updateDynamicValue: (zoneId: string, value: any) => void;
  setElements: (elements: CanvasElement[]) => void;
  addElement: (element: Omit<CanvasElement, 'id'>) => void;
  updateElementIntelligently: (id: string, updates: Partial<CanvasElement>) => void;
  addRecommendation: (rec: string) => void;
  clearRecommendations: () => void;
  // Stage reference for HD export
  stageRef: any | null;
  setStageRef: (ref: any) => void;
  updateDesignScore: (scores: Partial<SmartDesignState['designScore']>) => void;
  analyzeCanvas: () => void;
  setThemePalette: (themeId: string) => void;
}

export const useSmartDesignStore = create<SmartDesignState>((set, get) => ({
  smartModeActive: true,
  designPersonality: 'elegant-luxury',
  
  currentTemplate: null,
  dynamicValues: {},
  
  elements: [],
  snapLines: { x: [], y: [] },
  stageRef: null,
  setStageRef: (ref) => set({ stageRef: ref }),
  
  aiRecommendations: [],
  designScore: {
    readability: 100,
    balance: 100,
    elegance: 100,
  },

  toggleSmartMode: () => set((state) => ({ smartModeActive: !state.smartModeActive })),
  
  setPersonality: (personality) => set({ designPersonality: personality }),
  
  setTemplate: (templateId) => {
    const template = TEMPLATE_PRESETS.find(t => t.id === templateId) || null;
    if (!template) return;

    // Populate initial dynamic values from the template defaults
    const initialValues: Record<string, any> = {};
    template.dynamicZones.forEach(zone => {
      initialValues[zone.id] = zone.defaultValue || "";
    });

    // Also populate Canvas Elements based on Template
    const templateElements: CanvasElement[] = template.dynamicZones.map(zone => ({
      id: zone.id,
      type: zone.type === 'qrcode' ? 'flower' : (zone.type === 'image' ? 'image' : 'text'), // Map type
      content: String(initialValues[zone.id]),
      x: zone.x,
      y: zone.y,
      width: zone.width || 200,
      style: {
        fontSize: zone.stylePreset.fontSize ? `${zone.stylePreset.fontSize}px` : undefined,
        fontFamily: zone.stylePreset.fontFamily,
        color: zone.stylePreset.fill,
        textAlign: zone.stylePreset.align,
        letterSpacing: zone.stylePreset.letterSpacing ? `${zone.stylePreset.letterSpacing}px` : undefined
      }
    }));

    set({ 
      currentTemplate: template, 
      dynamicValues: initialValues,
      elements: templateElements
    });
  },

  setThemePalette: (themeId) => set((state) => {
    const template = state.currentTemplate;
    if (!template) return {};
    const theme = template.themes.find(t => t.id === themeId);
    if (!theme) return {};

    const baseTheme = template.themes[0];
    const basePalette = baseTheme.palette;
    const targetPalette = theme.palette;

    const newElements = state.elements.map(el => {
      let color = el.style?.color;
      if (color) {
        const normalized = color.toLowerCase();
        if (normalized === basePalette.primary.toLowerCase()) {
          color = targetPalette.primary;
        } else if (normalized === basePalette.secondary.toLowerCase()) {
          color = targetPalette.secondary;
        } else if (normalized === basePalette.text.toLowerCase()) {
          color = targetPalette.text;
        }
      }
      return {
        ...el,
        style: {
          ...el.style,
          color: color || el.style?.color
        }
      };
    });

    return {
      elements: newElements,
      dynamicValues: {
        ...state.dynamicValues,
        themeId: theme.id
      }
    };
  }),

  updateDynamicValue: (zoneId, value) => set((state) => {
    const newValues = { ...state.dynamicValues, [zoneId]: value };

    // Bind this update to the canvas elements
    const newElements = state.elements.map(el => {
      if (el.id === zoneId) {
        return { ...el, content: String(value) };
      }
      return el;
    });

    return { 
      dynamicValues: newValues, 
      elements: newElements 
    };
  }),

  setElements: (elements) => set({ elements }),

  addElement: (element) => set((state) => ({
    elements: [...state.elements, { ...element, id: Math.random().toString(36).substr(2, 9) }]
  })),

  updateElementIntelligently: (id, updates) => set((state) => {
    const newElements = state.elements.map(el => {
      if (el.id !== id) return el;
      
      // Here we would hook into layout-engine logic if smartModeActive is true.
      // For now, it simply updates the element properties.
      return { ...el, ...updates };
    });
    
    return { elements: newElements };
  }),

  addRecommendation: (rec) => set((state) => ({ 
    aiRecommendations: [...state.aiRecommendations, rec] 
  })),

  clearRecommendations: () => set({ aiRecommendations: [] }),

  updateDesignScore: (scores) => set((state) => ({
    designScore: { ...state.designScore, ...scores }
  })),

  analyzeCanvas: () => {
    const { elements, smartModeActive, designPersonality } = get();
    if (!smartModeActive) return;

    let readabilityScore = 100;
    let balanceScore = 100;
    const recommendations: string[] = [];
    let updatedElements = false;

    // 1. Sort by Y to maintain relative order
    const sortedElements = [...elements].sort((a, b) => a.y - b.y);

    // 2. Auto-Spacing & Alignment Configuration
    const startY = 80; // Top padding
    const gap = 60;    // Vertical spacing
    const centerX = 200; // Approximate center of the canvas

    const newElements = sortedElements.map((el, index) => {
      let optimalStyle = { ...el.style };
      let newX = centerX;
      let newY = startY + (index * gap);

      if (el.type === 'text') {
        const typo = getSmartTypography(el.content, designPersonality);
        
        if (el.style?.fontSize !== typo.fontSize) {
          updatedElements = true;
          if (el.content.length > 30) {
            recommendations.push(`Texte long détecté : taille ajustée pour préserver l'élégance.`);
          }
        }
        
        optimalStyle = {
          ...optimalStyle,
          fontSize: typo.fontSize,
          letterSpacing: typo.letterSpacing,
          lineHeight: typo.lineHeight,
          textAlign: 'center'
        };
      } else if (el.type === 'image') {
        // Center image
        newX = centerX - parseInt(optimalStyle.width || '150') / 2;
        // Add more gap after image
        newY += 20; 
      }

      // If positions changed significantly, we mark it as updated
      if (Math.abs(el.y - newY) > 20 || Math.abs(el.x - newX) > 20) {
        updatedElements = true;
      }

      return {
        ...el,
        x: newX,
        y: newY,
        style: optimalStyle,
        isSmartAligned: true
      };
    });

    if (updatedElements) {
      recommendations.push("L'IA a réaligné vos éléments au centre et harmonisé les espaces (Loi de proximité).");
      set({ 
        elements: newElements, 
        aiRecommendations: recommendations,
        designScore: {
          readability: 98,
          balance: 99,
          elegance: 95
        }
      });
    } else {
      set({ aiRecommendations: ["Le design est déjà optimal. L'équilibre est parfait."] });
    }
  }
}));
