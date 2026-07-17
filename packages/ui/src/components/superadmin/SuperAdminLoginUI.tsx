"use client";

import { useState, useEffect, useRef } from "react";
import { Lock, Eye, EyeOff, Loader2, AlertCircle, Mail, Fingerprint, ArrowRight, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@frontend/context/AuthContext";
import { loginWithEmail, isSuperAdminRole } from "@frontend/utils/auth-api";
import { PremiumLogo } from "../PremiumLogo";

export function SuperAdminLoginUI() {
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Hex grid background
  const [cells, setCells] = useState<{ id: number; left: string; top: string; delay: string; duration: string }[]>([]);
  useEffect(() => {
    setCells(Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: `${(i % 6) * 18 + (Math.floor(i / 6) % 2 ? 9 : 0)}%`,
      top: `${Math.floor(i / 6) * 20}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 4 + 4}s`,
    })));
  }, []);

  // Matrix-style background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    const columns = Math.floor(width / 20);
    const drops: number[] = Array(columns).fill(1);
    const chars = "ESE01EMAKO∞⚡◆█▓░▒".split("");
    const draw = () => {
      ctx.fillStyle = "rgba(10, 10, 20, 0.06)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "rgba(30, 58, 138, 0.15)";
      ctx.font = "14px monospace";
      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * 20, drops[i] * 20);
        if (drops[i] * 20 > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
      animationId = requestAnimationFrame(draw);
    };
    draw();
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    return () => { cancelAnimationFrame(animationId); window.removeEventListener("resize", handleResize); };
  }, []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); setError("");
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const { data, error: apiError } = await loginWithEmail(email, password);

    if (data) {
      if (!isSuperAdminRole(data.user.role)) {
        setError("Ce compte n'a pas les droits Super Administrateur.");
        setLoading(false);
        return;
      }
      login(data.accessToken, data.refreshToken, data.user);
      const targetUrl = window.location.port === "3000"
        ? `http://${window.location.hostname}:3002/superadmin?welcome=true`
        : "/superadmin?welcome=true";
      window.location.href = targetUrl;
    } else {
      setError(apiError || "Accès refusé. Vérifiez vos identifiants.");
      setLoading(false);
    }
  };

  return (
    <div className="login-page superadmin-login-page">
      <canvas ref={canvasRef} className="login-canvas" />
      <div className="hex-grid-container">
        {cells.map(c => (
          <div key={c.id} className="hex-cell" style={{ left: c.left, top: c.top, animationDelay: c.delay, animationDuration: c.duration }} />
        ))}
      </div>
      <div className="scan-line-effect" />
      <div className="login-bg-gradient superadmin-gradient" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="login-card superadmin-card">
        <div className="card-accent-line superadmin-accent" />
        <div className="security-badge"><div className="security-badge-dot" /><span>Accès Sécurisé — Niveau Supérieur</span></div>
        
        <div className="login-logo-section flex justify-center mb-6">
          <PremiumLogo
            src="/images/bleulogo.png"
            fallbackIcon={ShieldCheck}
            size="xl"
            variant="blue"
          />
        </div>

        <div className="login-title-section">
          <h1 className="login-title superadmin-title">Super Administration</h1>
          <p className="login-subtitle superadmin-subtitle">Portail de contrôle système EMAKO</p>
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="form-group">
            <label className="form-label">Email Administrateur</label>
            <div className="input-wrapper superadmin-input">
              <Mail className="input-icon" />
              <input name="email" type="email" className="form-input" placeholder="admin@emakosmarkevent.com" required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <div className="input-wrapper superadmin-input">
              <Lock className="input-icon" />
              <input name="password" type={showPassword ? "text" : "password"} className="form-input font-mono" placeholder="••••••••" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="password-toggle">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Code TOTP (2FA)</label>
            <div className="input-wrapper superadmin-input">
              <Fingerprint className="input-icon" />
              <input name="totp" type="text" className="form-input tracking-widest text-center" placeholder="000000" maxLength={6} />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="error-banner superadmin-error text-xs">
                <AlertCircle size={14} /><span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" disabled={loading} className="submit-button superadmin-submit">
            {loading ? <Loader2 className="animate-spin" /> : <><span>Authentifier</span><ArrowRight size={16} /></>}
          </button>
        </form>

        <div className="login-footer">
          <div className="footer-divider superadmin-divider" />
          <p className="login-copyright superadmin-copyright">EMAKO Smark Event — System Control</p>
        </div>
      </motion.div>
    </div>
  );
}
