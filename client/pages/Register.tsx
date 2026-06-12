import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Check, AlertCircle, Loader } from "lucide-react";
import { supabase } from "../lib/supabase";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [verificationSent, setVerificationSent] = useState(false);
  const [formData, setFormData] = useState({
    restaurantName: "",
    email: "",
    password: "",
    ownerName: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (formData.password.length < 8) {
        throw new Error("Contraseña debe tener al menos 8 caracteres");
      }

      // 1. Create user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("No user returned from signup");

      // 2. Create restaurant
      const { data: restaurantData, error: restaurantError } = await supabase
        .from("restaurants")
        .insert({
          admin_email: formData.email,
          name: formData.restaurantName,
          slug: formData.restaurantName.toLowerCase().replace(/\s+/g, "-"),
          template_type: "accessibility-first",
          menu_sync_enabled: true,
          trial_start_date: new Date().toISOString(),
          trial_end_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
          subscription_status: "trial",
          plan_type: "free",
        })
        .select()
        .single();

      if (restaurantError) throw restaurantError;

      // 3. Create user profile linked to auth
      const { error: profileError } = await supabase
        .from("users")
        .insert({
          id: authData.user.id,
          restaurant_id: restaurantData.id,
          email: formData.email,
          role: "admin",
          status: "active",
          email_verified: false,
        });

      if (profileError) throw profileError;

      setVerificationSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro durante el registro");
    } finally {
      setLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-xl border border-border p-8 shadow-sm text-center">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center mx-auto mb-4">
              <Check size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-foreground mb-2">Verifica tu email</h2>
            <p className="text-muted-foreground mb-6">
              Hemos enviado un enlace de confirmación a <strong>{formData.email}</strong>.
              Haz clic en el enlace para verificar tu cuenta.
            </p>
            <button
              onClick={() => navigate("/login")}
              className="w-full button-primary font-semibold py-3"
            >
              Ir a Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-serif font-bold text-xl">V</span>
          </div>
          <h1 className="text-3xl font-serif font-bold text-foreground">VISUALSC</h1>
          <p className="text-muted-foreground mt-2">Crea tu cuenta en 3 pasos</p>
        </div>

        {/* Card */}
        <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex gap-2">
              <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Restaurant Name */}
            <div>
              <label htmlFor="restaurantName" className="block text-sm font-semibold text-foreground mb-2">
                Nombre del restaurante
              </label>
              <input
                id="restaurantName"
                name="restaurantName"
                type="text"
                value={formData.restaurantName}
                onChange={handleChange}
                placeholder="Mi Restaurante"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            {/* Owner Name */}
            <div>
              <label htmlFor="ownerName" className="block text-sm font-semibold text-foreground mb-2">
                Nombre del propietario
              </label>
              <input
                id="ownerName"
                name="ownerName"
                type="text"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="Tu nombre"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                Correo electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-foreground mb-2">
                Teléfono
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+57 300 0000000"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">Mínimo 8 caracteres</p>
            </div>

            {/* Terms */}
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="rounded border border-border mt-1"
                required
              />
              <span className="text-sm text-muted-foreground">
                Acepto los{" "}
                <a href="#" className="text-primary hover:text-primary/80">
                  términos de servicio
                </a>{" "}
                y la{" "}
                <a href="#" className="text-primary hover:text-primary/80">
                  política de privacidad
                </a>
              </span>
            </label>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full button-primary font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading && <Loader size={18} className="animate-spin" />}
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">O</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Sign in link */}
          <p className="text-center text-muted-foreground">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-primary font-semibold hover:text-primary/80">
              Inicia sesión
            </Link>
          </p>
        </div>

        {/* Benefits */}
        <div className="mt-8 space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-3">
            <Check size={18} className="text-secondary flex-shrink-0" />
            <span>14 días de prueba gratuita</span>
          </div>
          <div className="flex items-center gap-3">
            <Check size={18} className="text-secondary flex-shrink-0" />
            <span>Sin necesidad de tarjeta de crédito</span>
          </div>
          <div className="flex items-center gap-3">
            <Check size={18} className="text-secondary flex-shrink-0" />
            <span>Soporte técnico 24/7</span>
          </div>
        </div>
      </div>
    </div>
  );
}
