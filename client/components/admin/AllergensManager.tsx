import { useState, useEffect } from "react";
import { Plus, Trash2, AlertCircle, Loader, Check } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface Allergen {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  is_system: boolean;
}

interface Props {
  restaurantId: string;
}

const EMOJI_ICONS = [
  "⚠️", "🥛", "🌾", "🥜", "🌳", "🥚", "🦐", "🧂", "🐟",
  "🦞", "🦀", "🍌", "🍊", "🍓", "🥒", "🧈", "🥛", "🌰",
];

const COLORS = [
  "#FF6B6B", "#FF8E8E", "#FFA8A8",
  "#FF6B6B", "#FF8E72", "#FFAB63",
  "#FFD163", "#FFE066", "#FFE66D",
];

export default function AllergensManager({ restaurantId }: Props) {
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    icon: "⚠️",
    color: "#FF6B6B",
    description: "",
  });

  useEffect(() => {
    loadAllergens();
  }, []);

  const loadAllergens = async () => {
    try {
      const { data, error: queryError } = await supabase
        .from("allergens")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("is_system", { ascending: false });

      if (queryError) throw queryError;
      setAllergens(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading allergens");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async () => {
    if (!formData.name.trim()) {
      setError("Allergen name is required");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const { data, error: insertError } = await supabase
        .from("allergens")
        .insert({
          restaurant_id: restaurantId,
          name: formData.name,
          icon: formData.icon,
          color: formData.color,
          description: formData.description,
          is_system: false,
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setAllergens([...allergens, data]);
      setFormData({ name: "", icon: "⚠️", color: "#FF6B6B", description: "" });
      setShowForm(false);
      setSuccess("Allergen added successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error adding allergen");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, isSystem: boolean) => {
    if (isSystem) {
      setError("Cannot delete system allergens");
      return;
    }

    if (!confirm("Delete this allergen?")) return;

    try {
      const { error: deleteError } = await supabase
        .from("allergens")
        .delete()
        .eq("id", id);

      if (deleteError) throw deleteError;

      setAllergens(allergens.filter((a) => a.id !== id));
      setSuccess("Allergen deleted!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error deleting allergen");
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
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Allergens</h2>
        <button
          onClick={() => {
            setFormData({ name: "", icon: "⚠️", color: "#FF6B6B", description: "" });
            setShowForm(!showForm);
          }}
          className="button-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Add Allergen
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
          <h3 className="text-lg font-bold text-foreground mb-4">Add New Allergen</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Peanuts, Shellfish"
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Icon</label>
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
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Color</label>
              <div className="flex gap-2">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => setFormData({ ...formData, color })}
                    className={`w-10 h-10 rounded border-2 transition-all ${
                      formData.color === color ? "border-foreground" : "border-transparent"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Description..."
                rows={2}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleAdd}
                disabled={submitting}
                className="flex-1 button-primary py-2 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {submitting && <Loader size={16} className="animate-spin" />}
                Add Allergen
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormData({ name: "", icon: "⚠️", color: "#FF6B6B", description: "" });
                }}
                className="flex-1 button-outline py-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Allergens Grid */}
      <div className="grid gap-4">
        {allergens.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">No allergens added. Click "Add Allergen" to get started.</p>
          </div>
        ) : (
          allergens.map((allergen) => (
            <div
              key={allergen.id}
              className="bg-card rounded-xl border border-border p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-4 flex-1">
                <div
                  className="text-4xl p-3 rounded-lg"
                  style={{ backgroundColor: allergen.color + "20" }}
                >
                  {allergen.icon}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-foreground">{allergen.name}</h4>
                  {allergen.description && (
                    <p className="text-sm text-muted-foreground mt-1">{allergen.description}</p>
                  )}
                  {allergen.is_system && (
                    <span className="text-xs text-muted-foreground">System allergen</span>
                  )}
                </div>
              </div>
              {!allergen.is_system && (
                <button
                  onClick={() => handleDelete(allergen.id, allergen.is_system)}
                  className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors flex items-center gap-2"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
