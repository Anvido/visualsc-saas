import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import {
  AlertCircle,
  Check,
  Image,
  Loader,
  MonitorSmartphone,
  Palette,
  Save,
  Upload,
} from "lucide-react";
import { supabase } from "../../lib/supabase";
import { TEMPLATE_TYPES, type TemplateType } from "../templates";

interface Props {
  restaurantId: string;
  onRestaurantUpdate?: (restaurant: RestaurantData) => void;
}

interface RestaurantData {
  id: string;
  name: string;
  slug?: string;
  logo_url?: string;
  banner_url?: string;
  template_type: TemplateType;
  color_primary?: string;
  color_accent?: string;
  primary_color?: string;
  secondary_color?: string;
  font_family?: string;
  display_mode?: "traditional" | "lsc";
}

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id?: string;
  featured?: boolean;
  lsc_library?: {
    id: string;
    title: string;
    video_url: string;
  } | null;
}

const fontOptions = ["Inter", "Playfair Display", "Arial", "Georgia"];
const fallbackProducts: Product[] = [
  {
    id: "espresso",
    name: "Espresso",
    description: "Cafe intenso de origen colombiano.",
    price: 7200,
    category_id: "coffee",
    featured: true,
  },
  {
    id: "croissant",
    name: "Croissant",
    description: "Horneado del dia con mantequilla.",
    price: 9800,
    category_id: "bakery",
  },
  {
    id: "limonada",
    name: "Limonada natural",
    description: "Fria, citrica y preparada al momento.",
    price: 8500,
    category_id: "drinks",
  },
];

const fallbackCategories: Category[] = [
  { id: "coffee", name: "Cafe", icon: "Cafe" },
  { id: "bakery", name: "Panaderia", icon: "Pan" },
  { id: "drinks", name: "Bebidas", icon: "Bebida" },
];

export default function TemplateStudio({ restaurantId, onRestaurantUpdate }: Props) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"logo" | "banner" | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("accessibility-first");
  const [displayMode, setDisplayMode] = useState<"traditional" | "lsc">("traditional");
  const [design, setDesign] = useState({
    primary_color: "#1F3F70",
    secondary_color: "#F0B233",
    font_family: "Inter",
    logo_url: "",
    banner_url: "",
  });

  useEffect(() => {
    loadData();
  }, [restaurantId]);

  const loadData = async () => {
    try {
      setError("");
      const [{ data: restaurantData }, { data: categoryData }, { data: productData }] =
        await Promise.all([
          supabase.from("restaurants").select("*").eq("id", restaurantId).single(),
          supabase
            .from("categories")
            .select("id, name, icon")
            .eq("restaurant_id", restaurantId)
            .order("display_order", { ascending: true }),
          supabase
            .from("products")
            .select("id, name, description, price, image_url, category_id, featured, lsc_library(id, title, video_url)")
            .eq("restaurant_id", restaurantId)
            .eq("status", "active")
            .order("display_order", { ascending: true }),
        ]);

      if (restaurantData) {
        const nextRestaurant = restaurantData as RestaurantData;
        const nextPrimary =
          nextRestaurant.primary_color || nextRestaurant.color_primary || "#1F3F70";
        const nextSecondary =
          nextRestaurant.secondary_color || nextRestaurant.color_accent || "#F0B233";

        setRestaurant(nextRestaurant);
        setSelectedTemplate(nextRestaurant.template_type || "accessibility-first");
        setDisplayMode(nextRestaurant.display_mode || "traditional");
        setDesign({
          primary_color: nextPrimary,
          secondary_color: nextSecondary,
          font_family: nextRestaurant.font_family || "Inter",
          logo_url: nextRestaurant.logo_url || "",
          banner_url: nextRestaurant.banner_url || "",
        });
      }

      setCategories((categoryData as Category[]) || []);
      setProducts(
        ((productData || []) as any[]).map((product) => ({
          ...product,
          lsc_library: Array.isArray(product.lsc_library)
            ? product.lsc_library[0] || null
            : product.lsc_library || null,
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar el diseno.");
    } finally {
      setLoading(false);
    }
  };

  const visibleCategories = categories.length > 0 ? categories : fallbackCategories;
  const visibleProducts = products.length > 0 ? products : fallbackProducts;

  const previewStyle = useMemo(
    () =>
      ({
        "--studio-primary": design.primary_color,
        "--studio-secondary": design.secondary_color,
        fontFamily: `"${design.font_family}", sans-serif`,
      }) as CSSProperties,
    [design]
  );

  const handleAssetUpload = async (
    type: "logo" | "banner",
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !restaurant) return;

    setUploading(type);
    setError("");

    try {
      const fileName = `${type}-${restaurant.id}-${Date.now()}`;
      const bucket = "restaurant-assets";
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage.from(bucket).getPublicUrl(fileName);
      setDesign((current) => ({
        ...current,
        [`${type}_url`]: publicUrl.publicUrl,
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo subir el archivo.");
    } finally {
      setUploading(null);
    }
  };

  const handleSave = async () => {
    if (!restaurant) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const payload = {
        template_type: selectedTemplate,
        logo_url: design.logo_url || null,
        banner_url: design.banner_url || null,
        primary_color: design.primary_color,
        secondary_color: design.secondary_color,
        color_primary: design.primary_color,
        color_accent: design.secondary_color,
        font_family: design.font_family,
        display_mode: displayMode,
      };

      const { data, error: updateError } = await supabase
        .from("restaurants")
        .update(payload)
        .eq("id", restaurant.id)
        .select()
        .single();

      if (updateError) throw updateError;

      const nextRestaurant = data as RestaurantData;
      setRestaurant(nextRestaurant);
      onRestaurantUpdate?.(nextRestaurant);
      setSuccess("Diseno guardado.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar el diseno.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
        <AlertCircle size={20} />
        <p>No se encontro el restaurante.</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Template Studio
          </p>
          <h2 className="mt-2 text-3xl font-bold text-foreground">Diseno del menu</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            {restaurant.name} usa una sola carta y VISUALSC renderiza ambos modos.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
        >
          {saving ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
          Guardar diseno
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          <Check size={18} />
          <p>{success}</p>
        </div>
      )}

      <div className="grid min-h-[720px] gap-5 xl:grid-cols-[280px_minmax(0,1fr)_320px]">
        <section className="rounded-lg border border-border bg-card p-4">
          <div className="mb-4 flex items-center gap-2">
            <MonitorSmartphone size={18} className="text-primary" />
            <h3 className="font-semibold text-foreground">Plantillas</h3>
          </div>

          <div className="space-y-3">
            {(Object.entries(TEMPLATE_TYPES) as [TemplateType, (typeof TEMPLATE_TYPES)[TemplateType]][]).map(
              ([id, template]) => (
                <button
                  key={id}
                  onClick={() => setSelectedTemplate(id)}
                  className={`w-full rounded-lg border p-3 text-left transition ${
                    selectedTemplate === id
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-border bg-background hover:border-primary/40"
                  }`}
                >
                  <div
                    className="mb-3 h-20 rounded-md"
                    style={{
                      background: `linear-gradient(135deg, ${design.primary_color}, ${template.accent}, ${design.secondary_color})`,
                    }}
                  />
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-foreground">{template.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{template.description}</p>
                    </div>
                    <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                      2 modos
                    </span>
                  </div>
                </button>
              )
            )}
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-border bg-neutral-950 p-4">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
                Vista previa
              </p>
              <h3 className="text-lg font-semibold text-white">
                {TEMPLATE_TYPES[selectedTemplate].name}
              </h3>
            </div>

            <div className="inline-grid grid-cols-2 rounded-lg border border-white/15 bg-white/10 p-1">
              <button
                onClick={() => setDisplayMode("traditional")}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                  displayMode === "traditional"
                    ? "bg-white text-neutral-950"
                    : "text-white/75 hover:text-white"
                }`}
              >
                Tradicional
              </button>
              <button
                onClick={() => setDisplayMode("lsc")}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
                  displayMode === "lsc"
                    ? "bg-white text-neutral-950"
                    : "text-white/75 hover:text-white"
                }`}
              >
                LSC
              </button>
            </div>
          </div>

          <MenuPreview
            categories={visibleCategories}
            displayMode={displayMode}
            products={visibleProducts}
            restaurant={restaurant}
            selectedTemplate={selectedTemplate}
            style={previewStyle}
            design={design}
          />
        </section>

        <section className="rounded-lg border border-border bg-card p-4">
          <div className="mb-4 flex items-center gap-2">
            <Palette size={18} className="text-primary" />
            <h3 className="font-semibold text-foreground">Configuracion visual</h3>
          </div>

          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Color principal
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={design.primary_color}
                  onChange={(event) =>
                    setDesign((current) => ({
                      ...current,
                      primary_color: event.target.value,
                    }))
                  }
                  className="h-11 w-14 rounded-md border border-border bg-background p-1"
                />
                <input
                  value={design.primary_color}
                  onChange={(event) =>
                    setDesign((current) => ({
                      ...current,
                      primary_color: event.target.value,
                    }))
                  }
                  className="min-w-0 flex-1 rounded-lg border border-border bg-input px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Color secundario
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={design.secondary_color}
                  onChange={(event) =>
                    setDesign((current) => ({
                      ...current,
                      secondary_color: event.target.value,
                    }))
                  }
                  className="h-11 w-14 rounded-md border border-border bg-background p-1"
                />
                <input
                  value={design.secondary_color}
                  onChange={(event) =>
                    setDesign((current) => ({
                      ...current,
                      secondary_color: event.target.value,
                    }))
                  }
                  className="min-w-0 flex-1 rounded-lg border border-border bg-input px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                Tipografia
              </label>
              <select
                value={design.font_family}
                onChange={(event) =>
                  setDesign((current) => ({
                    ...current,
                    font_family: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-border bg-input px-3 py-2 text-sm"
              >
                {fontOptions.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            <AssetControl
              label="Logo"
              type="logo"
              value={design.logo_url}
              uploading={uploading === "logo"}
              onUpload={handleAssetUpload}
            />

            <AssetControl
              label="Banner"
              type="banner"
              value={design.banner_url}
              uploading={uploading === "banner"}
              onUpload={handleAssetUpload}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function AssetControl({
  label,
  type,
  value,
  uploading,
  onUpload,
}: {
  label: string;
  type: "logo" | "banner";
  value: string;
  uploading: boolean;
  onUpload: (type: "logo" | "banner", event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-foreground">{label}</label>
      {value && (
        <div className="mb-3 overflow-hidden rounded-lg border border-border bg-background">
          <img
            src={value}
            alt={label}
            className={type === "logo" ? "h-20 w-20 object-cover" : "h-28 w-full object-cover"}
          />
        </div>
      )}
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-background px-3 py-4 text-sm font-semibold text-muted-foreground transition hover:border-primary hover:text-primary">
        {uploading ? <Loader size={18} className="animate-spin" /> : <Upload size={18} />}
        {uploading ? "Subiendo" : `Subir ${label.toLowerCase()}`}
        <input
          type="file"
          accept="image/*"
          onChange={(event) => onUpload(type, event)}
          disabled={uploading}
          className="hidden"
        />
      </label>
    </div>
  );
}

function MenuPreview({
  categories,
  design,
  displayMode,
  products,
  restaurant,
  selectedTemplate,
  style,
}: {
  categories: Category[];
  design: {
    primary_color: string;
    secondary_color: string;
    font_family: string;
    logo_url: string;
    banner_url: string;
  };
  displayMode: "traditional" | "lsc";
  products: Product[];
  restaurant: RestaurantData;
  selectedTemplate: TemplateType;
  style: CSSProperties;
}) {
  const featuredProducts = products.filter((product) => product.featured).slice(0, 2);
  const heroProducts = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 2);
  const template = TEMPLATE_TYPES[selectedTemplate];

  return (
    <div
      className="mx-auto h-[640px] max-w-[430px] overflow-hidden rounded-[28px] border-[10px] border-neutral-800 bg-white shadow-2xl"
      style={style}
    >
      <div className="h-full overflow-y-auto bg-white text-neutral-950">
        <div
          className="relative min-h-[210px] overflow-hidden p-5 text-white"
          style={{
            background:
              design.banner_url
                ? `linear-gradient(180deg, rgba(0,0,0,.3), rgba(0,0,0,.65)), url(${design.banner_url}) center/cover`
                : `linear-gradient(135deg, var(--studio-primary), ${template.accent})`,
          }}
        >
          <div className="flex items-center justify-between gap-4">
            {design.logo_url ? (
              <img
                src={design.logo_url}
                alt={restaurant.name}
                className="h-12 w-12 rounded-lg border border-white/30 object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-white/30 bg-white/15 text-xl font-black">
                {restaurant.name.charAt(0)}
              </div>
            )}
            <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-xs font-semibold">
              {displayMode === "lsc" ? "Modo LSC" : "Menu Tradicional"}
            </span>
          </div>

          <div className="mt-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
              {template.name}
            </p>
            <h4 className="mt-2 text-3xl font-black leading-tight">{restaurant.name}</h4>
          </div>
        </div>

        <div className="p-5">
          <div className="flex gap-2 overflow-x-auto pb-4">
            {categories.map((category) => (
              <button
                key={category.id}
                className="whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold"
                style={{
                  borderColor: "var(--studio-primary)",
                  color: "var(--studio-primary)",
                  background: "white",
                }}
              >
                {category.name}
              </button>
            ))}
          </div>

          {displayMode === "lsc" ? (
            <div className="space-y-4">
              <div
                className="flex aspect-video items-center justify-center rounded-lg text-center text-sm font-semibold text-white"
                style={{ background: "var(--studio-primary)" }}
              >
                <Image size={28} className="mr-2" />
                Video LSC principal
              </div>
              {heroProducts.map((product) => (
                <article key={product.id} className="rounded-lg border border-neutral-200 p-4">
                  <div className="mb-3 flex aspect-video items-center justify-center rounded-md bg-neutral-950 text-white">
                    {product.lsc_library ? product.lsc_library.title : "Video sugerido"}
                  </div>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h5 className="text-lg font-bold">{product.name}</h5>
                      <p className="mt-1 text-sm text-neutral-500">{product.description}</p>
                    </div>
                    <p className="font-black" style={{ color: "var(--studio-primary)" }}>
                      ${Number(product.price).toLocaleString("es-CO")}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {products.slice(0, 5).map((product) => (
                <article
                  key={product.id}
                  className="grid grid-cols-[76px_minmax(0,1fr)] gap-3 rounded-lg border border-neutral-200 p-3"
                >
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-[76px] w-[76px] rounded-md object-cover"
                    />
                  ) : (
                    <div
                      className="flex h-[76px] w-[76px] items-center justify-center rounded-md text-sm font-bold text-white"
                      style={{ background: "var(--studio-secondary)" }}
                    >
                      VIS
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <h5 className="font-bold">{product.name}</h5>
                      <p className="font-black" style={{ color: "var(--studio-primary)" }}>
                        ${Number(product.price).toLocaleString("es-CO")}
                      </p>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
                      {product.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
