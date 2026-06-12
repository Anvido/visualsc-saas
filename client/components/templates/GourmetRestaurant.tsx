import { useState } from "react";
import { ShoppingCart, Star, ChefHat } from "lucide-react";

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

export default function GourmetRestaurant({
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

  const filteredProducts = selectedCategory
    ? products.filter((p) => p.category_id === selectedCategory)
    : products;

  if (isLSCMode) {
    return (
      <div className="min-h-screen bg-slate-900 text-white">
        {/* LSC Header */}
        <div className="bg-gradient-to-b from-amber-900 to-slate-900 p-8 text-center">
          <ChefHat className="mx-auto mb-4" size={48} />
          <h1 className="text-4xl font-serif font-bold mb-2">{restaurantName}</h1>
          <p className="text-xl text-amber-200">Experiencia Gourmet en LSC</p>
        </div>

        {/* Welcome Video */}
        {lscVideos["welcome"] && (
          <div className="p-8">
            <div className="rounded-xl overflow-hidden border-4 border-amber-600">
              <video
                controls
                className="w-full aspect-video bg-black"
                src={lscVideos["welcome"]}
              />
            </div>
          </div>
        )}

        {/* Categories */}
        <div className="p-8">
          <h2 className="text-3xl font-serif font-bold mb-6">Secciones del Menú</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-6 rounded-xl border-4 text-left transition-all ${
                  selectedCategory === cat.id
                    ? "bg-amber-600 border-amber-600"
                    : "bg-slate-800 border-amber-700 hover:border-amber-600"
                }`}
              >
                <div className="text-4xl mb-2">{cat.icon}</div>
                <p className="text-xl font-bold">{cat.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Products */}
        <div className="p-8">
          <div className="space-y-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-slate-800 rounded-xl overflow-hidden border border-amber-700"
              >
                {product.image_url && (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-serif font-bold mb-2">{product.name}</h3>
                  <p className="text-amber-100 mb-4">{product.description}</p>
                  <p className="text-3xl font-bold text-amber-400 mb-4">
                    ${product.price.toFixed(2)}
                  </p>

                  {lscVideos[product.id] && (
                    <div className="mb-4 rounded-lg overflow-hidden border-2 border-amber-600">
                      <video
                        controls
                        className="w-full aspect-video bg-black"
                        src={lscVideos[product.id]}
                      />
                    </div>
                  )}

                  <button
                    onClick={() => onAddToCart?.(product)}
                    className="w-full bg-amber-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-amber-700"
                  >
                    <ShoppingCart className="inline mr-2" size={24} />
                    Solicitar Plato
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Elegant Header */}
      <div className="border-b border-amber-700 bg-gradient-to-b from-amber-900 to-slate-900 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-4xl font-serif font-bold text-amber-50 mb-1">
                {restaurantName}
              </h1>
              <p className="text-amber-200">Fine Dining Experience</p>
            </div>
            <Star className="text-amber-400" size={32} />
          </div>

          {/* Vertical Category List */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`whitespace-nowrap px-6 py-3 rounded-lg border transition-all font-serif ${
                  selectedCategory === cat.id
                    ? "bg-amber-600 border-amber-600 text-white"
                    : "bg-slate-800 border-amber-700 text-amber-200 hover:border-amber-600"
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Section Title */}
        <div className="mb-12 text-center border-b border-amber-700 pb-6">
          <h2 className="text-3xl font-serif font-bold text-amber-50 mb-2">
            {categories.find((c) => c.id === selectedCategory)?.name}
          </h2>
          <p className="text-amber-200">Discover our exquisite selection</p>
        </div>

        {/* Products - List Style */}
        <div className="space-y-8">
          {filteredProducts.map((product, index) => (
            <div
              key={product.id}
              className={`flex gap-6 ${index % 2 === 1 ? "flex-row-reverse" : ""}`}
            >
              {/* Image */}
              {product.image_url && (
                <div className="w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden border border-amber-700">
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-amber-50 mb-2">
                    {product.name}
                  </h3>
                  <p className="text-amber-100 mb-4 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Allergens */}
                  {product.allergens && product.allergens.length > 0 && (
                    <div className="mb-4 flex gap-2 flex-wrap">
                      {product.allergens.map((allergen) => (
                        <span
                          key={allergen}
                          className="text-xs bg-red-900/50 text-red-200 px-3 py-1 rounded-full border border-red-700"
                        >
                          {allergen}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between pt-4 border-t border-amber-700">
                  <p className="text-2xl font-serif font-bold text-amber-400">
                    ${product.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => onAddToCart?.(product)}
                    className="bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors font-serif font-bold"
                  >
                    Reserve
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
