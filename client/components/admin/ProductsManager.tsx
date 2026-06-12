import { useState, useEffect } from "react";
import { Plus, Trash2, AlertCircle, Loader, Check, Edit2, Upload, X } from "lucide-react";
import { supabase } from "../../lib/supabase";
import LSCLibrarySearch from "./LSCLibrarySearch";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category_id: string;
  featured: boolean;
  status: string;
  ingredients?: any[];
  lsc_library_id?: string;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface Allergen {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface Props {
  restaurantId: string;
  planLimit: number;
  onProductCountChange: (count: number) => void;
}

export default function ProductsManager({ restaurantId, planLimit, onProductCountChange }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category_id: "",
    featured: false,
    image_url: "",
    ingredients: [] as string[],
    allergen_ids: [] as string[],
    lsc_library_id: "",
    ingredientInput: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [{ data: productsData }, { data: categoriesData }, { data: allergensData }] = await Promise.all([
        supabase
          .from("products")
          .select("*")
          .eq("restaurant_id", restaurantId)
          .order("created_at", { ascending: false }),
        supabase
          .from("categories")
          .select("*")
          .eq("restaurant_id", restaurantId),
        supabase
          .from("allergens")
          .select("*")
          .eq("restaurant_id", restaurantId),
      ]);

      setProducts(productsData || []);
      setCategories(categoriesData || []);
      setAllergens(allergensData || []);
      onProductCountChange(productsData?.length || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileName = `product-${restaurantId}-${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from("restaurant-assets")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from("restaurant-assets")
        .getPublicUrl(fileName);

      setFormData((prev) => ({ ...prev, image_url: publicUrl.publicUrl }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error uploading image");
    } finally {
      setUploading(false);
    }
  };

  const handleAddIngredient = () => {
    if (formData.ingredientInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        ingredients: [...prev.ingredients, prev.ingredientInput],
        ingredientInput: "",
      }));
    }
  };

  const handleRemoveIngredient = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index),
    }));
  };

  const toggleAllergen = (allergenId: string) => {
    setFormData((prev) => ({
      ...prev,
      allergen_ids: prev.allergen_ids.includes(allergenId)
        ? prev.allergen_ids.filter((id) => id !== allergenId)
        : [...prev.allergen_ids, allergenId],
    }));
  };

  const handleAdd = async () => {
    if (!formData.name || !formData.category_id || !formData.price) {
      setError("Please fill in name, category, and price");
      return;
    }

    if (products.length >= planLimit) {
      setError(`Product limit reached (${planLimit} products)`);
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const { data, error: insertError } = await supabase
        .from("products")
        .insert({
          restaurant_id: restaurantId,
          name: formData.name,
          description: formData.description,
          price: parseFloat(formData.price),
          category_id: formData.category_id,
          featured: formData.featured,
          image_url: formData.image_url,
          ingredients: formData.ingredients,
          lsc_library_id: formData.lsc_library_id || null,
          status: "active",
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Insert allergen associations
      if (formData.allergen_ids.length > 0) {
        await supabase.from("product_allergens").insert(
          formData.allergen_ids.map((allergen_id) => ({
            product_id: data.id,
            allergen_id,
          }))
        );
      }

      if (formData.lsc_library_id) {
        await supabase.from("product_lsc_associations").insert({
          product_id: data.id,
          lsc_library_id: formData.lsc_library_id,
          auto_matched: true,
        });
      }

      setProducts([data, ...products]);
      onProductCountChange(products.length + 1);
      resetForm();
      setShowForm(false);
      setSuccess("Product added successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error adding product");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;

    try {
      await supabase.from("product_allergens").delete().eq("product_id", id);
      const { error: deleteError } = await supabase
        .from("products")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      const newProducts = products.filter((p) => p.id !== id);
      setProducts(newProducts);
      onProductCountChange(newProducts.length);
      setSuccess("Product deleted!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting product");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category_id: "",
      featured: false,
      image_url: "",
      ingredients: [],
      allergen_ids: [],
      lsc_library_id: "",
      ingredientInput: "",
    });
  };

  const handleRequestTranslation = async () => {
    if (!formData.name.trim()) {
      setError("Ingresa el nombre del producto antes de solicitar una traduccion.");
      return;
    }

    try {
      const category = categories.find((item) => item.id === formData.category_id);
      const { error: requestError } = await supabase
        .from("lsc_translation_requests")
        .insert({
          restaurant_id: restaurantId,
          product_name: formData.name.trim(),
          category_suggestion: category?.name || null,
          description: formData.description,
          priority: 1,
          status: "pending",
        });

      if (requestError) throw requestError;

      setSuccess("Solicitud enviada al equipo VISUALSC.");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo solicitar la traduccion.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Products</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {products.length}/{planLimit} products used
          </p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingId(null);
            setShowForm(!showForm);
          }}
          disabled={products.length >= planLimit}
          className="button-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 rounded-lg bg-red-50 border border-red-200 flex gap-2">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 rounded-lg bg-green-50 border border-green-200 flex gap-2">
          <Check size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          <p className="text-green-600">{success}</p>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-card rounded-xl border border-border p-6 mb-6 space-y-6">
          <h3 className="text-lg font-bold text-foreground">Add New Product</h3>

          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Product Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Cappuccino"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Category *
              </label>
              <select
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Price *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded border border-border"
                />
                <span className="text-sm font-medium text-foreground">Featured Product</span>
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe this product..."
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Product Image
            </label>
            {formData.image_url && (
              <div className="mb-3 relative w-32 h-32 rounded-lg overflow-hidden border border-border">
                <img
                  src={formData.image_url}
                  alt="Product"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setFormData({ ...formData, image_url: "" })}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded hover:bg-red-700"
                >
                  <X size={16} />
                </button>
              </div>
            )}
            <label className="flex items-center justify-center border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary hover:bg-background transition-colors">
              <div className="text-center">
                {uploading ? (
                  <>
                    <Loader size={24} className="text-primary mx-auto mb-2 animate-spin" />
                    <span className="text-sm text-primary">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={24} className="text-muted-foreground mx-auto mb-2" />
                    <span className="text-sm font-medium text-foreground">Click to upload image</span>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>
          </div>

          {/* Ingredients */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Ingredients
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={formData.ingredientInput}
                onChange={(e) => setFormData({ ...formData, ingredientInput: e.target.value })}
                onKeyPress={(e) => e.key === "Enter" && handleAddIngredient()}
                placeholder="Add ingredient..."
                className="flex-1 px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <button
                onClick={handleAddIngredient}
                className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.ingredients.map((ingredient, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                >
                  {ingredient}
                  <button
                    onClick={() => handleRemoveIngredient(idx)}
                    className="hover:text-primary/70"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Allergens */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Allergens
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {allergens.map((allergen) => (
                <button
                  key={allergen.id}
                  onClick={() => toggleAllergen(allergen.id)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    formData.allergen_ids.includes(allergen.id)
                      ? "border-red-600 bg-red-50"
                      : "border-border bg-background hover:border-red-400"
                  }`}
                >
                  <div className="text-xl">{allergen.icon}</div>
                  <p className="text-sm font-medium text-foreground mt-1">{allergen.name}</p>
                </button>
              ))}
            </div>
          </div>

          <LSCLibrarySearch
            productName={formData.name}
            selectedVideoId={formData.lsc_library_id}
            onSelectVideo={(videoId) =>
              setFormData((current) => ({ ...current, lsc_library_id: videoId }))
            }
            onRequestTranslation={handleRequestTranslation}
          />

          {/* Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={submitting}
              className="flex-1 button-primary py-2 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {submitting && <Loader size={16} className="animate-spin" />}
              Add Product
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="flex-1 button-outline py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products List */}
      <div className="grid gap-4">
        {products.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">No products yet. Click "Add Product" to get started.</p>
          </div>
        ) : (
          products.map((product) => {
            const category = categories.find((c) => c.id === product.category_id);
            return (
              <div
                key={product.id}
                className="bg-card rounded-xl border border-border p-6 flex items-start justify-between"
              >
                <div className="flex gap-4 flex-1">
                  {product.image_url && (
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-background flex-shrink-0">
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex items-start gap-2">
                      <h4 className="text-lg font-semibold text-foreground">{product.name}</h4>
                      {product.featured && (
                        <span className="text-xs bg-secondary text-white px-2 py-1 rounded">Featured</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {category && (
                        <>
                          {category.icon} {category.name}
                        </>
                      )}
                    </p>
                    {product.ingredients && product.ingredients.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Ingredients: {product.ingredients.join(", ")}
                      </p>
                    )}
                    <p className="text-lg font-bold text-primary mt-2">
                      ${product.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors flex items-center gap-2">
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
