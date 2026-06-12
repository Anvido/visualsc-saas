import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useParams } from "react-router-dom";
import { AlertTriangle, Eye, Image, Utensils, Video } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category: {
    id: string;
    name: string;
    icon?: string;
  };
  allergens: Array<{
    id: string;
    name: string;
    icon?: string;
    color?: string;
  }>;
  lscVideo?: {
    id: string;
    title: string;
    video_url: string;
  } | null;
}

interface Category {
  id: string;
  name: string;
  icon?: string;
  display_order: number;
}

interface Restaurant {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  banner_url?: string;
  color_primary?: string;
  color_accent?: string;
  primary_color?: string;
  secondary_color?: string;
  font_family?: string;
  welcome_message?: string;
  template_type?: string;
}

type DisplayMode = "traditional" | "lsc";

const currency = new Intl.NumberFormat("es-CO", {
  style: "currency",
  currency: "COP",
  maximumFractionDigits: 0,
});

export default function PublicMenu() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<DisplayMode>("traditional");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!slug) return;

        setLoading(true);
        setError("");

        const restaurantRes = await fetch(`/api/restaurant/${slug}`);
        if (!restaurantRes.ok) throw new Error("Restaurante no encontrado.");
        const restaurantData = await restaurantRes.json();
        setRestaurant(restaurantData);

        const [productsRes, categoriesRes] = await Promise.all([
          fetch(`/api/products/${slug}`),
          fetch(`/api/categories/${restaurantData.id}`),
        ]);

        if (!productsRes.ok || !categoriesRes.ok) {
          throw new Error("No se pudo cargar el menu.");
        }

        const productsData = await productsRes.json();
        const categoriesData = await categoriesRes.json();

        setProducts(productsData || []);
        setCategories(categoriesData || []);
        setSelectedCategory(categoriesData?.[0]?.id || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "No se pudo cargar el menu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  const style = useMemo(() => {
    if (!restaurant) return {};
    const primary = restaurant.primary_color || restaurant.color_primary || "#1F3F70";
    const secondary = restaurant.secondary_color || restaurant.color_accent || "#F0B233";
    return {
      "--restaurant-primary": primary,
      "--restaurant-secondary": secondary,
      fontFamily: `"${restaurant.font_family || "Inter"}", sans-serif`,
    } as CSSProperties;
  }, [restaurant]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category?.id === selectedCategory)
    : products;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-muted-foreground">Cargando menu...</p>
        </div>
      </div>
    );
  }

  if (!restaurant || error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="rounded-lg border border-border bg-card p-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Menu no disponible</h1>
          <p className="mt-2 text-muted-foreground">{error || "Restaurante no encontrado."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfaf7]" style={style}>
      <header
        className="sticky top-0 z-40 border-b border-black/10 bg-white/90 backdrop-blur"
        style={{ borderColor: "color-mix(in srgb, var(--restaurant-primary) 22%, transparent)" }}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            {restaurant.logo_url ? (
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                className="h-12 w-12 rounded-lg object-cover"
              />
            ) : (
              <div
                className="flex h-12 w-12 items-center justify-center rounded-lg text-lg font-black text-white"
                style={{ background: "var(--restaurant-primary)" }}
              >
                {restaurant.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-xl font-black text-foreground">{restaurant.name}</p>
              <p className="text-sm text-muted-foreground">Menu accesible VISUALSC</p>
            </div>
          </div>

          <div className="grid grid-cols-2 rounded-lg border border-border bg-muted p-1">
            <button
              onClick={() => setDisplayMode("traditional")}
              className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
                displayMode === "traditional"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              <Utensils size={16} />
              Menu Tradicional
            </button>
            <button
              onClick={() => setDisplayMode("lsc")}
              className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition ${
                displayMode === "lsc"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground"
              }`}
            >
              <Video size={16} />
              Menu LSC
            </button>
          </div>
        </div>
      </header>

      <section
        className="relative overflow-hidden text-white"
        style={{
          background: restaurant.banner_url
            ? `linear-gradient(90deg, rgba(0,0,0,.72), rgba(0,0,0,.28)), url(${restaurant.banner_url}) center/cover`
            : "linear-gradient(135deg, var(--restaurant-primary), var(--restaurant-secondary))",
        }}
      >
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/75">
            {displayMode === "lsc" ? "Experiencia LSC" : "Carta digital"}
          </p>
          <h2 className="mt-3 max-w-3xl text-4xl font-black leading-tight md:text-6xl">
            {restaurant.name}
          </h2>
          {restaurant.welcome_message && (
            <p className="mt-4 max-w-2xl text-lg text-white/78">{restaurant.welcome_message}</p>
          )}
        </div>
      </section>

      <main className="mx-auto max-w-6xl px-4 py-8 pb-16">
        <CategoryNav
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {displayMode === "traditional" ? (
          <TraditionalMenu products={filteredProducts} />
        ) : (
          <LSCMenu products={filteredProducts} />
        )}
      </main>
    </div>
  );
}

function CategoryNav({
  categories,
  selectedCategory,
  onSelect,
}: {
  categories: Category[];
  selectedCategory: string | null;
  onSelect: (categoryId: string | null) => void;
}) {
  if (categories.length === 0) return null;

  return (
    <nav className="mb-8 flex gap-2 overflow-x-auto pb-2">
      <button
        onClick={() => onSelect(null)}
        className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
          selectedCategory === null
            ? "text-white"
            : "border-border bg-white text-foreground hover:border-primary"
        }`}
        style={selectedCategory === null ? { background: "var(--restaurant-primary)" } : undefined}
      >
        Todos
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition ${
            selectedCategory === category.id
              ? "text-white"
              : "border-border bg-white text-foreground hover:border-primary"
          }`}
          style={
            selectedCategory === category.id
              ? { background: "var(--restaurant-primary)" }
              : undefined
          }
        >
          {category.name}
        </button>
      ))}
    </nav>
  );
}

function TraditionalMenu({ products }: { products: Product[] }) {
  if (products.length === 0) return <EmptyMenu />;

  return (
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <article
          key={product.id}
          className="overflow-hidden rounded-lg border border-border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <ProductImage product={product} />
          <div className="p-4">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-xl font-bold text-foreground">{product.name}</h3>
              <p className="whitespace-nowrap text-lg font-black" style={{ color: "var(--restaurant-primary)" }}>
                {currency.format(Number(product.price))}
              </p>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
            <AllergenBadges allergens={product.allergens} compact />
          </div>
        </article>
      ))}
    </div>
  );
}

function LSCMenu({ products }: { products: Product[] }) {
  if (products.length === 0) return <EmptyMenu />;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {products.map((product) => (
        <article key={product.id} className="rounded-lg border border-border bg-white p-4 shadow-sm">
          {product.lscVideo ? (
            <div className="overflow-hidden rounded-lg border border-black/10 bg-black">
              <video
                src={product.lscVideo.video_url}
                controls
                className="aspect-video w-full"
                aria-label={`Video LSC para ${product.name}`}
              />
            </div>
          ) : (
            <div className="flex aspect-video items-center justify-center rounded-lg bg-neutral-950 text-center text-sm font-semibold text-white">
              <Video size={28} className="mr-2" />
              Video LSC en preparacion
            </div>
          )}

          <div className="mt-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-2xl font-black text-foreground">{product.name}</h3>
                <p className="mt-2 text-base leading-relaxed text-muted-foreground">
                  {product.description}
                </p>
              </div>
              <p className="whitespace-nowrap text-2xl font-black" style={{ color: "var(--restaurant-primary)" }}>
                {currency.format(Number(product.price))}
              </p>
            </div>

            <AllergenBadges allergens={product.allergens} />
          </div>
        </article>
      ))}
    </div>
  );
}

function ProductImage({ product }: { product: Product }) {
  if (product.image_url) {
    return (
      <img
        src={product.image_url}
        alt={product.name}
        className="h-56 w-full object-cover"
      />
    );
  }

  return (
    <div
      className="flex h-56 w-full items-center justify-center text-white"
      style={{ background: "var(--restaurant-secondary)" }}
    >
      <Image size={36} />
    </div>
  );
}

function AllergenBadges({
  allergens,
  compact = false,
}: {
  allergens: Product["allergens"];
  compact?: boolean;
}) {
  if (!allergens || allergens.length === 0) return null;

  return (
    <div
      className={`mt-4 rounded-lg border ${
        compact ? "border-border bg-muted/40 p-3" : "border-orange-200 bg-orange-50 p-4"
      }`}
    >
      {!compact && (
        <div className="mb-3 flex items-center gap-2 text-sm font-bold text-orange-800">
          <AlertTriangle size={18} />
          Alergenos
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {allergens.map((allergen) => (
          <span
            key={allergen.id}
            className="rounded-full px-3 py-1 text-xs font-bold"
            style={{
              background: `${allergen.color || "#EA580C"}22`,
              color: allergen.color || "#9A3412",
            }}
          >
            {allergen.name}
          </span>
        ))}
      </div>
    </div>
  );
}

function EmptyMenu() {
  return (
    <div className="rounded-lg border border-dashed border-border bg-white p-12 text-center">
      <Eye size={32} className="mx-auto mb-3 text-muted-foreground" />
      <p className="font-semibold text-foreground">No hay productos en esta seccion.</p>
    </div>
  );
}
