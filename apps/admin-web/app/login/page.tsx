"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  LayoutDashboard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@frontend/context/AuthContext";
import { PremiumLogo } from "@frontend/components/PremiumLogo";
import {
  isSuperAdminRole,
  loginWithEmail,
  resolveOrganizerRedirect,
} from "@frontend/utils/auth-api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

/* ── Schema ── */
const loginSchema = z.object({
  email: z.string().min(3, "Identifiant requis (ex. UserEven ou email)"),
  password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

/* ── Taglines for Left Panel Carousel ── */
const TAGLINES = [
  {
    title: "L'art de l'organisation",
    description: "Gérez vos invités, RSVPs et plans de table en toute sérénité depuis une interface épurée.",
    icon: LayoutDashboard,
    color: "text-emerald-400",
  },
  {
    title: "Invitations sur-mesure",
    description: "Concevez des invitations numériques élégantes et personnalisées à l'image de vos événements.",
    icon: Sparkles,
    color: "text-amber-400",
  },
  {
    title: "Accueil fluide et rapide",
    description: "Scannez les QR codes de vos convives à l'entrée pour un enregistrement en une fraction de seconde.",
    icon: Smartphone,
    color: "text-cyan-400",
  },
  {
    title: "Statistiques en direct",
    description: "Suivez le flux des arrivées et le remplissage des tables en temps réel grâce à nos outils analytiques.",
    icon: CheckCircle2,
    color: "text-emerald-400",
  },
];

/* ── Floating particle component ── */
function FloatingParticles() {
  const [particles, setParticles] = useState<{ id: number; left: string; top: string; width: string; height: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 5 + 2}px`,
      height: `${Math.random() * 5 + 2}px`,
      delay: `${Math.random() * 6}s`,
      duration: `${Math.random() * 8 + 8}s`,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="particles-container absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle absolute bg-white/20 rounded-full animate-float"
          style={{
            left: p.left,
            top: p.top,
            width: p.width,
            height: p.height,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}

/* ── Main Admin Login Page ── */
export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, user, token } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTagline, setActiveTagline] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Carousel timer
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTagline((prev) => (prev + 1) % TAGLINES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Redirect if already logged in
  useEffect(() => {
    const checkStatusAndRedirect = async () => {
      if (isAuthenticated && user && token) {
        if (isSuperAdminRole(user.role)) {
          const targetUrl = window.location.port === "3000"
            ? `http://${window.location.hostname}:3002/superadmin`
            : "/superadmin";
          window.location.href = targetUrl;
        } else {
          try {
            const path = await resolveOrganizerRedirect(token);
            router.replace(path);
          } catch {
            /* stay on login */
          }
        }
      }
    };
    checkStatusAndRedirect();
  }, [isAuthenticated, user, token, router]);

  // Animated background canvas (Aurora Glow Effect)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const circles: { x: number; y: number; r: number; dx: number; dy: number; opacity: number; color: string }[] = [];
    
    // Emerald / Teal / Dark Blue soft spots
    const colors = [
      "rgba(16, 185, 129, ", // emerald
      "rgba(6, 182, 212, ",  // cyan
      "rgba(59, 130, 246, ",  // blue
      "rgba(16, 185, 129, ", // emerald
    ];

    for (let i = 0; i < 6; i++) {
      circles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 250 + 150,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        opacity: Math.random() * 0.08 + 0.04,
        color: colors[i % colors.length],
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      circles.forEach((c) => {
        c.x += c.dx;
        c.y += c.dy;
        if (c.x < -c.r) c.x = width + c.r;
        if (c.x > width + c.r) c.x = -c.r;
        if (c.y < -c.r) c.y = height + c.r;
        if (c.y > height + c.r) c.y = -c.r;

        const gradient = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.r);
        gradient.addColorStop(0, `${c.color}${c.opacity})`);
        gradient.addColorStop(0.5, `${c.color}${c.opacity * 0.4})`);
        gradient.addColorStop(1, `rgba(0, 0, 0, 0)`);
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.fill();
      });
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const onLogin = async (values: LoginFormValues) => {
    setLoading(true);
    setError("");

    const { data, error: apiError } = await loginWithEmail(values.email, values.password);

    if (data) {
      login(data.accessToken, data.refreshToken, data.user);

      if (isSuperAdminRole(data.user.role)) {
        const targetUrl = window.location.port === "3000"
          ? `http://${window.location.hostname}:3002/superadmin?welcome=true`
          : "/superadmin?welcome=true";
        window.location.href = targetUrl;
      } else {
        const path = await resolveOrganizerRedirect(data.accessToken);
        router.push(path);
      }
    } else {
      setError(apiError || "Identifiants invalides. Vérifiez votre email et mot de passe.");
      setLoading(false);
    }
  };

  const TaglineIcon = TAGLINES[activeTagline].icon;

  return (
    <div className="min-h-screen bg-[#070b13] flex flex-col lg:flex-row text-white font-sans overflow-hidden">
      
      {/* ── LEFT PANE: BRAND PRESENTATION (Hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-3/5 relative flex-col justify-between p-12 bg-gradient-to-br from-[#080d19] via-[#0b1427] to-[#040810] border-r border-white/5">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />
        <FloatingParticles />
        
        {/* Top Header Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <PremiumLogo
            src="/images/blanclogo.png"
            size="sm"
            variant="emerald"
          />
          <span className="font-extrabold text-sm tracking-wider uppercase bg-gradient-to-r from-emerald-400 via-emerald-200 to-slate-200 bg-clip-text text-transparent">
            EMAKO Smart Event
          </span>
        </div>

        {/* Center Tagline Carousel */}
        <div className="relative z-10 my-auto max-w-xl space-y-8">
          <div className="h-[260px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTagline}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="space-y-4"
              >
                <div className={`w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner ${TAGLINES[activeTagline].color}`}>
                  <TaglineIcon className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  {TAGLINES[activeTagline].title}
                </h2>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {TAGLINES[activeTagline].description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel dots */}
          <div className="flex items-center gap-2">
            {TAGLINES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTagline(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === activeTagline ? "w-6 bg-emerald-500" : "w-1.5 bg-slate-700 hover:bg-slate-600"
                }`}
                aria-label={`Aller à la diapositive ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-500 border-t border-white/5 pt-6">
          <span>We Plan. You Celebrate.</span>
          <span>© {new Date().getFullYear()} EMAKO</span>
        </div>
      </div>

      {/* ── RIGHT PANE: LOGIN FORM ── */}
      <div className="flex-1 flex flex-col justify-between p-6 md:p-12 lg:w-2/5 bg-gradient-to-t from-[#05080e] to-[#080d19] relative">
        {/* Mobile Aurora Spot (Hidden on Desktop) */}
        <div className="absolute inset-0 pointer-events-none z-0 lg:hidden overflow-hidden">
          <div className="absolute top-[10%] left-[-20%] w-[80%] h-[50%] rounded-full bg-emerald-500/5 blur-[120px]" />
          <div className="absolute bottom-[10%] right-[-20%] w-[80%] h-[50%] rounded-full bg-blue-500/5 blur-[120px]" />
        </div>

        {/* Mobile Brand Title */}
        <div className="relative z-10 flex lg:hidden items-center gap-2.5 mb-8">
          <PremiumLogo
            src="/images/blanclogo.png"
            size="xs"
            variant="emerald"
          />
          <span className="font-bold text-xs tracking-wider uppercase text-slate-300">
            EMAKO Smart Event
          </span>
        </div>

        {/* Login Card Container */}
        <div className="relative z-10 my-auto flex justify-center w-full">
          <div className="w-full max-w-md space-y-8 bg-slate-900/30 lg:bg-transparent border border-white/5 lg:border-none p-8 lg:p-0 rounded-[2rem] backdrop-blur-md lg:backdrop-blur-none shadow-2xl lg:shadow-none">
            
            {/* Logo ring - Centered on Mobile / Left on Desktop */}
            <div className="flex flex-col items-center lg:items-start space-y-4">
              <PremiumLogo
                src="/images/blanclogo.png"
                size="xl"
                variant="emerald"
                className="shadow-emerald-500/20"
              />
              <div className="text-center lg:text-left space-y-1">
                <h1 className="text-2xl font-black tracking-tight text-white">Espace Organisateur</h1>
                <p className="text-xs text-slate-400">
                  Connectez-vous pour gérer votre événement.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onLogin)} className="space-y-5">
              
              {/* Email / Username Field */}
              <div className="space-y-1.5">
                <label htmlFor="email-input" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Identifiant</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    {...register("email")}
                    id="email-input"
                    type="text"
                    className="w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-white/5 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all duration-300 font-sans"
                    placeholder="UserEven ou organisateur@example.com"
                    autoComplete="username"
                  />
                </div>
                {errors.email && (
                  <span className="text-xs text-rose-500 flex items-center gap-1.5 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.email.message}
                  </span>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1.5">
                <label htmlFor="password-input" className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    {...register("password")}
                    id="password-input"
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-11 pr-12 py-3 bg-slate-900/60 border border-white/5 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all duration-300 font-mono tracking-wide"
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                    aria-pressed={showPassword}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-350 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <span className="text-xs text-rose-500 flex items-center gap-1.5 mt-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.password.message}
                  </span>
                )}
              </div>

              {/* Error Banner */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-start gap-2.5 text-xs text-rose-400"
                    role="alert"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-650 hover:to-emerald-450 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                ) : (
                  <>
                    <span>Accéder à mon espace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>
          </div>
        </div>

        {/* Footer section */}
        <div className="relative z-10 flex flex-col items-center gap-4 text-center border-t border-white/5 pt-6 mt-8 lg:mt-0">
          <Link
            href="/login/superadmin"
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 py-2 px-4 rounded-full border border-white/5"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Accès Super Administrateur</span>
            <ArrowRight className="w-3 h-3 opacity-50" />
          </Link>
          
          <p className="text-[10px] text-slate-500 font-medium">
            <Sparkles className="w-3 h-3 inline mr-1 text-emerald-400 animate-pulse" />
            EMAKO Smart Event — We Plan. You Celebrate.
          </p>
        </div>

      </div>

    </div>
  );
}
