import { useState, useEffect } from "react";
import { Plus, Trash2, AlertCircle, Loader, Check, Video, TrendingUp, MessageSquare } from "lucide-react";
import { supabase } from "../lib/supabase";

interface LibraryVideo {
  id: string;
  category_id: string;
  title: string;
  description: string;
  video_url: string;
  usage_count: number;
  keywords: string[];
  status: string;
  created_at: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface TranslationRequest {
  id: string;
  restaurant_id: string;
  product_name: string;
  status: string;
  priority: number;
  requested_date: string;
}

export default function SuperAdminLSCLibrary() {
  const [activeTab, setActiveTab] = useState<"library" | "requests" | "analytics">("library");
  const [videos, setVideos] = useState<LibraryVideo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [requests, setRequests] = useState<TranslationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category_id: "",
    keywords: "",
    video_url: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [{ data: videosData }, { data: categoriesData }, { data: requestsData }] = await Promise.all([
        supabase
          .from("lsc_library")
          .select("*")
          .order("usage_count", { ascending: false }),
        supabase
          .from("lsc_library_categories")
          .select("*"),
        supabase
          .from("lsc_translation_requests")
          .select("*")
          .eq("status", "pending")
          .order("priority", { ascending: false }),
      ]);

      setVideos(videosData || []);
      setCategories(categoriesData || []);
      setRequests(requestsData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error loading data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddVideo = async () => {
    if (!formData.title || !formData.category_id) {
      setError("Title and category are required");
      return;
    }

    try {
      const keywordArray = formData.keywords
        .split(",")
        .map((k) => k.trim().toLowerCase())
        .filter((k) => k);

      const { data, error: insertError } = await supabase
        .from("lsc_library")
        .insert({
          title: formData.title,
          description: formData.description,
          category_id: formData.category_id,
          keywords: keywordArray,
          video_url: formData.video_url,
          status: "active",
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setVideos([...videos, data]);
      setFormData({ title: "", description: "", category_id: "", keywords: "", video_url: "" });
      setShowForm(false);
      setSuccess("LSC Video added to library!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error adding video");
    }
  };

  const handleApproveRequest = async (requestId: string, action: "approved" | "rejected") => {
    try {
      const { error: updateError } = await supabase
        .from("lsc_translation_requests")
        .update({ status: action })
        .eq("id", requestId);

      if (updateError) throw updateError;

      setRequests(requests.filter((r) => r.id !== requestId));
      setSuccess(`Request ${action}!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating request");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-white border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-serif font-bold">VISUALSC LSC Library</h1>
          <p className="text-white/80 mt-1">Centralized master LSC video library</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-card border-b border-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 flex gap-1">
          <button
            onClick={() => setActiveTab("library")}
            className={`px-6 py-4 font-medium border-b-2 transition-colors ${
              activeTab === "library"
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            <Video size={20} className="inline mr-2" />
            Video Library
          </button>
          <button
            onClick={() => setActiveTab("requests")}
            className={`px-6 py-4 font-medium border-b-2 transition-colors ${
              activeTab === "requests"
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            <MessageSquare size={20} className="inline mr-2" />
            Translation Requests ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-6 py-4 font-medium border-b-2 transition-colors ${
              activeTab === "analytics"
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            }`}
          >
            <TrendingUp size={20} className="inline mr-2" />
            Analytics
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
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

        {/* Library Tab */}
        {activeTab === "library" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">Master LSC Video Library</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="button-primary flex items-center gap-2"
              >
                <Plus size={20} />
                Add Video
              </button>
            </div>

            {/* Add Form */}
            {showForm && (
              <div className="bg-card rounded-xl border border-border p-6 mb-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Add LSC Video to Library</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Cappuccino - Standard"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Category *</label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Select category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">
                      Keywords (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={formData.keywords}
                      onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                      placeholder="cappuccino, espresso, coffee"
                      className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                    <p className="text-sm text-muted-foreground mt-1">Used for auto-matching products</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Video URL *</label>
                    <input
                      type="url"
                      value={formData.video_url}
                      onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                      placeholder="https://..."
                      className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-foreground mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Description..."
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-input text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={handleAddVideo}
                      className="flex-1 button-primary py-2"
                    >
                      Add to Library
                    </button>
                    <button
                      onClick={() => setShowForm(false)}
                      className="flex-1 button-outline py-2"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Videos List */}
            <div className="grid gap-4">
              {videos.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                  <p className="text-muted-foreground">No videos in library yet</p>
                </div>
              ) : (
                videos.map((video) => {
                  const category = categories.find((c) => c.id === video.category_id);
                  return (
                    <div key={video.id} className="bg-card rounded-xl border border-border p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-bold text-foreground">{video.title}</h4>
                            {category && <span className="text-2xl">{category.icon}</span>}
                          </div>
                          <p className="text-muted-foreground text-sm">{video.description}</p>
                          <div className="flex gap-4 mt-3">
                            <span className="text-sm">
                              <strong>Category:</strong> {category?.name}
                            </span>
                            <span className="text-sm">
                              <strong>Usage:</strong> {video.usage_count} products
                            </span>
                            <span className="text-sm">
                              <strong>Keywords:</strong> {video.keywords.join(", ")}
                            </span>
                          </div>
                        </div>
                        <button className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 flex items-center gap-2">
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
        )}

        {/* Requests Tab */}
        {activeTab === "requests" && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">LSC Translation Requests</h2>
            <div className="grid gap-4">
              {requests.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-xl border border-border">
                  <p className="text-muted-foreground">No pending translation requests</p>
                </div>
              ) : (
                requests.map((req) => (
                  <div key={req.id} className="bg-card rounded-xl border border-border p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="text-lg font-bold text-foreground">{req.product_name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Requested: {new Date(req.requested_date).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Priority: {req.priority} | Demand: {req.priority} restaurants
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleApproveRequest(req.id, "approved")}
                          className="px-4 py-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 font-medium"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleApproveRequest(req.id, "rejected")}
                          className="px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Library Analytics</h2>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-card rounded-xl border border-border p-6">
                <p className="text-sm text-muted-foreground">Total Videos</p>
                <p className="text-3xl font-bold text-primary mt-2">{videos.length}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <p className="text-sm text-muted-foreground">Total Usage</p>
                <p className="text-3xl font-bold text-primary mt-2">
                  {videos.reduce((sum, v) => sum + v.usage_count, 0)}
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <p className="text-sm text-muted-foreground">Pending Requests</p>
                <p className="text-3xl font-bold text-primary mt-2">{requests.length}</p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6">
                <p className="text-sm text-muted-foreground">Categories</p>
                <p className="text-3xl font-bold text-primary mt-2">{categories.length}</p>
              </div>
            </div>

            {/* Top Videos */}
            <div className="mt-8">
              <h3 className="text-xl font-bold text-foreground mb-4">Most Used Videos</h3>
              <div className="space-y-3">
                {videos
                  .sort((a, b) => b.usage_count - a.usage_count)
                  .slice(0, 10)
                  .map((video) => (
                    <div key={video.id} className="flex items-center justify-between bg-card rounded-lg border border-border p-4">
                      <p className="font-medium text-foreground">{video.title}</p>
                      <p className="text-sm font-bold text-primary">{video.usage_count} uses</p>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
