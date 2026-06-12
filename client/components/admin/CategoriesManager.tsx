import { useState, useEffect } from "react";
import { Plus, Trash2, AlertCircle, Loader, Check } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface Category {
  id: string;
  name: string;
  icon: string;
  display_order: number;
  created_at: string;
}

interface Props {
  restaurantId: string;
}

const EMOJI_ICONS = [
  "☕", "🍰", "🥐", "🍵", "🧋", "🥤", "🍷", "🍸", "🍹",
  "🍔", "🍕", "🌮", "🥗", "🍜", "🍝", "🍲", "🥘", "🍛",
  "🥩", "🍗", "🦐", "🦞", "🦀", "🐟", "🥓", "🥞", "🧈",
  "🍪", "🎂", "🍩", "🧁", "🍫", "🍬", "🍭", "🍮", "🍯",
  "🥜", "🌰", "🥦", "🥕", "🍅", "🧄", "🧅", "🥔", "🍞",
];

export default function CategoriesManager({ restaurantId }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", icon: "☕" });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error: queryError } = await supabase
        .from("categories")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("display_order", { ascending: true });

      if (queryError) throw queryError;
      setCategories(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      setError("Category name is required");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const { data, error: insertError } = await supabase
        .from("categories")
        .insert({
          restaurant_id: restaurantId,
          name: formData.name,
          icon: formData.icon,
          display_order: categories.length,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setCategories([...categories, data]);
      setFormData({ name: "", icon: "☕" });
      setShowForm(false);
      setSuccess("Category added successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error adding category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.name.trim()) {
      setError("Category name is required");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const { error: updateError } = await supabase
        .from("categories")
        .update({
          name: formData.name,
          icon: formData.icon,
        })
        .eq("id", id);

      if (updateError) throw updateError;

      setCategories(
        categories.map((cat) =>
          cat.id === id ? { ...cat, name: formData.name, icon: formData.icon } : cat
        )
      );
      setFormData({ name: "", icon: "☕" });
      setEditingId(null);
      setShowForm(false);
      setSuccess("Category updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating category");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;

    try {
      const { error: deleteError } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      setCategories(categories.filter((cat) => cat.id !== id));
      setSuccess("Category deleted!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting category");
    }
  };

  const startEdit = (category: Category) => {
    setFormData({ name: category.name, icon: category.icon });
    setEditingId(category.id);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Categories</h2>
        <button
          onClick={() => {
            setFormData({ name: "", icon: "☕" });
            setEditingId(null);
            setShowForm(!showForm);
          }}
          className="button-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Category
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
        <div className="bg-card rounded-xl border border-border p-6 mb-6">
          <h3 className="text-lg font-bold text-foreground mb-4">
            {editingId ? "Edit Category" : "Add New Category"}
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Category Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Espresso, Desserts"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Icon
              </label>
              <div className="grid grid-cols-10 gap-2 border border-border rounded-lg p-4">
                {EMOJI_ICONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setFormData({ ...formData, icon: emoji })}
                    className={`text-2xl p-2 rounded transition-all ${
                      formData.icon === emoji
                        ? "bg-primary text-white"
                        : "bg-background hover:bg-background/80"
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-2">Selected: {formData.icon}</p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() =>
                  editingId ? handleUpdate(editingId) : handleAdd()
                }
                disabled={submitting}
                className="flex-1 button-primary py-2 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting && <Loader size={16} className="animate-spin" />}
                {editingId ? "Update" : "Add"}
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ name: "", icon: "☕" });
                }}
                className="flex-1 button-outline py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Categories List */}
      <div className="grid gap-4">
        {categories.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p>No categories yet. Click "Add Category" to get started.</p>
          </div>
        ) : (
          categories.map((category) => (
            <div
              key={category.id}
              className="bg-card rounded-xl border border-border p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{category.icon}</div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground">{category.name}</h4>
                  <p className="text-sm text-muted-foreground">Created: {new Date(category.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(category)}
                  className="px-4 py-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(category.id)}
                  className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
