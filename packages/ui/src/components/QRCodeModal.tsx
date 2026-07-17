"use client";

import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Printer, ArrowLeft, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Language, translations } from "@backend/translations";
import { useToast } from "@frontend/hooks/useToast";
import { EventConfig, DEFAULT_EVENT_CONFIG } from "@backend/eventConfig";

interface Guest {
  id: number;
  title: string;
  name: string;
  table: number;
  tableName: string;
  lang: Language;
}

interface QRCodeModalProps {
  guest: Guest;
  origin: string;
  onClose: () => void;
  isOpen: boolean;
  lang: Language;
  eventConfig?: EventConfig | null;
}

export function QRCodeModal({ guest, origin, onClose, isOpen, eventConfig }: QRCodeModalProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { showToast } = useToast();
  const t = translations[guest.lang];
  const cfg = eventConfig || DEFAULT_EVENT_CONFIG;
  // OPTIMIZATION: Shortened URL to reduce QR density and scanned in < 1ms
  const getGuestUrl = () => {
    let guestOrigin = origin;
    if (guestOrigin.includes("localhost")) {
      const url = new URL(guestOrigin);
      url.port = "3005";
      guestOrigin = url.origin;
    }
    return `${guestOrigin}/guest?id=${guest.id}&ownerId=${encodeURIComponent(cfg.ownerId || 'default')}`;
  };
  const guestUrl = getGuestUrl();
  const gen = cfg.generatedTexts[guest.lang as Language] || cfg.generatedTexts.fr;

  const invitationImg = guest.lang === "fr"
    ? cfg.invitationImages.fr
    : cfg.invitationImages.en;

  const downloadInvitation = async () => {
    setIsGenerating(true);
    try {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // 1. Load the background image
      const bgImg = new Image();
      bgImg.crossOrigin = "anonymous";
      bgImg.src = invitationImg;

      await new Promise((resolve, reject) => {
        bgImg.onload = resolve;
        bgImg.onerror = reject;
      });

      // Set canvas size to image size
      canvas.width = bgImg.width;
      canvas.height = bgImg.height;

      // Draw background
      ctx.drawImage(bgImg, 0, 0);

      // 2. Draw Guest Name (Title + Name)
      const textX = canvas.width * 0.385;
      const textY = canvas.height * 0.315; // Synchronized with UI top-[31.5%]

      ctx.fillStyle = "#846733"; // Gold/Bronze color
      const fontSize = Math.round(canvas.height * 0.024);

      // 2a. Draw Title (Regular)
      ctx.font = `italic 400 ${fontSize}px serif`;
      const titleWidth = ctx.measureText(`${guest.title} `).width;
      ctx.fillText(`${guest.title} `, textX, textY);

      // 2b. Draw Name (Bold + Underline)
      ctx.font = `italic 700 ${fontSize}px serif`; // Bold for name
      ctx.fillText(guest.name, textX + titleWidth, textY);

      const nameWidth = ctx.measureText(guest.name).width;
      ctx.beginPath();
      ctx.strokeStyle = "#846733";
      ctx.lineWidth = 2;
      ctx.moveTo(textX + titleWidth, textY + 5);
      ctx.lineTo(textX + titleWidth + nameWidth, textY + 5);
      ctx.stroke();

      // 3. Draw Table Name/Number
      const tableLabel = gen.tableLabel;
      const tableText = (!guest.tableName || guest.tableName.trim() === "Non assignée" || guest.tableName.trim() === "Unassigned")
        ? `${tableLabel} ${guest.table}`
        : (guest.tableName.trim().toLowerCase().startsWith(tableLabel.toLowerCase()) ? guest.tableName.trim() : `${tableLabel} ${guest.tableName.trim()}`);

      const tableTextX = canvas.width * 0.92; // Very far right
      const tableTextY = canvas.height * 0.08; // Very high
      ctx.font = `italic 600 ${fontSize * 0.9}px serif`; // Bold and slightly larger for corner placement
      ctx.textAlign = "right";
      ctx.fillText(tableText, tableTextX, tableTextY);
      ctx.textAlign = "left"; // Restore default

      // 4. Draw QR Code
      // Get the QR from the existing rendered component or redraw it
      const qrCanvas = document.querySelector("canvas");
      if (qrCanvas) {
        // Precision Adjusted: +2px down, +3px right
        const qrSize = canvas.width * 0.145;
        const qrX = canvas.width * 0.844; // +0.5% (approx 3px)
        const qrY = canvas.height * 0.680; // +0.3% (approx 2px)

        // Draw a small white background for the QR if needed (though it's in a frame)
        ctx.fillStyle = "white";
        ctx.fillRect(qrX, qrY, qrSize, qrSize);

        ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
      }

      // 6. Draw Name (if enabled)
      if (cfg.showGuestNameOnCard) {
        ctx.font = "bold 24px serif";
        ctx.fillStyle = cfg.palette?.secondaryDark || "#846733";
        ctx.textAlign = "center";
        ctx.fillText(guest.name, canvas.width / 2, canvas.height - 180);
      }

      // 7. Draw Table (if enabled)
      if (cfg.showTableNumberOnCard) {
        ctx.font = "italic 18px serif";
        ctx.fillStyle = cfg.palette?.primary || "#846733";
        ctx.textAlign = "center";
        const tableLabel = guest.lang === "fr" ? "Table" : "Table";
        ctx.fillText(`${tableLabel} ${guest.tableName || guest.table}`, canvas.width / 2, canvas.height - 150);
      }

      // 8. Convert to PNG and Download
      const link = document.createElement("a");
      link.download = `invitation-${guest.name.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      console.error("Error during generation:", error);
      showToast(t.toasts.genError, "error");
    } finally {
      setIsGenerating(false);
    }
  };

  const printQR = () => {
    window.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto pt-[10vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl max-w-2xl w-full border border-gold-light relative mb-20"
          >
            {/* Decorative Top */}
            <div className="bg-gold p-3 text-center">
              <p className="text-[10px] text-gold-light/80 uppercase tracking-widest font-medium mb-1">
                {t.smartInvitation}
              </p>
              <h3 className="text-white font-semibold flex items-center justify-center gap-2">
                {cfg.eventName}
              </h3>
            </div>

            <div className="p-4 md:p-8 text-center bg-ivory">
              <motion.div
                initial={{ opacity: 0, y: 50, rotateX: -15 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{
                  duration: 1.2,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.2
                }}
                className="relative inline-block w-full max-w-[500px] shadow-2xl rounded-lg overflow-hidden border border-gold-light/30 mb-8 group transition-transform hover:scale-[1.01] duration-500 perspective-1000"
              >
                <div className="relative w-full aspect-[3/2] overflow-hidden">
                  <img
                    src={invitationImg || undefined}
                    alt="Invitation"
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://placehold.co/600x400/004d40/ecc94b?text=Image+Manquante";
                    }}
                  />

                  {/* QR Code Overlay - Responsive positioning */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="absolute top-[68%] left-[84.4%] w-[14.5%] aspect-square bg-white p-[1%] rounded-sm shadow-sm md:shadow-md"
                  >
                    <QRCodeCanvas
                      value={guestUrl}
                      size={512} // High res
                      style={{ width: '100%', height: '100%' }}
                      level="M"
                      includeMargin={true}
                      fgColor="#846733"
                      imageSettings={{
                        src: "/favicon.ico",
                        x: undefined,
                        y: undefined,
                        height: 24,
                        width: 24,
                        excavate: true,
                      }}
                    />
                  </motion.div>

                  {/* Guest Name Overlay - Responsive positioning */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.4, duration: 0.8 }}
                    className="absolute top-[25.5%] left-[36.5%] w-[35%] text-left hidden sm:flex items-baseline gap-1.5 overflow-hidden"
                  >
                    <span className="text-[1.8vw] md:text-sm font-serif text-[#846733] italic whitespace-nowrap">
                      {guest.title}
                    </span>
                    <span className="text-[2vw] md:text-sm font-serif text-[#846733] italic font-bold border-b-2 border-[#846733] whitespace-nowrap">
                      {guest.name}
                    </span>
                  </motion.div>

                  {/* Table Name Overlay - Top Right Positioning */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6, duration: 0.8 }}
                    className="absolute top-[8%] right-[8%] w-[30%] text-right hidden sm:block overflow-hidden"
                  >
                    <p className="text-[1.8vw] md:text-sm font-serif text-[#846733] italic font-semibold">
                      {(!guest.tableName || guest.tableName.trim() === "Non assignée" || guest.tableName.trim() === "Unassigned")
                        ? `${gen.tableLabel} ${guest.table}`
                        : (guest.tableName.trim().toLowerCase().startsWith(gen.tableLabel.toLowerCase()) ? guest.tableName.trim() : `${gen.tableLabel} ${guest.tableName.trim()}`)
                      }
                    </p>
                  </motion.div>
                  {/* Name and Table Overlays (UI Preview) */}
                  <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-end pb-12">
                    {cfg.showGuestNameOnCard && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                        className="text-lg font-bold bg-white/60 backdrop-blur-sm px-3 py-1 rounded-lg mb-2" style={{ color: 'var(--color-primary)' }}>
                        {guest.name}
                      </motion.div>
                    )}
                    {cfg.showTableNumberOnCard && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                        className="text-sm font-medium text-gold bg-white/60 backdrop-blur-sm px-2 py-0.5 rounded-md italic">
                        {guest.lang === "fr" ? "Table" : "Table"} {guest.tableName || guest.table}
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>

              <div className="space-y-1 mb-8">
                <h4 className="text-xl font-bold text-gray-900">{guest.title} {guest.name}</h4>
                <p className="text-gold font-medium">
                  {(!guest.tableName || guest.tableName.trim() === "Non assignée" || guest.tableName.trim() === "Unassigned")
                    ? `${gen.tableLabel} ${guest.table}`
                    : (guest.tableName.trim().toLowerCase().startsWith(gen.tableLabel.toLowerCase()) ? guest.tableName.trim() : `${gen.tableLabel} ${guest.tableName.trim()}`)
                  }
                </p>
                <p className="text-[10px] text-gray-400 uppercase tracking-tighter mt-2">
                  {gen.scanLabel}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
                <button
                  onClick={downloadInvitation}
                  disabled={isGenerating}
                  className="flex items-center justify-center gap-2 text-white py-2.5 rounded-xl transition-all active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'var(--color-primary)', boxShadow: '0 10px 15px -3px var(--color-primary)' }}
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Download className="w-4 h-4" />
                  )}
                  <span className="text-sm font-medium">{t.downloadPNG}</span>
                </button>
                <button
                  onClick={printQR}
                  className="flex items-center justify-center gap-2 bg-gold text-white py-2.5 rounded-xl hover:bg-gold-dark transition-all active:scale-95 shadow-lg shadow-gold/10"
                >
                  <Printer className="w-4 h-4" />
                  <span className="text-sm font-medium">{t.print}</span>
                </button>
              </div>

              <button
                onClick={onClose}
                className="mt-6 flex items-center justify-center gap-2 text-gray-400 hover:text-gold transition-colors w-full text-sm font-medium"
              >
                <ArrowLeft className="w-4 h-4" />
                {t.backToList}
              </button>
            </div>

            {/* URL Preview (Subtle) */}
            <div className="bg-gray-50 p-3 border-t border-gray-100">
              <p className="text-[9px] text-gray-400 break-all font-mono leading-tight">
                {guestUrl}
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
