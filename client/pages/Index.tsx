import { Link } from "react-router-dom";
import { Menu, X, ChevronRight, Users, BarChart3, Utensils, Accessibility, Zap } from "lucide-react";
import { useState } from "react";

export default function Index() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white font-serif font-bold text-sm">V</span>
              </div>
              <h1 className="text-xl font-serif font-bold text-foreground">VISUALSC</h1>
            </div>

            <nav className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
                Características
              </a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
                Precios
              </a>
              <a href="#accessibility" className="text-sm font-medium text-muted-foreground hover:text-foreground transition">
                Accesibilidad
              </a>
              <Link
                to="/login"
                className="text-sm font-medium text-primary hover:text-primary/80 transition"
              >
                Ingresar
              </Link>
              <Link
                to="/register"
                className="button-primary text-sm"
              >
                Registrarse
              </Link>
            </nav>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-secondary/10 rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden pb-4 space-y-3 border-t border-border pt-4">
              <a href="#features" className="block text-sm font-medium text-foreground hover:text-primary py-2">Características</a>
              <a href="#pricing" className="block text-sm font-medium text-foreground hover:text-primary py-2">Precios</a>
              <a href="#accessibility" className="block text-sm font-medium text-foreground hover:text-primary py-2">Accesibilidad</a>
              <Link to="/login" className="block text-sm font-medium text-foreground hover:text-primary py-2">Ingresar</Link>
              <Link to="/register" className="button-primary text-sm block text-center">Registrarse</Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        <div className="container mx-auto max-w-4xl relative">
          <div className="text-center mb-12 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-secondary/30 bg-secondary/10 mb-6">
              <span className="w-2 h-2 bg-secondary rounded-full" />
              <span className="text-sm font-medium text-secondary">Accesibilidad es inclusión</span>
            </div>

            <h2 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold leading-tight text-foreground mb-6">
              Menús digitales para<br />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                personas sordas
              </span>
            </h2>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              VISUALSC permite que restaurantes y cafeterías de Colombia creen menús digitales accesibles en Lengua de Señas Colombiana, llegando a más clientes y creando experiencias inclusivas.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center button-primary font-semibold text-base group"
              >
                Comenzar gratis
                <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition" />
              </Link>
              <a
                href="#demo"
                className="inline-flex items-center justify-center button-outline font-semibold text-base"
              >
                Ver demostración
              </a>
            </div>
          </div>

          {/* Dashboard Preview Card */}
          <div className="mt-16 animate-slide-up">
            <div className="glass-effect rounded-2xl p-8 sm:p-12 border-2 border-white/50">
              <div className="space-y-4">
                <div className="h-80 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 size={48} className="text-primary/40 mx-auto mb-4" />
                    <p className="text-muted-foreground">Interfaz del dashboard</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-card border-t border-border">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-4">
              Todo lo que necesitas
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Herramientas completas para gestionar tu restaurante y crear experiencias accesibles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="p-8 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-lg bg-secondary/20 text-secondary flex items-center justify-center mb-4 group-hover:bg-secondary/30 transition">
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accessibility Focus */}
      <section id="accessibility" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-4xl font-serif font-bold text-foreground mb-6">
                Diseñado para la inclusión
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Cada aspecto de VISUALSC está pensado para personas sordas. Desde navegación visual clara hasta videos en Lengua de Señas Colombiana.
              </p>
              <ul className="space-y-3">
                {[
                  "Iconografía clara y universal",
                  "Navegación visual intuitiva",
                  "Videos en Lengua de Señas",
                  "Alertas y notificaciones visuales",
                  "Compatibilidad con lectores de pantalla",
                  "Paleta de colores de alto contraste"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3 text-foreground">
                    <div className="w-2 h-2 rounded-full bg-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="h-96 bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <Accessibility size={64} className="text-primary/40 mx-auto mb-4" />
                <p className="text-muted-foreground">Experiencia accesible</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-accent/5 border-t border-border">
        <div className="container mx-auto text-center max-w-3xl">
          <h3 className="text-4xl sm:text-5xl font-serif font-bold text-foreground mb-6">
            Listo para crear menús accesibles
          </h3>
          <p className="text-lg text-muted-foreground mb-8">
            Únete a restaurantes y cafeterías que están revolucionando la inclusión en Colombia
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="inline-flex items-center justify-center button-primary font-semibold text-base"
            >
              Registrarse ahora
            </Link>
            <a
              href="mailto:contact@visualsc.co"
              className="inline-flex items-center justify-center button-outline font-semibold text-base"
            >
              Contactar ventas
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-primary to-accent" />
                <span className="font-serif font-bold text-foreground">VISUALSC</span>
              </div>
              <p className="text-sm text-muted-foreground">Menús digitales accesibles para Colombia</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Producto</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Características</a></li>
                <li><a href="#" className="hover:text-foreground transition">Precios</a></li>
                <li><a href="#" className="hover:text-foreground transition">Seguridad</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Recursos</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Documentación</a></li>
                <li><a href="#" className="hover:text-foreground transition">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition">Soporte</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm">Empresa</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition">Acerca de</a></li>
                <li><a href="#" className="hover:text-foreground transition">Contacto</a></li>
                <li><a href="#" className="hover:text-foreground transition">Política</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>&copy; 2024 VISUALSC. Todos los derechos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-foreground transition">Privacidad</a>
              <a href="#" className="hover:text-foreground transition">Términos</a>
              <a href="#" className="hover:text-foreground transition">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: <Utensils size={24} />,
    title: "Gestor de Menú",
    description: "Crea y administra categorías y productos con facilidad. Agrega precios, ingredientes, alérgenos e imágenes."
  },
  {
    icon: <Users size={24} />,
    title: "Multi-rol",
    description: "Gestión completa de usuarios con roles diferenciados: propietarios, administradores, meseros y cocina."
  },
  {
    icon: <BarChart3 size={24} />,
    title: "Analytics",
    description: "Visualiza escaneos QR, productos populares, uso de LSC y estadísticas de pedidos en tiempo real."
  },
  {
    icon: <Accessibility size={24} />,
    title: "Lengua de Señas",
    description: "Soporte completo para Lengua de Señas Colombiana con biblioteca modular de videos."
  },
  {
    icon: <Zap size={24} />,
    title: "Actualización Real-time",
    description: "Los cambios en el menú se reflejan al instante en la experiencia del cliente."
  },
  {
    icon: <Users size={24} />,
    title: "Gestión de Pedidos",
    description: "Sistema simplificado de pedidos optimizado para personas sordas sin carrito tradicional."
  }
];
