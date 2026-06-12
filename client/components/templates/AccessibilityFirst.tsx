import { useState } from "react";
import { ShoppingCart, Volume2, ChevronRight } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category_id?: string;
  allergens?: string[];
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface TemplateProps {
  products: Product[];
  categories: Category[];
  restaurantName: string;
  isLSCMode: boolean;
  onAddToCart?: (product: Product) => void;
  lscVideos?: Record<string, string>;
}

export default function AccessibilityFirst({
  products,
  categories,
  restaurantName,
  isLSCMode,
  onAddToCart,
  lscVideos = {},
}: TemplateProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    categories[0]?.id || null
  );
  const [expandedProduct, setExpandedProduct] = useState<string | null>(null);

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  return (
    <div className="min-h-screen bg-white">
      {/* Accessible Header - High Contrast */}
      <header className="sticky top-0 z-40 bg-primary text-white border-b-4 border-secondary">
        <div className="p-6 md:p-8">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            {restaurantName}
          </h1>
          <p className="text-xl md:text-2xl font-semibold mb-4">
            Menú en Lengua de Señas Colombiana
          </p>

          {/* Welcome Video - Prominent */}
          {lscVideos["welcome"] && (
            <div className="rounded-xl overflow-hidden border-4 border-secondary mt-4 mb-4">
              <video
                controls
                className="w-full aspect-video bg-black"
                src={lscVideos["welcome"]}
              />
            </div>
          )}

          <p className="text-base md:text-lg">
            Selecciona una categoría para explorar nuestro menú
          </p>
        </div>
      </header>

      {/* Category Navigation - Large Touch Targets */}
      <nav className="bg-secondary/10 border-b-4 border-secondary p-4 md:p-6">
        <p className="text-sm font-semibold text-primary mb-3 md:text-base">CATEGORÍAS</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-6 rounded-xl border-4 transition-all text-center font-bold text-lg md:text-xl focus:outline-none focus:ring-4 ${
                selectedCategory === cat.id
                  ? "bg-primary text-white border-secondary shadow-lg"
                  : "bg-white text-primary border-primary hover:bg-primary/5"
              }`}
              aria-pressed={selectedCategory === cat.id}
            >
              <div className="text-5xl mb-2">{cat.icon}</div>
              <div>{cat.name}</div>
            </button>
          ))}
        </div>
      </nav>

      {/* Products Section */}
      <main className="p-4 md:p-6 max-w-6xl mx-auto">
        {/* Section Header */}
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-2 mt-6">
          {categories.find((c) => c.id === selectedCategory)?.name}
        </h2>
        <p className="text-lg text-primary/70 mb-6">
          {filteredProducts.length} artículos disponibles
        </p>

        {/* Products Grid - Large Cards */}
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white border-4 border-primary rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              {/* Product Header - Always Visible */}
              <button
                onClick={() => setExpandedProduct(expandedProduct === product.id ? null : product.id)}
                className="w-full p-6 md:p-8 bg-primary text-white text-left hover:bg-primary/90 transition-colors flex items-center justify-between group"
                aria-expanded={expandedProduct === product.id}
              >
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-1">{product.name}</h3>
                  <p className="text-lg md:text-xl text-white/90">{product.description}</p>
                </div>
                <ChevronRight
                  size={32}
                  className={`flex-shrink-0 ml-4 transition-transform ${
                    expandedProduct === product.id ? "rotate-90" : ""
                  }`}
                />
              </button>

              {/* Expandable Content */}
              {expandedProduct === product.id && (
                <div className="p-6 md:p-8 bg-white border-t-4 border-primary space-y-4">
                  {/* Product Image */}
                  {product.image_url && (
                    <div className="rounded-xl overflow-hidden border-4 border-secondary">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-80 object-cover"
                      />
                    </div>
                  )}

                  {/* Price - Large and Clear */}
                  <div className="bg-secondary/20 p-6 rounded-xl border-4 border-secondary">
                    <p className="text-sm font-bold text-primary mb-1">PRECIO</p>
                    <p className="text-5xl font-bold text-secondary">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>

                  {/* LSC Video - Prominent */}
                  {lscVideos[product.id] && (
                    <div className="rounded-xl overflow-hidden border-4 border-secondary">
                      <video
                        controls
                        className="w-full aspect-video bg-black"
                        src={lscVideos[product.id]}
                      />
                    </div>
                  )}

                  {/* Allergens - High Visibility */}
                  {product.allergens && product.allergens.length > 0 && (
                    <div className="bg-red-100 p-6 rounded-xl border-4 border-red-600">
                      <p className="text-sm font-bold text-red-600 mb-2">ALÉRGENOS</p>
                      <div className="flex flex-wrap gap-2">
                        {product.allergens.map((allergen) => (
                          <span
                            key={allergen}
                            className="inline-block bg-red-600 text-white px-4 py-2 rounded-lg font-bold text-lg"
                          >
                            {allergen}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Add to Cart - Large Button */}
                  <button
                    onClick={() => onAddToCart?.(product)}
                    className="w-full bg-secondary text-white py-6 md:py-8 rounded-xl font-bold text-2xl md:text-3xl hover:bg-secondary/90 transition-colors flex items-center justify-center gap-3 border-4 border-secondary focus:outline-none focus:ring-4 focus:ring-primary"
                  >
                    <ShoppingCart size={36} />
                    Añadir al carrito
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12 bg-primary/5 rounded-xl border-4 border-primary p-8">
            <p className="text-2xl font-bold text-primary">
              No hay productos en esta categoría
            </p>
          </div>
        )}
      </main>

      {/* Footer - Accessibility Info */}
      <footer className="bg-primary text-white border-t-4 border-secondary p-6 text-center">
        <p className="text-sm md:text-base">
          Este menú está optimizado para accesibilidad. Presiona TAB para navegar.
        </p>
      </footer>
    </div>
  );
}
