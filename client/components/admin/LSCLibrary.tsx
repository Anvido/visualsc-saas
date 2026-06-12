import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Check,
  CircleCheck,
  Loader,
  MessageSquare,
  Search,
  Sparkles,
  Video,
} from "lucide-react";
import { supabase } from "../../lib/supabase";

interface Product {
  id: string;
  name: string;
  description?: string;
  lsc_library_id?: string | null;
}

interface LibraryVideo {
  id: string;
  title: string;
  description?: string;
  video_url: string;
  keywords: string[] | null;
  usage_count: number;
  lsc_library_categories?: {
    name: string;
    icon?: string;
  } | null;
}

interface Props {
  restaurantId: string;
}

export default function LSCLibrary({ restaurantId }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [videos, setVideos] = useState<LibraryVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadData();
  }, [restaurantId]);

  const loadData = async () => {
    try {
      setError("");
      const [{ data: productData }, { data: libraryData }] = await Promise.all([
        supabase
          .from("products")
          .select("id, name, description, lsc_library_id")
          .eq("restaurant_id", restaurantId)
          .eq("status", "active")
          .order("name", { ascending: true }),
        supabase
          .from("lsc_library")
          .select("id, title, description, video_url, keywords, usage_count, lsc_library_categories(name, icon)")
          .eq("status", "active")
          .order("usage_count", { ascending: false }),
      ]);

      setProducts((productData as Product[]) || []);
      setVideos(
        ((libraryData || []) as any[]).map((video) => ({
          ...video,
          lsc_library_categories: Array.isArray(video.lsc_library_categories)
            ? video.lsc_library_categories[0] || null
            : video.lsc_library_categories || null,
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo cargar la biblioteca LSC.");
    } finally {
      setLoading(false);
    }
  };

  const suggestions = useMemo(() => {
    return products
      .filter((product) => !product.lsc_library_id)
      .map((product) => ({
        product,
        video: findSuggestion(product, videos),
      }))
      .filter((item) => item.video);
  }, [products, videos]);

  const linkedCount = products.filter((product) => product.lsc_library_id).length;
  const filteredVideos = searchTerm
    ? videos.filter((video) => {
        const term = searchTerm.toLowerCase();
        return (
          video.title.toLowerCase().includes(term) ||
          (video.description || "").toLowerCase().includes(term) ||
          (video.keywords || []).some((keyword) => keyword.toLowerCase().includes(term))
        );
      })
    : videos;

  const handleAssociate = async (productId: string, videoId: string, autoMatched = false) => {
    setSavingId(productId);
    setError("");
    setSuccess("");

    try {
      const { error: updateError } = await supabase
        .from("products")
        .update({ lsc_library_id: videoId })
        .eq("id", productId);

      if (updateError) throw updateError;

      await supabase.from("product_lsc_associations").upsert(
        {
          product_id: productId,
          lsc_library_id: videoId,
          auto_matched: autoMatched,
        },
        { onConflict: "product_id,lsc_library_id" }
      );

      setProducts((current) =>
        current.map((product) =>
          product.id === productId ? { ...product, lsc_library_id: videoId } : product
        )
      );
      setSuccess("Video LSC asociado.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo asociar el video.");
    } finally {
      setSavingId(null);
    }
  };

  const handleRequestTranslation = async (product: Product) => {
    setSavingId(product.id);
    setError("");
    setSuccess("");

    try {
      const { error: requestError } = await supabase
        .from("lsc_translation_requests")
        .insert({
          restaurant_id: restaurantId,
          product_name: product.name,
          description: product.description || "",
          status: "pending",
          priority: 1,
        });

      if (requestError) throw requestError;

      setSuccess("Solicitud enviada al equipo VISUALSC.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo enviar la solicitud.");
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            VISUALSC Master Library
          </p>
          <h2 className="mt-2 text-3xl font-bold text-foreground">Biblioteca LSC</h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Los restaurantes asocian productos a videos oficiales; la biblioteca sigue siendo
            un activo central de VISUALSC.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Metric label="Videos" value={videos.length} />
          <Metric label="Productos" value={products.length} />
          <Metric label="Vinculados" value={linkedCount} />
        </div>
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

      <section className="rounded-lg border border-border bg-card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles size={18} className="text-primary" />
          <h3 className="font-semibold text-foreground">Sugerencias automaticas</h3>
        </div>

        {suggestions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-background p-8 text-center text-sm text-muted-foreground">
            No hay sugerencias pendientes.
          </div>
        ) : (
          <div className="grid gap-3 lg:grid-cols-2">
            {suggestions.map(({ product, video }) => (
              <div
                key={product.id}
                className="rounded-lg border border-border bg-background p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Producto</p>
                    <h4 className="text-lg font-semibold text-foreground">{product.name}</h4>
                  </div>
                  <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    Match
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-primary/20 bg-primary/5 p-3">
                  <p className="text-sm font-semibold text-primary">{video!.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{video!.description}</p>
                </div>

                <button
                  onClick={() => handleAssociate(product.id, video!.id, true)}
                  disabled={savingId === product.id}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-60"
                >
                  {savingId === product.id ? (
                    <Loader size={16} className="animate-spin" />
                  ) : (
                    <CircleCheck size={16} />
                  )}
                  Asociar sugerencia
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <section className="rounded-lg border border-border bg-card p-5">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Video size={18} className="text-primary" />
              <h3 className="font-semibold text-foreground">Videos oficiales</h3>
            </div>

            <div className="relative md:w-80">
              <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Buscar video o palabra clave"
                className="w-full rounded-lg border border-border bg-input py-2 pl-9 pr-3 text-sm"
              />
            </div>
          </div>

          <div className="grid gap-3 lg:grid-cols-2">
            {filteredVideos.map((video) => (
              <article
                key={video.id}
                className="rounded-lg border border-border bg-background p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">{video.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {video.lsc_library_categories?.name || "Biblioteca VISUALSC"}
                    </p>
                  </div>
                  <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-semibold text-muted-foreground">
                    {video.usage_count} usos
                  </span>
                </div>

                <p className="mt-3 text-sm text-muted-foreground">{video.description}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {(video.keywords || []).slice(0, 5).map((keyword) => (
                    <span
                      key={keyword}
                      className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-border bg-card p-5">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquare size={18} className="text-primary" />
            <h3 className="font-semibold text-foreground">Productos sin video</h3>
          </div>

          <div className="space-y-3">
            {products.filter((product) => !product.lsc_library_id).length === 0 ? (
              <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                Todos los productos activos tienen asociacion LSC.
              </div>
            ) : (
              products
                .filter((product) => !product.lsc_library_id)
                .map((product) => (
                  <div
                    key={product.id}
                    className="rounded-lg border border-border bg-background p-3"
                  >
                    <p className="font-semibold text-foreground">{product.name}</p>
                    <button
                      onClick={() => handleRequestTranslation(product)}
                      disabled={savingId === product.id}
                      className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-primary px-3 py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-primary-foreground disabled:opacity-60"
                    >
                      {savingId === product.id ? (
                        <Loader size={16} className="animate-spin" />
                      ) : (
                        <MessageSquare size={16} />
                      )}
                      Solicitar traduccion
                    </button>
                  </div>
                ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-card px-4 py-3 text-center">
      <p className="text-2xl font-bold text-foreground">{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

function findSuggestion(product: Product, videos: LibraryVideo[]) {
  const productText = `${product.name} ${product.description || ""}`.toLowerCase();

  return videos.find((video) => {
    const keywords = video.keywords || [];
    return (
      productText.includes(video.title.toLowerCase()) ||
      keywords.some((keyword) => productText.includes(keyword.toLowerCase()))
    );
  });
}
