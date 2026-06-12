import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  Plus,
  Edit2,
  Trash2,
  BarChart3,
  LogOut,
  Settings,
  Upload,
  Video,
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url?: string;
  category_id: string;
  status: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  display_order: number;
}

interface LSCVideo {
  id: string;
  title: string;
  video_url: string;
  product_id?: string;
  category: string;
}

interface Allergen {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [restaurantId, setRestaurantId] = useState<string>('');
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [lscVideos, setLscVideos] = useState<LSCVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category_id: '',
    image_url: '',
    allergen_ids: [] as string[],
  });

  // Get auth info from localStorage or session
  useEffect(() => {
    const auth = localStorage.getItem('auth');
    if (!auth) {
      navigate('/login');
      return;
    }

    try {
      const authData = JSON.parse(auth);
      setRestaurantId(authData.restaurant_id);
      fetchData(authData.restaurant_id);
    } catch {
      navigate('/login');
    }
  }, [navigate]);

  const fetchData = async (restId: string) => {
    try {
      // Fetch categories
      const categoriesRes = await fetch(`/api/categories/${restId}`);
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData);

      // Fetch products
      const productsRes = await fetch(`/api/admin/products/${restId}`);
      const productsData = await productsRes.json();
      setProducts(productsData);

      // Fetch allergens
      const allergensRes = await fetch(`/api/allergens`);
      const allergensData = await allergensRes.json();
      setAllergens(allergensData);

      // Fetch LSC videos
      const videosRes = await fetch(`/api/lsc-videos/${restId}`);
      const videosData = await videosRes.json();
      setLscVideos(videosData);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth');
    navigate('/login');
  };

  const handleAddProduct = async () => {
    if (!formData.name || !formData.price || !formData.category_id) {
      alert('Please fill required fields');
      return;
    }

    try {
      const payload = {
        restaurant_id: restaurantId,
        ...formData,
        price: parseFloat(formData.price),
      };

      const response = await fetch('/api/admin/products', {
        method: editingProduct ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingProduct ? { ...payload, product_id: editingProduct.id } : payload),
      });

      if (response.ok) {
        fetchData(restaurantId);
        setShowProductForm(false);
        setEditingProduct(null);
        setFormData({
          name: '',
          description: '',
          price: '',
          category_id: '',
          image_url: '',
          allergen_ids: [],
        });
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure?')) return;

    try {
      await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' });
      fetchData(restaurantId);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category_id: product.category_id,
      image_url: product.image_url || '',
      allergen_ids: [],
    });
    setShowProductForm(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col fixed md:relative h-screen z-40`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sidebar-primary to-sidebar-accent flex items-center justify-center flex-shrink-0">
            <span className="text-sidebar-primary-foreground font-serif font-bold text-sm">V</span>
          </div>
          {sidebarOpen && <span className="text-white font-serif font-bold text-lg">VISUALSC</span>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-sidebar-accent rounded-lg text-sidebar-foreground"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'products', label: 'Productos', icon: Plus },
            { id: 'videos', label: 'Videos LSC', icon: Video },
            { id: 'settings', label: 'Configuración', icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/20'
              }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-red-500/10 hover:text-red-600 transition-colors"
          >
            <LogOut size={20} />
            {sidebarOpen && <span className="text-sm font-medium">Cerrar sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6 sticky top-0 z-30">
          <h1 className="text-2xl font-serif font-bold text-foreground">Panel de Control</h1>
          <button className="md:hidden p-2 hover:bg-secondary/10 rounded-lg">
            <Menu size={24} />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' && (
            <div className="max-w-6xl space-y-6">
              <h2 className="text-3xl font-serif font-bold text-foreground">Bienvenido</h2>

              {/* KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Productos</p>
                  <p className="text-3xl font-bold text-foreground">{products.length}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Categorías</p>
                  <p className="text-3xl font-bold text-foreground">{categories.length}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Videos LSC</p>
                  <p className="text-3xl font-bold text-foreground">{lscVideos.length}</p>
                </div>
                <div className="bg-card border border-border rounded-xl p-6">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Estado</p>
                  <p className="text-3xl font-bold text-green-600">Activo</p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div
                  onClick={() => setActiveTab('products')}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg cursor-pointer transition"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">Gestionar Productos</h3>
                  <p className="text-muted-foreground text-sm">Agregar, editar o eliminar productos del menú</p>
                </div>
                <div
                  onClick={() => setActiveTab('videos')}
                  className="bg-card border border-border rounded-xl p-6 hover:shadow-lg cursor-pointer transition"
                >
                  <h3 className="text-lg font-semibold text-foreground mb-2">Videos en LSC</h3>
                  <p className="text-muted-foreground text-sm">Subir y gestionar videos en Lengua de Señas</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="max-w-6xl space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-serif font-bold text-foreground">Productos</h2>
                <button
                  onClick={() => {
                    setShowProductForm(!showProductForm);
                    setEditingProduct(null);
                    setFormData({
                      name: '',
                      description: '',
                      price: '',
                      category_id: categories[0]?.id || '',
                      image_url: '',
                      allergen_ids: [],
                    });
                  }}
                  className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition"
                >
                  {showProductForm ? 'Cancelar' : '+ Nuevo Producto'}
                </button>
              </div>

              {showProductForm && (
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-foreground">
                    {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Nombre del producto"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />

                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <textarea
                    placeholder="Descripción"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Precio"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />

                    <input
                      type="text"
                      placeholder="URL de imagen"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Alérgenos</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {allergens.map((allergen) => (
                        <label key={allergen.id} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={formData.allergen_ids.includes(allergen.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  allergen_ids: [...formData.allergen_ids, allergen.id],
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  allergen_ids: formData.allergen_ids.filter((id) => id !== allergen.id),
                                });
                              }
                            }}
                            className="rounded"
                          />
                          <span className="text-sm">{allergen.icon} {allergen.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleAddProduct}
                    className="w-full px-4 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition"
                  >
                    {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
                  </button>
                </div>
              )}

              {/* Products List */}
              <div className="space-y-3">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">{product.name}</h4>
                      <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditProduct(product)}
                        className="p-2 rounded-lg hover:bg-secondary/10 transition"
                      >
                        <Edit2 size={18} className="text-primary" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="p-2 rounded-lg hover:bg-red-500/10 transition"
                      >
                        <Trash2 size={18} className="text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'videos' && (
            <div className="max-w-6xl space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-serif font-bold text-foreground">Videos LSC</h2>
                <button className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:opacity-90 transition">
                  + Subir Video
                </button>
              </div>

              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-muted-foreground text-center py-8">
                  Función de carga de videos disponible próximamente.
                  <br />
                  Mientras tanto, contacta con el equipo de VISUALSC para agregar videos.
                </p>
              </div>

              {/* Videos List */}
              {lscVideos.length > 0 && (
                <div className="space-y-3">
                  {lscVideos.map((video) => (
                    <div
                      key={video.id}
                      className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">{video.title}</h4>
                        <p className="text-sm text-muted-foreground">{video.category}</p>
                      </div>
                      <button className="p-2 rounded-lg hover:bg-secondary/10 transition">
                        <Play size={18} className="text-primary" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-6xl space-y-6">
              <h2 className="text-3xl font-serif font-bold text-foreground">Configuración</h2>

              <div className="bg-card border border-border rounded-xl p-6">
                <p className="text-muted-foreground text-center py-8">
                  Opciones de configuración disponibles próximamente.
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

// Placeholder for missing icon
const Play = (props: any) => (
  <svg {...props} viewBox="0 0 24 24" fill="currentColor">
    <path d="M8 5v14l11-7z" />
  </svg>
);

