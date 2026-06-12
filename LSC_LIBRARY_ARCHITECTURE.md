# VISUALSC LSC Library Architecture

## Strategic Shift: From Decentralized to Centralized

This architecture transforms the LSC video system from scattered restaurant uploads to a **centralized, curated, strategic asset** owned by VISUALSC Super Admin.

---

## Architecture Overview

```
┌──────────────────────────────────────┐
│   VISUALSC Super Admin               │
│   (Master LSC Library Owner)          │
├──────────────────────────────────────┤
│ • Upload LSC videos                  │
│ • Organize by category               │
│ • Manage translation requests        │
│ • Review usage analytics             │
│ • Set recording priorities           │
└────────────────┬─────────────────────┘
                 │
                 ↓
        ┌────────────────────┐
        │  LSC Library       │
        │  (Master Videos)   │
        │                    │
        │ • Coffee products  │
        │ • Bakery           │
        │ • Drinks           │
        │ • Ingredients      │
        │ • Allergens        │
        └────────┬───────────┘
                 │
         (Search + Suggest)
                 ↓
┌──────────────────────────────────────┐
│   Restaurant Admin Dashboard         │
├──────────────────────────────────────┤
│ When Creating Product:               │
│                                      │
│ 1. Enter product name                │
│ 2. System auto-suggests videos       │
│ 3. Admin selects from library        │
│ 4. If no match:                      │
│    "Request Translation" button      │
│                                      │
│ Videos created by users never stored │
│ in products, always linked to library│
└────────────┬─────────────────────────┘
             │
      (Link to library)
             ↓
┌──────────────────────────────────────┐
│  Product with LSC Video Link         │
│  (product_lsc_associations table)    │
└──────────────────────────────────────┘
```

---

## Database Schema

### New Tables

#### 1. lsc_library_categories
```sql
CREATE TABLE lsc_library_categories (
  id UUID PRIMARY KEY,
  name VARCHAR(100) UNIQUE,       -- "Coffee Products", "Allergens", etc.
  icon VARCHAR(10),                -- ☕, ⚠️, 🧁, etc.
  description TEXT,
  created_at TIMESTAMP
);

-- Seed data:
-- Coffee Products, Bakery, Drinks, Ingredients, Allergens
```

#### 2. lsc_library (Master Videos)
```sql
CREATE TABLE lsc_library (
  id UUID PRIMARY KEY,
  category_id UUID REFERENCES lsc_library_categories,
  title VARCHAR(255),              -- "Cappuccino Standard", "Peanut Warning"
  description TEXT,
  video_url TEXT,                  -- Supabase Storage URL
  video_duration INTEGER,
  keywords JSONB,                  -- ["cappuccino", "espresso", "coffee"]
  usage_count INTEGER DEFAULT 0,   -- Track how many products use this
  status VARCHAR(20),              -- "active", "archived"
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

#### 3. product_lsc_associations (Product → Video Links)
```sql
CREATE TABLE product_lsc_associations (
  id UUID PRIMARY KEY,
  product_id UUID REFERENCES products,
  lsc_library_id UUID REFERENCES lsc_library,
  auto_matched BOOLEAN DEFAULT false,  -- true = matched by algorithm
  created_at TIMESTAMP,
  UNIQUE(product_id, lsc_library_id)
);
```

#### 4. lsc_translation_requests (Translation Requests Queue)
```sql
CREATE TABLE lsc_translation_requests (
  id UUID PRIMARY KEY,
  restaurant_id UUID REFERENCES restaurants,
  product_name VARCHAR(255),       -- "Vegan Croissant", "Gluten-Free Bread"
  category_suggestion VARCHAR(100),-- Suggested category
  description TEXT,
  requested_date TIMESTAMP,
  status VARCHAR(20),              -- "pending", "approved", "recorded", "rejected"
  notes TEXT,
  priority INTEGER DEFAULT 0,      -- Incremented each time requested
  updated_at TIMESTAMP
);
```

---

## Workflow: Creating a Product

### Before (Old Way)
```
Restaurant Admin
  → Create Product
    → Upload LSC video to Supabase Storage
    → Link video_url to product
    → Video scattered, unused by others
    → Duplicates across restaurants
```

### After (New Way)
```
Restaurant Admin
  → Go to Products tab
    → Click "Add Product"
      → Enter Product Name: "Cappuccino"
      → System searches LSC Library
      → 🎯 Auto-suggests: "Cappuccino Standard" (used by 24 products)
      → Admin clicks to select
      → Product linked to library video
      → No data duplication
      → Video reused instantly
      
      OR
      
      → No match found
      → Button: "Request LSC Translation"
      → Request added to queue
      → Super Admin reviews demand
      → Records translation
      → Video auto-linked when published
```

---

## Components Created

### 1. SuperAdminLSCLibrary.tsx (441 lines)
**Location:** `client/pages/SuperAdminLSCLibrary.tsx`

**Three Tabs:**

#### Tab 1: Video Library
- View all LSC videos
- Upload new videos
  - Title, Category, Keywords, Video URL
  - Keywords used for auto-matching
- Track usage count per video
- Sort by popularity
- Archive videos

#### Tab 2: Translation Requests
- Pending requests from restaurants
- Product name requested
- Approval queue
- Track demand (priority counter)
- Approve/Reject with notes
- When approved, triggers recording priority

#### Tab 3: Analytics
- Total videos in library
- Total usage across all restaurants
- Pending request count
- Most popular videos
- Category breakdown

### 2. LSCLibrarySearch.tsx (172 lines)
**Location:** `client/components/admin/LSCLibrarySearch.tsx`

**Features:**
- Input: Product name
- Output: Auto-suggested videos based on keywords
- Search functionality
- Display selected video
- "Request Translation" button if no match
- Shows usage count (social proof)

**Integration:**
- Replaces old LSCLibrary upload component
- Used in ProductsManager
- Real-time search
- Zero configuration needed

---

## Auto-Matching Algorithm

### Phase 1: Keyword Matching (Implemented)
```typescript
// When creating product "Cappuccino"
const suggestions = lscVideos.filter(video =>
  video.keywords.some(kw => "cappuccino".includes(kw))
);

// Keywords like: ["cappuccino", "espresso", "coffee"]
// Matches: "Cappuccino", "Cappuccino Deluxe", "Iced Cappuccino"
```

### Phase 2: Fuzzy Matching (Future)
```typescript
// String similarity matching
// "Caputchino" → suggests "Cappuccino"
// "Expresso" → suggests "Espresso"
```

### Phase 3: AI-Assisted Matching (Future)
```typescript
// OpenAI embedding-based matching
// "Italian coffee drink with milk" → "Cappuccino"
// "Request latest translation" → AI records video
```

---

## Data Migration Plan

### Preserve Existing Relationships
```sql
-- Old: lsc_videos table (keep for backward compat)
-- New: product_lsc_associations table

-- Migration:
1. Create lsc_library entries from most-used lsc_videos
2. Link products through product_lsc_associations
3. Set auto_matched = false (manual legacy links)
4. Keep old lsc_videos table
5. Gradually phase out old table

-- Result: Zero data loss, smooth transition
```

### Implementation Steps
1. ✅ New tables created in schema
2. ✅ Super Admin dashboard built
3. ✅ LSC Library search component built
4. ⏳ Migrate existing videos to library
5. ⏳ Update product creation UI
6. ⏳ Seed with common products (Cappuccino, Espresso, etc.)
7. ⏳ Update restaurant admin to use library search

---

## Strategic Benefits

### For VISUALSC
- ✅ Centralized, curated video library
- ✅ High-quality LSC content
- ✅ Reusable across all restaurants
- ✅ Valuable platform asset
- ✅ Track demand for future recordings
- ✅ Foundation for AI matching

### For Restaurants
- ✅ Automatic LSC video suggestions
- ✅ No video uploads needed
- ✅ Better UX (just select, don't upload)
- ✅ Higher quality content
- ✅ Request translations as needed

### For Deaf Community
- ✅ Consistent, professional translations
- ✅ Higher quality than random uploads
- ✅ Faster adoption as library grows
- ✅ Validated translations (not user-generated)

---

## Future Enhancements

### Phase 2: Demand Analytics
```
Show Super Admin:
- Most requested translations
- Pending recordings
- Priority queue by demand
- Revenue impact: "These 5 videos would unlock 120 restaurants"
```

### Phase 3: AI-Assisted Matching
```
- Auto-suggest based on embedding similarity
- "Cafe con Leche" → recognizes as Coffee type
- "Request latest LSC video" → AI records & publishes
```

### Phase 4: Translation Marketplace
```
- Certified LSC translators in VISUALSC network
- Video quality scoring
- Reusable translation library
- Revenue sharing model
```

### Phase 5: Multi-Language Support
```
- Sign language variants (LSC, ASL, LSF, etc.)
- Regional dialects
- Platform grows globally
```

---

## Implementation Checklist

### Completed ✅
- [x] Database schema designed
- [x] SuperAdminLSCLibrary component (441 lines)
- [x] LSCLibrarySearch component (172 lines)
- [x] Categories table defined
- [x] Auto-matching algorithm designed

### In Progress ⏳
- [ ] Migrate existing videos to library
- [ ] Update ProductsManager to use LSCLibrarySearch
- [ ] Add Super Admin role routing
- [ ] Seed common products (Cappuccino, Espresso, etc.)
- [ ] Update LSC translation request handler

### Ready for Integration
- [ ] Approve architecture
- [ ] Create migration script
- [ ] Deploy new schema
- [ ] Populate seed data
- [ ] Test end-to-end workflow

---

## Query Examples

### Auto-suggest for "Cappuccino"
```sql
SELECT * FROM lsc_library
WHERE keywords @> '["cappuccino"]'
AND status = 'active'
LIMIT 5;
```

### Top 10 Most Used Videos
```sql
SELECT * FROM lsc_library
ORDER BY usage_count DESC
LIMIT 10;
```

### Pending Translation Requests by Demand
```sql
SELECT product_name, priority, COUNT(*) as demand
FROM lsc_translation_requests
WHERE status = 'pending'
GROUP BY product_name
ORDER BY priority DESC;
```

### Product → Video Association with Auto-Match Flag
```sql
SELECT p.name, l.title, pla.auto_matched
FROM products p
JOIN product_lsc_associations pla ON p.id = pla.product_id
JOIN lsc_library l ON pla.lsc_library_id = l.id;
```

---

## File Manifest

### New Files
- ✅ `client/pages/SuperAdminLSCLibrary.tsx` (441 lines)
- ✅ `client/components/admin/LSCLibrarySearch.tsx` (172 lines)

### Modified Files
- ⏳ `client/components/admin/ProductsManager.tsx` (integrate LSCLibrarySearch)
- ⏳ `client/pages/RestaurantAdminDashboard.tsx` (add routing for library search)
- ⏳ `database_schema.sql` (new tables)
- ⏳ `client/App.tsx` (route for Super Admin LSC Library)

### Database Migrations
- ⏳ Create lsc_library_categories table
- ⏳ Create lsc_library table
- ⏳ Create product_lsc_associations table
- ⏳ Create lsc_translation_requests table
- ⏳ Migrate existing videos

---

## Why This Matters

**The LSC Library is not just a feature—it's VISUALSC's most valuable asset.**

By centralizing LSC videos:
1. **Quality Control:** Only professional translations
2. **Reusability:** One video serves 100+ restaurants
3. **Scalability:** Library grows, serving more products
4. **Strategic Value:** Platform becomes indispensable
5. **Community Trust:** Validated content, not random uploads
6. **Future AI:** Foundation for automated matching

This transforms VISUALSC from a platform tool into a platform **with proprietary content**, which is defensible and valuable.

---

## Next Steps

1. **Approve Architecture** - Confirm this approach
2. **Migrate Data** - Move existing videos to library
3. **Update UI** - Integrate LSCLibrarySearch into ProductsManager
4. **Seed Data** - Add common products (Cappuccino, Espresso, Croissant, etc.)
5. **Test End-to-End** - Product creation with library search
6. **Deploy** - Make it live

---

**Status:** Architecture Complete  
**Next:** Data Migration + UI Integration  
**Timeline:** 1-2 days for full implementation
