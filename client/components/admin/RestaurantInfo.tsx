import { useState, useEffect } from "react";
import { Upload, AlertCircle, Loader, Check } from "lucide-react";
import { supabase } from "../../lib/supabase";

interface RestaurantData {
  id: string;
  name: string;
  description?: string;
  logo_url?: string;
  banner_url?: string;
  address?: string;
  whatsapp?: string;
  phone?: string;
  email_contact?: string;
  website?: string;
  instagram_url?: string;
  facebook_url?: string;
  tiktok_url?: string;
  business_hours?: Record<string, { open: string; close: string }>;
}

interface Props {
  restaurant: RestaurantData;
  onUpdate: (data: RestaurantData) => void;
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function RestaurantInfo({ restaurant, onUpdate }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState<RestaurantData>(restaurant);
  const [businessHours, setBusinessHours] = useState(
    restaurant.business_hours || {
      Monday: { open: "09:00", close: "18:00" },
      Tuesday: { open: "09:00", close: "18:00" },
      Wednesday: { open: "09:00", close: "18:00" },
      Thursday: { open: "09:00", close: "18:00" },
      Friday: { open: "09:00", close: "18:00" },
      Saturday: { open: "10:00", close: "20:00" },
      Sunday: { open: "10:00", close: "20:00" },
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHourChange = (day: string, field: "open" | "close", value: string) => {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const fileName = `logo-${restaurant.id}-${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from("restaurant-assets")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from("restaurant-assets")
        .getPublicUrl(fileName);

      setFormData((prev) => ({ ...prev, logo_url: publicUrl.publicUrl }));
      setSuccess("Logo uploaded successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error uploading logo");
    } finally {
      setLoading(false);
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const fileName = `banner-${restaurant.id}-${Date.now()}`;
      const { error: uploadError } = await supabase.storage
        .from("restaurant-assets")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: publicUrl } = supabase.storage
        .from("restaurant-assets")
        .getPublicUrl(fileName);

      setFormData((prev) => ({ ...prev, banner_url: publicUrl.publicUrl }));
      setSuccess("Banner uploaded successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error uploading banner");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error: updateError } = await supabase
        .from("restaurants")
        .update({
          ...formData,
          business_hours: businessHours,
        })
        .eq("id", restaurant.id);

      if (updateError) throw updateError;

      onUpdate({ ...formData, business_hours: businessHours });
      setSuccess("Restaurant information saved successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error saving changes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold text-foreground mb-6">Restaurant Information</h2>

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

      <div className="space-y-8">
        {/* Logo */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Logo</h3>
          <div className="flex gap-6">
            {formData.logo_url && (
              <div className="w-32 h-32 rounded-lg border border-border overflow-hidden bg-background">
                <img src={formData.logo_url} alt="Logo" className="w-full h-full object-cover" />
              </div>
            )}
            <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary hover:bg-background transition-colors">
              <Upload size={32} className="text-muted-foreground mb-2" />
              <span className="text-foreground font-medium">Click to upload logo</span>
              <span className="text-sm text-muted-foreground">PNG, JPG up to 5MB</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* Banner */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Banner Image</h3>
          {formData.banner_url && (
            <div className="w-full h-40 rounded-lg border border-border overflow-hidden bg-background mb-4">
              <img src={formData.banner_url} alt="Banner" className="w-full h-full object-cover" />
            </div>
          )}
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-primary hover:bg-background transition-colors">
            <Upload size={32} className="text-muted-foreground mb-2" />
            <span className="text-foreground font-medium">Click to upload banner</span>
            <span className="text-sm text-muted-foreground">PNG, JPG up to 10MB (recommended: 1200x400px)</span>
            <input type="file" accept="image/*" onChange={handleBannerUpload} className="hidden" />
          </label>
        </div>

        {/* Basic Info */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Restaurant Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Tell customers about your restaurant..."
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Contact Information</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">WhatsApp</label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Email</label>
              <input
                type="email"
                name="email_contact"
                value={formData.email_contact || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Website</label>
              <input
                type="url"
                name="website"
                value={formData.website || ""}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>

        {/* Social Networks */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Social Networks</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Instagram</label>
              <input
                type="url"
                name="instagram_url"
                value={formData.instagram_url || ""}
                onChange={handleChange}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Facebook</label>
              <input
                type="url"
                name="facebook_url"
                value={formData.facebook_url || ""}
                onChange={handleChange}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">TikTok</label>
              <input
                type="url"
                name="tiktok_url"
                value={formData.tiktok_url || ""}
                onChange={handleChange}
                placeholder="https://tiktok.com/@..."
                className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          </div>
        </div>

        {/* Business Hours */}
        <div className="bg-card rounded-xl border border-border p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Business Hours</h3>
          <div className="space-y-3">
            {DAYS.map((day) => (
              <div key={day} className="flex items-center gap-4">
                <label className="w-28 text-sm font-semibold text-foreground">{day}</label>
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="time"
                    value={businessHours[day]?.open || "09:00"}
                    onChange={(e) => handleHourChange(day, "open", e.target.value)}
                    className="px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <span className="text-muted-foreground">to</span>
                  <input
                    type="time"
                    value={businessHours[day]?.close || "18:00"}
                    onChange={(e) => handleHourChange(day, "close", e.target.value)}
                    className="px-3 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full button-primary font-semibold py-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <Loader size={20} className="animate-spin" />}
          {loading ? "Saving..." : "Save Restaurant Information"}
        </button>
      </div>
    </div>
  );
}
