"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  User,
  ArrowRight,
  Loader2,
  AlertCircle,
  Sparkles,
  Eye,
  EyeOff,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@frontend/context/AuthContext";
import { apiRequest } from "@frontend/utils/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

/* ── Schema ── */
const loginSchema = z.object({
  id: z.string().min(1, "L'identifiant est requis"),
  password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères"),
});
type LoginFormValues = z.infer<typeof loginSchema>;

/* ── Floating particle component ── */
function FloatingParticles() {
  const [particles, setParticles] = useState<{ id: number; left: string; top: string; width: string; height: string; delay: string; duration: string }[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 6 + 2}px`,
      height: `${Math.random() * 6 + 2}px`,
      delay: `${Math.random() * 8}s`,
      duration: `${Math.random() * 10 + 10}s`,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="particles-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
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
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already logged in
  useEffect(() => {
    const checkStatusAndRedirect = async () => {
      if (isAuthenticated && user && token) {
        if (user.role === "super-admin") {
          router.replace("/superadmin");
        } else {
          // Check if already configured
          try {
            const res = await fetch("/api/setup/status", {
              headers: { "Authorization": `Bearer ${token}` }
            });
            if (res.status === 401) return; // Silent return on auth error
            const { data } = await res.json();
            if (data?.isConfigured) {
              router.replace("/home");
            } else {
              router.replace("/setup");
            }
          } catch (e) {
            // Error fetching status, default to setup or stay on login
          }
        }
      }
    };
    checkStatusAndRedirect();
  }, [isAuthenticated, user, router]);

  // Animated background canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const circles: { x: number; y: number; r: number; dx: number; dy: number; opacity: number }[] = [];
    for (let i = 0; i < 8; i++) {
      circles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 200 + 100,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.08 + 0.03,
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
        gradient.addColorStop(0, `rgba(40, 167, 69, ${c.opacity})`);
        gradient.addColorStop(0.5, `rgba(30, 58, 138, ${c.opacity * 0.5})`);
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
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
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

    const { data, error: apiError } = await apiRequest<any>("/api/auth/admin/login", {
      method: "POST",
      body: JSON.stringify({ event_id: values.id, password: values.password }),
    });

    if (data) {
      const userObj = data.user || data;
      const role = userObj.role === "superadmin" ? "super-admin" : (userObj.role || (userObj.isAdmin ? "super-admin" : "admin"));
      const userData = {
        uid: userObj.uid || userObj.ownerId || userObj.id,
        ownerId: userObj.ownerId || userObj.id || "system",
        role: role as "admin" | "super-admin",
        email: userObj.email,
        name: userObj.name || userObj.email?.split("@")[0] || (role === "super-admin" ? "Super Admin" : "Organisateur"),
      };
      const accessToken = data.token || data.accessToken;
      const refreshToken = data.refreshToken || "";
      login(accessToken, refreshToken, userData);
      
      // Dynamic redirect based on setup status
      if (role === "super-admin") {
        router.push("/superadmin?welcome=true");
      } else {
        try {
          const statusRes = await fetch("/api/setup/status", {
            headers: { "Authorization": `Bearer ${accessToken}` }
          });
          const statusData = await statusRes.json();
          if (statusData.data?.isConfigured) {
            router.push("/home?welcome=true");
          } else {
            router.push("/setup?welcome=true");
          }
        } catch (e) {
          router.push("/setup?welcome=true");
        }
      }
    } else {
      setError(apiError || "Identifiants invalides. Vérifiez votre ID événement et mot de passe.");
      setLoading(false);
    }
  };

  return (
    <div className="login-page admin-login-page">
      {/* Background layers */}
      <canvas ref={canvasRef} className="login-canvas" />
      <FloatingParticles />
      <div className="login-bg-gradient" />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="login-card"
      >
        {/* Glassmorphism accent line */}
        <div className="card-accent-line" />

        {/* Logo section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="login-logo-section"
        >
          <div className="logo-glow-ring">
            <div className="logo-inner">
              <img
                src="/images/blanclogo.png"
                alt="EMAKO Smart Event"
                className="logo-image"
              />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="login-title-section"
        >
          <h1 className="login-title">Espace Organisateur</h1>
          <p className="login-subtitle">
            Connectez-vous pour gérer votre événement
          </p>
          <div className="login-badge">
            <Calendar className="w-3.5 h-3.5" />
            <span>Administration Événement</span>
          </div>
        </motion.div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          onSubmit={handleSubmit(onLogin)}
          className="login-form"
        >
          {/* ID Field */}
          <div className="form-group">
            <label className="form-label">ID Événement</label>
            <div className="input-wrapper">
              <User className="input-icon" />
              <input
                {...register("id")}
                type="text"
                className="form-input font-mono"
                placeholder="ex: mariage-2024"
                autoComplete="username"
              />
            </div>
            {errors.id && <p className="form-error">{errors.id.message}</p>}
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <div className="input-wrapper">
              <Lock className="input-icon" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                className="form-input font-mono"
                placeholder="••••••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="form-error">{errors.password.message}</p>}
          </div>

          {/* Error message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -10, height: 0 }}
                animate={{ opacity: 1, x: 0, height: "auto" }}
                exit={{ opacity: 0, x: -10, height: 0 }}
                className="error-banner"
              >
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit */}
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="submit-button admin-submit"
          >
            <div className="button-shine" />
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <span>Accéder à mon espace</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </motion.form>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="login-footer"
        >
          <div className="footer-divider" />
          <Link href="/login/superadmin" className="superadmin-link">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Accès Super Administrateur</span>
            <ArrowRight className="w-3 h-3 opacity-50" />
          </Link>
          <p className="login-copyright">
            <Sparkles className="w-3 h-3 inline mr-1 opacity-50" />
            EMAKO Smark Event — We Plan. You Celebrate.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
