import React, { useEffect } from 'react';
import { SmartCanvas } from './SmartCanvas';
import { useSmartDesignStore } from '@frontend/store/useSmartDesignStore';
import { Sparkles, Type, Image as ImageIcon, Layout, Wand2, CheckCircle2 } from 'lucide-react';

export function SmartDesignEditor() {
  const { 
    smartModeActive, 
    toggleSmartMode, 
    aiRecommendations, 
    designScore,
    currentTemplate,
    dynamicValues,
    setThemePalette,
    elements,
    addElement,
    analyzeCanvas
  } = useSmartDesignStore();

  const activeThemeId = dynamicValues.themeId || currentTemplate?.themes[0]?.id;

  // Load default template on mount if empty to ensure a premium visual experience
  useEffect(() => {
    if (elements.length === 0) {
      useSmartDesignStore.getState().setTemplate('wedding-luxury-green');
    }
  }, [elements]);

  return (
    <div className="flex h-[720px] w-full bg-slate-50 rounded-[2.5rem] overflow-hidden border border-gray-200 shadow-xl">
      {/* Left Panel: Elements */}
      <div className="w-64 bg-white border-r border-gray-100 p-6 flex flex-col">
        <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Layout className="w-4 h-4 text-emerald" />
          Éléments
        </h3>
        
        <div className="space-y-3">
          <button onClick={() => addElement({ type: 'text', content: 'Nouveau Texte', x: 100, y: 100, style: { fontSize: '2rem', fontWeight: 'bold' }})} className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-emerald/5 hover:text-emerald border border-transparent hover:border-emerald/20 transition-all text-sm font-bold text-gray-600">
            <Type className="w-4 h-4" /> Ajouter Texte
          </button>
          <button onClick={() => addElement({ type: 'image', content: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=200&h=200&fit=crop', x: 150, y: 150, style: { width: '150px', borderRadius: '1rem' }})} className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-emerald/5 hover:text-emerald border border-transparent hover:border-emerald/20 transition-all text-sm font-bold text-gray-600">
            <ImageIcon className="w-4 h-4" /> Ajouter Image
          </button>
          <button onClick={() => {
            const stage = useSmartDesignStore.getState().stageRef;
            if (stage) {
              try {
                const dataUrl = stage.toDataURL({ pixelRatio: 3 });
                const link = document.createElement('a');
                link.download = 'invitation-premium-hd.png';
                link.href = dataUrl;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              } catch (err: any) {
                // Tainted canvas fallback: export at lower quality without cross-origin images
                console.warn('[SmartDesignEditor] Export HD failed (tainted canvas):', err.message);
                try {
                  const dataUrl = stage.toDataURL({ pixelRatio: 1 });
                  const link = document.createElement('a');
                  link.download = 'invitation-preview.png';
                  link.href = dataUrl;
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                } catch {
                  alert("L'export est temporairement indisponible. Les images externes doivent finir de charger en mode sécurisé (CORS). Veuillez réessayer dans quelques secondes.");
                }
              }
            }
          }} className="w-full flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-emerald/10 to-emerald/20 hover:from-emerald hover:to-emerald-dark hover:text-white border border-emerald/20 transition-all text-sm font-black text-emerald">
            <Sparkles className="w-4 h-4" /> EXPORTER EN HD ✨
          </button>
        </div>

        {/* Smart Decorations Palette (Étape 3) */}
        <div className="mt-6">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Décors Premium</h4>
          <div className="grid grid-cols-4 gap-2">
            {[
              { name: 'Bagues', url: 'https://img.icons8.com/emoji/128/wedding-ring.png' },
              { name: 'Étoiles', url: 'https://img.icons8.com/color/128/sparkles.png' },
              { name: 'Feuille', url: 'https://img.icons8.com/fluency/128/natural-food.png' },
              { name: 'Couronne', url: 'https://img.icons8.com/color/128/crown.png' },
            ].map((dec, idx) => (
              <button
                key={idx}
                onClick={() => addElement({
                  type: 'image',
                  content: dec.url,
                  x: 300,
                  y: 450,
                  style: { width: '80px', height: '80px' }
                })}
                className="p-2 bg-slate-50 hover:bg-emerald/5 hover:border-emerald/30 border border-gray-100 rounded-xl transition-all flex items-center justify-center aspect-square"
                title={dec.name}
              >
                <img src={dec.url} className="w-8 h-8 object-contain" alt={dec.name} />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-gray-100 space-y-3">
          <button onClick={analyzeCanvas} className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-emerald to-emerald-dark text-white font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald/30 hover:scale-[1.02] transition-transform">
            <Wand2 className="w-4 h-4" /> Auto-Polish
          </button>
          <button onClick={toggleSmartMode} className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${smartModeActive ? 'bg-emerald/10 border-emerald text-emerald font-bold' : 'bg-white border-gray-200 text-gray-400'}`}>
            <span className="text-[10px] uppercase tracking-wider">Smart Mode</span>
            {smartModeActive ? <CheckCircle2 className="w-4 h-4" /> : <Wand2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Center Panel: Canvas */}
      <div className="flex-1 bg-gray-50/50 p-8 flex items-center justify-center relative">
        <SmartCanvas />
        
        {/* Floating AI Status Indicator */}
        {smartModeActive && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md px-4 py-2 rounded-full border border-emerald/20 text-[10px] font-black tracking-widest text-emerald flex items-center gap-2 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald"></span>
            </span>
            IA ASSISTANT ACTIVE
          </div>
        )}
      </div>

      {/* Right Panel: AI Properties, Themes & Suggestions */}
      <div className="w-72 bg-white border-l border-gray-100 p-6 flex flex-col overflow-y-auto">
        <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest mb-6 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald" />
          Intelligence
        </h3>

        {/* Real-time Theme Swapping Engine (Étape 2) */}
        {currentTemplate && currentTemplate.themes && currentTemplate.themes.length > 1 && (
          <div className="mb-6">
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Thèmes de Couleurs</h4>
            <div className="grid grid-cols-3 gap-2">
              {currentTemplate.themes.map((t) => {
                const isActive = activeThemeId === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setThemePalette(t.id)}
                    className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border transition-all text-center ${
                      isActive 
                        ? 'border-emerald bg-emerald/5 font-black text-emerald' 
                        : 'border-gray-100 hover:border-gray-200 text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <div className="flex gap-0.5">
                      <span className="w-3 h-3 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: t.palette.primary }} />
                      <span className="w-3 h-3 rounded-full border border-black/10 shadow-sm" style={{ backgroundColor: t.palette.secondary }} />
                    </div>
                    <span className="text-[8px] uppercase tracking-wider line-clamp-1">{t.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Scores */}
        <div className="space-y-4 mb-6">
          <div>
            <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1">
              <span>Lisibilité</span>
              <span className="text-emerald">{designScore.readability}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald" style={{ width: `${designScore.readability}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1">
              <span>Équilibre</span>
              <span className="text-emerald">{designScore.balance}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald" style={{ width: `${designScore.balance}%` }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase mb-1">
              <span>Élégance</span>
              <span className="text-emerald">{designScore.elegance}%</span>
            </div>
            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald" style={{ width: `${designScore.elegance}%` }} />
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="flex-1">
          <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Suggestions IA</h4>
          {aiRecommendations.length > 0 ? (
            <div className="space-y-2">
              {aiRecommendations.map((rec, idx) => (
                <div key={idx} className="p-3 bg-emerald/5 border border-emerald/10 rounded-xl text-xs text-gray-600">
                  {rec}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 border border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center gap-2">
              <Wand2 className="w-5 h-5 text-gray-300" />
              <p className="text-[10px] text-gray-400 font-medium">Tout semble parfait. Modifiez des éléments pour recevoir des suggestions.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
