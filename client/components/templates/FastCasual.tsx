import { useState } from "react";
import { ShoppingCart, Zap, Plus, Minus } from "lucide-react";

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
  onAddToCart?: (product: Product, quantity?: number) => void;
  lscVideos?: Record<string, string>;
}

export default function FastCasual({
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
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  const updateQuantity = (productId: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[productId] || 0;
      const newQty = Math.max(0, current + delta);
      return { ...prev, [productId]: newQty };
    });
  };

  if (isLSCMode) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        {/* LSC Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-white">
          <Zap className="inline mr-2" size={32} />
          <h1 className="text-3xl font-bold inline">{restaurantName}</h1>
          <p className="text-white/90 mt-2">¡Ordena Rápido!</p>
        </div>

        {/* Welcome Video */}
        {lscVideos["welcome"] && (
          <div className="p-4">
            <div className="rounded-xl overflow-hidden border-4 border-orange-500">
              <video
                controls
                className="w-full aspect-video bg-black"
                src={lscVideos["welcome"]}
              />
            </div>
          </div>
        )}

        {/* Categories Grid */}
        <div className="p-4">
          <div className="grid grid-cols-3 gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-4 rounded-xl text-center border-4 transition-all ${
                  selectedCategory === cat.id
                    ? "bg-orange-500 text-white border-orange-600"
                    : "bg-white border-orange-300 text-foreground"
                }`}
              >
                <div className="text-3xl mb-1">{cat.icon}</div>
                <p className="text-sm font-bold">{cat.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="p-4">
          <div className="space-y-3">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg border-2 border-orange-200 p-4">
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                )}
                <h3 className="text-lg font-bold mb-1">{product.name}</h3>
                <p className="text-sm text-foreground/60 mb-2">{product.description}</p>
                <p className="text-2xl font-bold text-orange-600 mb-3">
                  ${product.price.toFixed(2)}
                </p>

                {lscVideos[product.id] && (
                  <div className="mb-3 rounded-lg overflow-hidden border-2 border-orange-500">
                    <video
                      controls
                      className="w-full aspect-video bg-black"
                      src={lscVideos[product.id]}
                    />
                  </div>
                )}

                <button
                  onClick={() => onAddToCart?.(product, 1)}
                  className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-orange-600"
                >
                  Ordenar Ahora
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white">
      {/* Mobile-First Header */}
      <div className="sticky top-0 z-40 bg-white border-b-2 border-orange-200">
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h1 className="text-2xl font-bold text-orange-600 flex items-center gap-2">
                <Zap size={28} />
                {restaurantName}
              </h1>
              <p className="text-xs text-muted-foreground">Quick & Easy Ordering</p>
            </div>
            <ShoppingCart className="text-orange-500" size={28} />
          </div>

          {/* Category Buttons - Scrollable */}
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${
                selectedCategory === null
                  ? "bg-orange-500 text-white"
                  : "bg-gray-100 text-foreground hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${
                  selectedCategory === cat.id
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-foreground hover:bg-gray-200"
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid - Mobile Optimized */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg border border-orange-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
            >
              {/* Quick Image */}
              {product.image_url && (
                <div className="aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Info */}
              <div className="p-3">
                <h3 className="font-bold text-sm line-clamp-2 mb-1">{product.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                  {product.description}
                </p>

                {/* Allergens */}
                {product.allergens && product.allergens.length > 0 && (
                  <div className="mb-2 flex gap-1 flex-wrap">
                    {product.allergens.slice(0, 2).map((allergen) => (
                      <span key={allergen} className="text-xs bg-red-50 text-red-700 px-1.5 py-0.5 rounded">
                        {allergen}
                      </span>
                    ))}
                  </div>
                )}

                {/* Price */}
                <p className="text-lg font-bold text-orange-600 mb-2">
                  ${product.price.toFixed(2)}
                </p>

                {/* Quick Add */}
                <div className="flex gap-1">
                  <button
                    onClick={() => updateQuantity(product.id, -1)}
                    disabled={(quantities[product.id] || 0) === 0}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded p-1"
                  >
                    <Minus size={16} className="mx-auto" />
                  </button>
                  <div className="flex-1 flex items-center justify-center bg-gray-50 rounded font-bold text-sm">
                    {quantities[product.id] || 0}
                  </div>
                  <button
                    onClick={() => updateQuantity(product.id, 1)}
                    className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded p-1"
                  >
                    <Plus size={16} className="mx-auto" />
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  onClick={() => onAddToCart?.(product, quantities[product.id] || 1)}
                  className="w-full mt-2 bg-orange-500 text-white py-2 rounded font-bold text-sm hover:bg-orange-600"
                >
                  <ShoppingCart className="inline mr-1" size={16} />
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
