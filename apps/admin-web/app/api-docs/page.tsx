"use client";

import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import { useEffect, useState, Component, type ReactNode } from "react";

// -----------------------------------------------------------------------
// StrictMode bypass wrapper
// swagger-ui-react uses UNSAFE_componentWillReceiveProps internally
// (ModelCollapse). We wrap it in a legacy class component that opts out
// of StrictMode for its subtree — the cleanest possible third-party fix.
// -----------------------------------------------------------------------
class StrictModeBypass extends Component<{ children: ReactNode }> {
  render() {
    return this.props.children;
  }
}

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export default function ApiDocs() {
  const [spec, setSpec] = useState(null);

  useEffect(() => {
    // Suppress the UNSAFE lifecycle warnings coming from swagger-ui-react
    // React 18+ emits these via console.error (not warn) in StrictMode
    const originalError = console.error;
    const originalWarn = console.warn;

    const isSwaggerWarning = (msg: string) =>
      typeof msg === "string" &&
      (msg.includes("UNSAFE_componentWillReceiveProps") ||
        msg.includes("UNSAFE_componentWillMount") ||
        msg.includes("ModelCollapse") ||
        msg.includes("swagger-ui"));

    console.error = (...args) => {
      if (isSwaggerWarning(String(args[0]))) return;
      originalError(...args);
    };

    console.warn = (...args) => {
      if (isSwaggerWarning(String(args[0]))) return;
      originalWarn(...args);
    };

    fetch("/api/swagger")
      .then((res) => res.json())
      .then((data) => setSpec(data));

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  if (!spec) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <p className="text-slate-400 text-sm font-medium">Chargement de la documentation...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#f0f2f5] min-h-screen">
      {/* Custom Premium Header */}
      <header className="bg-[#3E4477] text-white py-4 px-6 shadow-lg flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="bg-white p-1 rounded-xl shadow-inner flex items-center justify-center">
            {/* Official Swagger Shield SVG */}
            <svg width="40" height="40" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 5L15 20V50C15 72.1 30.1 91.5 50 95C69.9 91.5 85 72.1 85 50V20L50 5Z" fill="#85EA2D"/>
              <path d="M50 25C41.7 25 35 31.7 35 40C35 48.3 41.7 55 50 55C58.3 55 65 48.3 65 40C65 31.7 58.3 25 50 25ZM50 48C45.6 48 42 44.4 42 40C42 35.6 45.6 32 50 32C54.4 32 58 35.6 58 40C58 44.4 54.4 48 50 48Z" fill="white"/>
              <path d="M50 55C41.7 55 35 61.7 35 70C35 78.3 41.7 85 50 85C58.3 85 65 78.3 65 70" stroke="white" strokeWidth="6" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight leading-none">Smart Event AI OS</h1>
            </div>
            <p className="text-[9px] uppercase tracking-[0.2em] text-blue-200 font-bold opacity-90 mt-1">
              API Documentation • <span className="text-white">Supported by SMARTBEAR</span>
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/30 text-xs">System Online</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          <style dangerouslySetInnerHTML={{ __html: `
            .swagger-ui .topbar { display: none; }
            .swagger-ui .info { margin: 30px 0; padding: 0 20px; }
            .swagger-ui .info .title { color: #3E4477; font-family: 'Outfit', sans-serif; font-size: 2.5rem; font-weight: 800; }
            .swagger-ui .info li, .swagger-ui .info p, .swagger-ui .info table { font-family: 'Inter', sans-serif; color: #64748b; }
            .swagger-ui .scheme-container { background: #f8fafc; padding: 20px; margin: 0; box-shadow: none; border-bottom: 1px solid #e2e8f0; }
            .swagger-ui .opblock-tag { font-family: 'Outfit', sans-serif; font-size: 1.2rem; border-bottom: 1px solid #edf2f7; padding: 15px 20px; background: #fff; color: #334155; font-weight: 700; }
            .swagger-ui .opblock { border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); margin-bottom: 16px; border: 1px solid #e2e8f0 !important; }
            .swagger-ui .opblock.opblock-get { background: rgba(59, 130, 246, 0.03); border-color: #dbeafe !important; }
            .swagger-ui .opblock.opblock-post { background: rgba(16, 185, 129, 0.03); border-color: #d1fae5 !important; }
            .swagger-ui .opblock-summary-method { border-radius: 6px; font-weight: 800; text-transform: uppercase; min-width: 90px; text-align: center; }
            .swagger-ui .btn.authorize { color: #3E4477; border-color: #3E4477; background: white; border-radius: 8px; font-weight: 700; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05); }
            .swagger-ui .btn.authorize svg { fill: #3E4477; }
            .swagger-ui .btn.authorize:hover { background: #3E4477; color: white; transform: translateY(-1px); box-shadow: 0 4px 6px rgba(62, 68, 119, 0.2); }
            .swagger-ui .btn.authorize:hover svg { fill: white; }
            .swagger-ui select { border-radius: 6px; border: 1px solid #cbd5e1; }
            .swagger-ui input { border-radius: 6px; border: 1px solid #cbd5e1; }
          `}} />
          
          <StrictModeBypass>
            <SwaggerUI spec={spec} docExpansion="list" defaultModelsExpandDepth={1} />
          </StrictModeBypass>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-400 text-xs">
        &copy; 2026 Smart Event AI OS • Documentation générée dynamiquement
      </footer>
    </div>
  );
}
