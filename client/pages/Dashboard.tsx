import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Menu,
  X,
  BarChart3,
  Utensils,
  ShoppingCart,
  Settings,
  LogOut,
  Users,
  BookOpen,
  QrCode,
  TrendingUp,
  Calendar,
  Eye,
  Edit2,
} from "lucide-react";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col fixed md:relative h-screen z-40`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sidebar-primary to-sidebar-accent flex items-center justify-center flex-shrink-0">
              <span className="text-sidebar-primary-foreground font-serif font-bold text-sm">V</span>
            </div>
            {sidebarOpen && <span className="text-white font-serif font-bold text-lg hidden sm:inline">VISUALSC</span>}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-sidebar-accent rounded-lg text-sidebar-foreground"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group"
              title={!sidebarOpen ? item.label : ""}
            >
              <item.icon size={20} className="flex-shrink-0" />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors text-left">
            <div className="w-8 h-8 rounded-full bg-sidebar-primary flex items-center justify-center flex-shrink-0 text-sidebar-primary-foreground font-semibold text-sm">
              A
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin</p>
                <p className="text-xs text-sidebar-accent-foreground truncate">admin@resto.com</p>
              </div>
            )}
          </button>

          <button
            onClick={() => {
              /* TODO: Logout */
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-red-500/10 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Salir</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-30">
          <h1 className="text-2xl font-serif font-bold text-foreground">Dashboard</h1>
          <button className="md:hidden p-2 hover:bg-secondary/10 rounded-lg">
            <Menu size={24} />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl border border-primary/20 p-8">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-2">
                Bienvenido a tu panel de control
              </h2>
              <p className="text-muted-foreground">
                Gestiona tu restaurante, menú y accesibilidad desde aquí
              </p>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {kpis.map((kpi) => (
                <div
                  key={kpi.label}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground">{kpi.label}</h3>
                    <div className="p-2 rounded-lg bg-secondary/20 text-secondary">
                      <kpi.icon size={20} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                    {kpi.change && (
                      <p className="text-xs text-green-600 flex items-center gap-1">
                        <TrendingUp size={14} />
                        {kpi.change} vs mes anterior
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {quickActions.map((action) => (
                <Link
                  key={action.href}
                  to={action.href}
                  className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 hover:bg-primary/5 transition-all group cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground">{action.title}</h3>
                    <div className="p-2 rounded-lg bg-accent/20 text-accent group-hover:bg-accent/30">
                      <action.icon size={20} />
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">{action.description}</p>
                  <div className="flex items-center gap-2 text-primary font-medium text-sm group-hover:translate-x-1 transition">
                    {action.cta}
                    <span>→</span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Pedidos Recientes</h3>
                <Link to="/orders" className="text-primary text-sm font-medium hover:text-primary/80">
                  Ver todos
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">ID Pedido</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Mesa</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Hora</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Estado</th>
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((i) => (
                      <tr key={i} className="border-b border-border hover:bg-muted/50 transition">
                        <td className="px-4 py-3 text-foreground">#PED-00{i}</td>
                        <td className="px-4 py-3 text-foreground">Mesa {i}</td>
                        <td className="px-4 py-3 text-muted-foreground">10:{30 + i * 5} AM</td>
                        <td className="px-4 py-3">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/20 text-secondary">
                            En preparación
                          </span>
                        </td>
                        <td className="px-4 py-3 text-foreground font-semibold">$45.00</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

const navItems = [
  { icon: BarChart3, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "Menú", href: "/menu" },
  { icon: ShoppingCart, label: "Pedidos", href: "/orders" },
  { icon: Users, label: "Usuarios", href: "/users" },
  { icon: QrCode, label: "QR", href: "/qr" },
  { icon: Eye, label: "Experiencia Cliente", href: "/experience" },
  { icon: Settings, label: "Configuración", href: "/settings" },
];

const kpis = [
  { icon: Utensils, label: "Total Productos", value: "48", change: "+12%" },
  { icon: ShoppingCart, label: "Pedidos Hoy", value: "23", change: "+8%" },
  { icon: QrCode, label: "Escaneos QR", value: "156", change: "+24%" },
  { icon: Eye, label: "Uso LSC", value: "67%", change: "+15%" },
];

const quickActions = [
  {
    icon: Edit2,
    title: "Editar Menú",
    description: "Añade, edita o elimina productos y categorías",
    cta: "Ir al menú",
    href: "/menu",
  },
  {
    icon: Eye,
    title: "Ver Experiencia Cliente",
    description: "Visualiza cómo los clientes ven tu menú",
    cta: "Previsualizar",
    href: "/experience",
  },
];

