import { useEffect, useMemo, useState } from "react";
import {
  Crown,
  ExternalLink,
  Eye,
  Home,
  Layers,
  LogOut,
  Menu,
  Palette,
  Plus,
  Settings,
  Utensils,
  Video,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";
import RestaurantInfo from "../components/admin/RestaurantInfo";
import MenuWorkspace from "../components/admin/MenuWorkspace";
import LSCLibrary from "../components/admin/LSCLibrary";
import TemplateStudio from "../components/admin/TemplateStudio";
import { TEMPLATE_TYPES, type TemplateType } from "../components/templates";

type View = "dashboard" | "design" | "menu" | "lsc" | "preview" | "settings";

interface RestaurantData {
  id: string;
  name: string;
  slug?: string;
  logo_url?: string;
  banner_url?: string;
  template_type: TemplateType;
  plan_type: string;
  product_count: number;
  primary_color?: string;
  secondary_color?: string;
  color_primary?: string;
  color_accent?: string;
  font_family?: string;
  display_mode?: "traditional" | "lsc";
}

interface DashboardStats {
  products: number;
  categories: number;
  lscLinked: number;
}

const navItems: { id: View; label: string; icon: typeof Home }[] = [
  { id: "dashboard", label: "Dashboard", icon: Home },
  { id: "design", label: "Diseno", icon: Palette },
  { id: "menu", label: "Menu", icon: Utensils },
  { id: "lsc", label: "Biblioteca LSC", icon: Video },
  { id: "preview", label: "Vista previa", icon: Eye },
  { id: "settings", label: "Configuracion", icon: Settings },
];

export default function RestaurantAdminDashboard() {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    products: 0,
    categories: 0,
    lscLinked: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadRestaurant();
  }, []);

  const loadRestaurant = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.user) {
        navigate("/login");
        return;
      }

      const { data: userData } = await supabase
        .from("users")
        .select("restaurant_id")
        .eq("id", sessionData.session.user.id)
        .single();

      if (!userData) {
        setError("No se encontro el perfil del usuario.");
        setLoading(false);
        return;
      }

      const { data: restaurantData } = await supabase
        .from("restaurants")
        .select("*")
        .eq("id", userData.restaurant_id)
        .single();

      if (restaurantData) {
        const nextRestaurant = restaurantData as RestaurantData;
        setRestaurant(nextRestaurant);
        await loadStats(nextRestaurant.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el dashboard.");
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async (restaurantId: string) => {
    const [{ data: products }, { data: categories }] = await Promise.all([
      supabase
        .from("products")
        .select("id, lsc_library_id")
        .eq("restaurant_id", restaurantId)
        .eq("status", "active"),
      supabase.from("categories").select("id").eq("restaurant_id", restaurantId),
    ]);

    const activeProducts = products || [];
    setStats({
      products: activeProducts.length,
      categories: categories?.length || 0,
      lscLinked: activeProducts.filter((product) => product.lsc_library_id).length,
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const planLimit = useMemo(
    () => (restaurant ? getPlanLimit(restaurant.plan_type) : 50),
    [restaurant]
  );

  const menuUrl = restaurant?.slug ? `/menu/${restaurant.slug}` : "";

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-muted-foreground">Cargando VISUALSC...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">
          <p>{error || "Restaurante no encontrado."}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 rounded-lg bg-primary px-4 py-2 font-semibold text-primary-foreground"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f7f4] text-foreground">
      <div className="flex">
        <aside
          className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-black/10 bg-[#161716] text-white transition-all duration-300 lg:sticky lg:top-0 ${
            sidebarOpen ? "w-72" : "w-20"
          }`}
        >
          <div className="flex h-20 items-center justify-between border-b border-white/10 px-4">
            <button
              onClick={() => setActiveView("dashboard")}
              className="flex min-w-0 items-center gap-3 text-left"
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-white text-sm font-black text-[#161716]">
                V
              </div>
              {sidebarOpen && (
                <div className="min-w-0">
                  <p className="truncate text-sm font-black tracking-[0.18em]">VISUALSC</p>
                  <p className="truncate text-xs text-white/55">Menu accessible studio</p>
                </div>
              )}
            </button>

            <button
              onClick={() => setSidebarOpen((current) => !current)}
              className="rounded-lg p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveView(item.id);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition ${
                    activeView === item.id
                      ? "bg-white text-[#161716]"
                      : "text-white/72 hover:bg-white/10 hover:text-white"
                  }`}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  <Icon size={20} className="flex-shrink-0" />
                  {sidebarOpen && <span className="text-sm font-semibold">{item.label}</span>}
                </button>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-3">
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-white/72 transition hover:bg-red-500/10 hover:text-red-200"
            >
              <LogOut size={20} />
              {sidebarOpen && <span className="text-sm font-semibold">Cerrar sesion</span>}
            </button>
          </div>
        </aside>

        {sidebarOpen && (
          <button
            aria-label="Cerrar navegacion"
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="min-w-0 flex-1 lg:ml-0">
          <header className="sticky top-0 z-20 border-b border-black/10 bg-[#f7f7f4]/95 px-4 py-4 backdrop-blur md:px-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="rounded-lg border border-border bg-card p-2 lg:hidden"
                >
                  <Menu size={20} />
                </button>
                <div className="min-w-0">
                  <p className="truncate text-sm text-muted-foreground">{restaurant.name}</p>
                  <h1 className="truncate text-2xl font-bold text-foreground">
                    {navItems.find((item) => item.id === activeView)?.label}
                  </h1>
                </div>
              </div>

              {menuUrl && (
                <a
                  href={menuUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
                >
                  <ExternalLink size={16} />
                  Menu publicado
                </a>
              )}
            </div>
          </header>

          <div className="px-4 py-6 md:px-8">
            {activeView === "dashboard" && (
              <DashboardHome
                restaurant={restaurant}
                stats={stats}
                planLimit={planLimit}
                onNavigate={setActiveView}
                menuUrl={menuUrl}
              />
            )}

            {activeView === "design" && (
              <TemplateStudio
                restaurantId={restaurant.id}
                onRestaurantUpdate={(nextRestaurant) =>
                  setRestaurant((current) =>
                    current ? ({ ...current, ...nextRestaurant } as RestaurantData) : current
                  )
                }
              />
            )}

            {activeView === "menu" && (
              <MenuWorkspace
                restaurantId={restaurant.id}
                planLimit={planLimit}
                productCount={stats.products}
                onProductCountChange={(count) =>
                  setStats((current) => ({ ...current, products: count }))
                }
              />
            )}

            {activeView === "lsc" && <LSCLibrary restaurantId={restaurant.id} />}

            {activeView === "preview" && (
              <PreviewPanel restaurant={restaurant} stats={stats} menuUrl={menuUrl} />
            )}

            {activeView === "settings" && (
              <RestaurantInfo
                restaurant={restaurant}
                onUpdate={(nextRestaurant) =>
                  setRestaurant((current) =>
                    current ? ({ ...current, ...nextRestaurant } as RestaurantData) : current
                  )
                }
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardHome({
  restaurant,
  stats,
  planLimit,
  onNavigate,
  menuUrl,
}: {
  restaurant: RestaurantData;
  stats: DashboardStats;
  planLimit: number;
  onNavigate: (view: View) => void;
  menuUrl: string;
}) {
  const template = TEMPLATE_TYPES[restaurant.template_type] || TEMPLATE_TYPES["accessibility-first"];
  const usagePercent = planLimit === Infinity ? 0 : Math.round((stats.products / planLimit) * 100);

  return (
    <div className="space-y-6">
      <section
        className="overflow-hidden rounded-lg border border-black/10 bg-[#20211f] text-white"
        style={{
          background: restaurant.banner_url
            ? `linear-gradient(90deg, rgba(0,0,0,.78), rgba(0,0,0,.35)), url(${restaurant.banner_url}) center/cover`
            : undefined,
        }}
      >
        <div className="grid gap-6 p-6 lg:grid-cols-[minmax(0,1fr)_280px] lg:p-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/60">
              Bienvenida
            </p>
            <h2 className="mt-3 text-4xl font-black leading-tight md:text-5xl">
              {restaurant.name}
            </h2>
            <p className="mt-4 max-w-2xl text-white/70">
              Administra una sola carta. VISUALSC genera la experiencia tradicional y la
              experiencia LSC desde los mismos productos.
            </p>
          </div>

          <div className="rounded-lg border border-white/15 bg-white/10 p-5 backdrop-blur">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#20211f]">
                <Crown size={20} />
              </div>
              <div>
                <p className="text-xs text-white/60">Plan</p>
                <p className="font-bold capitalize">{restaurant.plan_type}</p>
              </div>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full rounded-full bg-white"
                style={{ width: `${Math.min(usagePercent, 100)}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-white/60">
              {stats.products}/{planLimit === Infinity ? "sin limite" : planLimit} productos
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatBlock label="Productos creados" value={stats.products} icon={Utensils} />
        <StatBlock label="Categorias creadas" value={stats.categories} icon={Layers} />
        <StatBlock label="Videos LSC vinculados" value={stats.lscLinked} icon={Video} />
        <StatBlock label="Plantilla activa" value={template.name} icon={Palette} />
      </div>

      <section className="rounded-lg border border-border bg-card p-5">
        <h3 className="mb-4 text-lg font-semibold text-foreground">Acciones rapidas</h3>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <QuickAction
            label="Crear producto"
            detail="Agregar plato, bebida o complemento"
            icon={Plus}
            onClick={() => onNavigate("menu")}
          />
          <QuickAction
            label="Crear categoria"
            detail="Ordenar la carta por secciones"
            icon={Layers}
            onClick={() => onNavigate("menu")}
          />
          <QuickAction
            label="Elegir plantilla"
            detail="Abrir Template Studio"
            icon={Palette}
            onClick={() => onNavigate("design")}
          />
          <a
            href={menuUrl || "#"}
            target="_blank"
            rel="noreferrer"
            className={`rounded-lg border border-border bg-background p-4 text-left transition hover:border-primary hover:bg-primary/5 ${
              !menuUrl ? "pointer-events-none opacity-50" : ""
            }`}
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ExternalLink size={18} />
            </div>
            <p className="font-semibold text-foreground">Ver menu publicado</p>
            <p className="mt-1 text-xs text-muted-foreground">Abrir experiencia cliente</p>
          </a>
        </div>
      </section>
    </div>
  );
}

function StatBlock({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: typeof Home;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon size={20} />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
    </div>
  );
}

function QuickAction({
  label,
  detail,
  icon: Icon,
  onClick,
}: {
  label: string;
  detail: string;
  icon: typeof Home;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-lg border border-border bg-background p-4 text-left transition hover:border-primary hover:bg-primary/5"
    >
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon size={18} />
      </div>
      <p className="font-semibold text-foreground">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
    </button>
  );
}

function PreviewPanel({
  restaurant,
  stats,
  menuUrl,
}: {
  restaurant: RestaurantData;
  stats: DashboardStats;
  menuUrl: string;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Experiencia cliente
        </p>
        <h2 className="mt-2 text-3xl font-bold text-foreground">Vista previa publicada</h2>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          La URL publica muestra un selector entre Menu Tradicional y Menu LSC.
        </p>
      </div>

      <section className="grid gap-5 rounded-lg border border-border bg-card p-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-hidden rounded-lg border border-border bg-background">
          {menuUrl ? (
            <iframe title="Vista previa del menu" src={menuUrl} className="h-[680px] w-full" />
          ) : (
            <div className="flex h-[420px] items-center justify-center p-8 text-center text-muted-foreground">
              Configura el slug del restaurante para publicar el menu.
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">Restaurante</p>
            <p className="mt-1 font-semibold text-foreground">{restaurant.name}</p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">URL</p>
            <p className="mt-1 break-all font-semibold text-foreground">
              {menuUrl || "Sin publicar"}
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-sm text-muted-foreground">Contenido</p>
            <p className="mt-1 font-semibold text-foreground">
              {stats.products} productos, {stats.categories} categorias
            </p>
          </div>
          {menuUrl && (
            <a
              href={menuUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
            >
              <ExternalLink size={16} />
              Abrir menu
            </a>
          )}
        </div>
      </section>
    </div>
  );
}

function getPlanLimit(plan: string) {
  switch (plan) {
    case "free":
    case "pro":
      return 100;
    case "enterprise":
      return Infinity;
    default:
      return 50;
  }
}
