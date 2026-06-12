import { Router, Request, Response } from 'express';
import { createClient } from '@supabase/supabase-js';

const router = Router();

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'placeholder-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// ==================== AUTHENTICATION ====================

// Login endpoint
router.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Query user
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, restaurant_id, role')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // In production, verify password hash
    // For MVP: simple check (DO NOT USE IN PRODUCTION)
    if (password !== 'demo123456') {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token (simple, use proper JWT library in production)
    const token = Buffer.from(
      JSON.stringify({
        user_id: user.id,
        restaurant_id: user.restaurant_id,
        role: user.role,
        email: user.email,
      })
    ).toString('base64');

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        restaurant_id: user.restaurant_id,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// ==================== PRODUCTS ====================

// Get products for public menu
router.get('/products/:restaurant_slug', async (req: Request, res: Response) => {
  try {
    const { restaurant_slug } = req.params;

    // Get restaurant
    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('id')
      .eq('slug', restaurant_slug)
      .single();

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    // Get products with allergens
    const { data: products } = await supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        price,
        image_url,
        lsc_library_id,
        category_id,
        categories (
          id,
          name,
          icon,
          display_order
        ),
        product_allergens (
          allergens (
            id,
            name,
            icon,
            color
          )
        ),
        lsc_library (
          id,
          title,
          video_url
        )
      `)
      .eq('restaurant_id', restaurant.id)
      .eq('status', 'active')
      .order('categories(display_order)', { ascending: true });

    // Transform to client format
    const formatted = products?.map((p: any) => ({
      id: p.id,
      name: p.name,
      description: p.description,
      price: p.price,
      image_url: p.image_url,
      category: p.categories,
      allergens: p.product_allergens?.map((pa: any) => pa.allergens),
      lscVideo: p.lsc_library,
    })) || [];

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get products for admin (with edit capability)
router.get('/admin/products/:restaurant_id', async (req: Request, res: Response) => {
  try {
    const { restaurant_id } = req.params;
    // TODO: Verify auth token and restaurant_id match

    const { data: products } = await supabase
      .from('products')
      .select(`
        id,
        name,
        description,
        price,
        image_url,
        status,
        category_id,
        categories (
          id,
          name
        ),
        product_allergens (
          allergens (
            id,
            name,
            icon
          )
        )
      `)
      .eq('restaurant_id', restaurant_id)
      .order('name', { ascending: true });

    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create product
router.post('/admin/products', async (req: Request, res: Response) => {
  try {
    const {
      restaurant_id,
      category_id,
      name,
      description,
      price,
      image_url,
      allergen_ids,
    } = req.body;

    // TODO: Verify auth

    // Insert product
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        restaurant_id,
        category_id,
        name,
        description,
        price,
        image_url,
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Insert allergens
    if (allergen_ids && allergen_ids.length > 0) {
      const allergenRecords = allergen_ids.map((allergen_id: string) => ({
        product_id: product.id,
        allergen_id,
      }));

      await supabase.from('product_allergens').insert(allergenRecords);
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product
router.patch('/admin/products/:product_id', async (req: Request, res: Response) => {
  try {
    const { product_id } = req.params;
    const { name, description, price, image_url, allergen_ids } = req.body;

    // TODO: Verify auth

    // Update product
    const { data: product, error } = await supabase
      .from('products')
      .update({
        name,
        description,
        price,
        image_url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', product_id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Update allergens (delete and re-insert)
    if (allergen_ids) {
      await supabase
        .from('product_allergens')
        .delete()
        .eq('product_id', product_id);

      if (allergen_ids.length > 0) {
        const allergenRecords = allergen_ids.map((allergen_id: string) => ({
          product_id,
          allergen_id,
        }));
        await supabase.from('product_allergens').insert(allergenRecords);
      }
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/admin/products/:product_id', async (req: Request, res: Response) => {
  try {
    const { product_id } = req.params;

    // TODO: Verify auth

    const { error } = await supabase
      .from('products')
      .update({ status: 'archived' })
      .eq('id', product_id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// ==================== CATEGORIES ====================

// Get categories
router.get('/categories/:restaurant_id', async (req: Request, res: Response) => {
  try {
    const { restaurant_id } = req.params;

    const { data: categories } = await supabase
      .from('categories')
      .select('*')
      .eq('restaurant_id', restaurant_id)
      .order('display_order', { ascending: true });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Create category
router.post('/admin/categories', async (req: Request, res: Response) => {
  try {
    const { restaurant_id, name, icon, display_order } = req.body;

    // TODO: Verify auth

    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        restaurant_id,
        name,
        icon,
        display_order: display_order || 0,
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// ==================== ALLERGENS ====================

// Get all allergens
router.get('/allergens', async (req: Request, res: Response) => {
  try {
    const { data: allergens } = await supabase
      .from('allergens')
      .select('*')
      .order('name', { ascending: true });

    res.json(allergens);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch allergens' });
  }
});

// ==================== LSC VIDEOS ====================

// Get LSC videos
router.get('/lsc-videos/:restaurant_id', async (req: Request, res: Response) => {
  try {
    const { restaurant_id } = req.params;

    const { data: videos } = await supabase
      .from('lsc_videos')
      .select(`
        id,
        title,
        description,
        video_url,
        video_duration,
        category,
        product_id,
        products (
          id,
          name
        )
      `)
      .eq('restaurant_id', restaurant_id)
      .eq('status', 'active');

    res.json(videos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// Get welcome video
router.get('/lsc-videos/:restaurant_id/welcome', async (req: Request, res: Response) => {
  try {
    const { restaurant_id } = req.params;

    const { data: video } = await supabase
      .from('lsc_videos')
      .select('*')
      .eq('restaurant_id', restaurant_id)
      .eq('category', 'welcome')
      .eq('status', 'active')
      .single();

    if (!video) {
      return res.status(404).json({ error: 'Welcome video not found' });
    }

    res.json(video);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch welcome video' });
  }
});

// ==================== ORDERS ====================

// Create order
router.post('/orders', async (req: Request, res: Response) => {
  try {
    const { restaurant_id, items, notes } = req.body;

    const { data: order, error } = await supabase
      .from('orders')
      .insert({
        restaurant_id,
        items,
        notes,
        status: 'pending',
      })
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Get restaurant orders
router.get('/admin/orders/:restaurant_id', async (req: Request, res: Response) => {
  try {
    const { restaurant_id } = req.params;

    // TODO: Verify auth

    const { data: orders } = await supabase
      .from('orders')
      .select('*')
      .eq('restaurant_id', restaurant_id)
      .order('created_at', { ascending: false });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Update order status
router.patch('/admin/orders/:order_id', async (req: Request, res: Response) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;

    // TODO: Verify auth

    const { data: order, error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', order_id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update order' });
  }
});

// ==================== RESTAURANTS ====================

// Get restaurant by slug
router.get('/restaurant/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;

    const { data: restaurant } = await supabase
      .from('restaurants')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .single();

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    res.json(restaurant);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch restaurant' });
  }
});

export default router;
