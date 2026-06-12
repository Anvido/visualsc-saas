import { useState } from "react";
import { ShoppingCart, Heart, Share2, Volume2 } from "lucide-react";

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

export default function ModernCoffeeShop({
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
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  const toggleFavorite = (productId: string) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  if (isLSCMode) {
    return (
      <div className="min-h-screen bg-white">
        {/* LSC Header */}
        <div className="bg-gradient-to-r from-primary to-accent p-6 text-white text-center">
          <h1 className="text-4xl font-serif font-bold mb-2">{restaurantName}</h1>
          <p className="text-lg">Explorar Menú en Lengua de Señas</p>
        </div>

        {/* Welcome Video */}
        <div className="p-6 bg-primary/5">
          {lscVideos["welcome"] && (
            <div className="rounded-xl overflow-hidden border-4 border-primary">
              <video
                controls
                className="w-full aspect-video bg-black"
                src={lscVideos["welcome"]}
              />
            </div>
          )}
        </div>

        {/* Categories Grid */}
        <div className="p-6">
          <h2 className="text-3xl font-serif font-bold mb-6">Categorías</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-6 rounded-2xl border-4 text-center transition-all ${
                  selectedCategory === cat.id
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-foreground border-gray-300 hover:border-primary"
                }`}
              >
                <div className="text-4xl mb-2">{cat.icon}</div>
                <p className="text-lg font-bold">{cat.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid - Large Cards */}
        <div className="p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-2">{product.name}</h3>
                  <p className="text-foreground/60 mb-4">{product.description}</p>
                  <p className="text-2xl font-bold text-secondary mb-4">
                    ${product.price.toFixed(2)}
                  </p>

                  {lscVideos[product.id] && (
                    <div className="mb-4 rounded-lg overflow-hidden border-2 border-primary">
                      <video
                        controls
                        className="w-full aspect-video bg-black"
                        src={lscVideos[product.id]}
                      />
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => onAddToCart?.(product)}
                      className="flex-1 bg-primary text-white py-4 rounded-lg font-bold text-lg hover:bg-primary/90"
                    >
                      <ShoppingCart className="inline mr-2" size={24} />
                      Añadir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">{restaurantName}</h1>
              <p className="text-muted-foreground">Specialty Coffee Experience</p>
            </div>
            <ShoppingCart className="text-primary" size={32} />
          </div>

          {/* Category Navigation - Horizontal Scroll */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-6 py-2 rounded-full transition-all ${
                  selectedCategory === cat.id
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-foreground hover:bg-gray-200"
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-bold text-foreground">
            {categories.find((c) => c.id === selectedCategory)?.name || "All Items"}
          </h2>
          <p className="text-muted-foreground mt-1">
            {filteredProducts.length} items available
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100"
            >
              {/* Product Image */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                )}
                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-3 bg-white rounded-full p-2 hover:bg-gray-100 shadow-sm"
                >
                  <Heart
                    size={20}
                    className={favorites.has(product.id) ? "fill-red-500 text-red-500" : "text-gray-400"}
                  />
                </button>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground line-clamp-1 mb-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {product.description}
                </p>

                {/* Allergens */}
                {product.allergens && product.allergens.length > 0 && (
                  <div className="flex gap-1 mb-3 flex-wrap">
                    {product.allergens.map((allergen) => (
                      <span
                        key={allergen}
                        className="inline-block text-xs bg-red-50 text-red-700 px-2 py-1 rounded"
                      >
                        {allergen}
                      </span>
                    ))}
                  </div>
                )}

                {/* Price and Action */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <p className="text-lg font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => onAddToCart?.(product)}
                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
