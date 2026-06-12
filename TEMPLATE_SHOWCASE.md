# VISUALSC Menu Templates - Showcase & Architecture

## Quick Links
- **Modern Coffee Shop:** `client/components/templates/ModernCoffeeShop.tsx`
- **Gourmet Restaurant:** `client/components/templates/GourmetRestaurant.tsx`
- **Fast Casual:** `client/components/templates/FastCasual.tsx`
- **Accessibility First:** `client/components/templates/AccessibilityFirst.tsx`

---

## Template 1: Modern Coffee Shop ☕

### Live Path
`/menu-settings` → Select "Modern Coffee Shop" → View Preview

### Design Inspiration
- Starbucks app aesthetic
- Specialty coffee culture
- Horizontal scrolling categories
- Modern, clean UI

### Key Visual Elements
- **Color Palette:** Green accents (#10b981, #059669), white backgrounds
- **Typography:** Clean sans-serif (Inter)
- **Spacing:** Generous padding, clear hierarchy
- **Icons:** Category emojis, heart icon for favorites

### Component Architecture

```typescript
ModernCoffeeShop
├── Header (sticky)
│   ├── Restaurant name
│   ├── Subtitle
│   └── Shopping cart icon
├── Category Navigation (horizontal scroll)
│   └── Category buttons with emoji + name
├── Section Header
│   ├── Category name
│   └── Item count
└── Product Grid (3 columns, responsive)
    └── ProductCard
        ├── Image (with hover zoom)
        ├── Name
        ├── Description (2-line truncate)
        ├── Allergen badges (red)
        ├── Price (primary color)
        └── Action buttons
            ├── Favorite toggle
            └── Add to cart

LSC Mode:
├── Full-width header (gradient)
├── Welcome video (prominent)
├── Large category buttons (grid)
└── Product list (full-width cards)
    ├── Image
    ├── Name + Description
    ├── LSC video
    ├── Price (large)
    └── Add button (full-width)
```

### Key Features
- ✅ Smooth category switching
- ✅ Favorite/heart toggle with persistence
- ✅ Image hover effects
- ✅ Allergen visual warnings
- ✅ LSC video integration
- ✅ Mobile responsive (1 column phone, 3 desktop)
- ✅ QR code compatible

### UX Flow
1. User arrives at public menu
2. Sees hero section with coffee shop branding
3. Scrolls categories horizontally
4. Clicks category to filter products
5. Hovers over products to see details
6. Clicks heart to favorite
7. Adds to cart
8. Optionally switches to LSC mode
9. Watches video descriptions

---

## Template 2: Gourmet Restaurant 🍽️

### Live Path
`/menu-settings` → Select "Gourmet Restaurant" → View Preview

### Design Inspiration
- Premium fine dining restaurants
- Luxury hospitality brands
- Elegant, sophisticated aesthetic
- Altern ating content layout

### Key Visual Elements
- **Color Palette:** Slate-900 background, amber-600 accents (#b45309, #d97706)
- **Typography:** Serif fonts (Playfair Display) for elegance, sans-serif for body
- **Spacing:** Spacious, breathing room
- **Styling:** Borders, refined shadows, premium feel

### Component Architecture

```typescript
GourmetRestaurant
├── Header (dark elegant, sticky)
│   ├── Restaurant name (serif, bold)
│   ├── Subtitle
│   ├── Star icon
│   └── Category buttons (vertical list)
│       └── Amber border on selection
├── Section Title (centered, serif)
│   └── Subtitle ("Discover our exquisite selection")
└── Product List (alternating layout)
    └── Product Item (left/right alternate)
        ├── Image (left/right)
        ├── Content (right/left)
        │   ├── Name (serif, large)
        │   ├── Description (prose)
        │   ├── Allergens (styled badges)
        │   └── Price + Reserve button
        └── Borders and dividers

LSC Mode:
├── Dark elegant header
│   ├── Chef icon
│   ├── Restaurant name
│   └── "Experiencia Gourmet en LSC"
├── Welcome video
├── Category buttons (large, dark)
└── Product sections (full-width)
    ├── Image
    ├── Name + Description
    ├── Price (amber, large)
    ├── LSC video
    └── Reserve button (amber, full-width)
```

### Key Features
- ✅ Alternating left-right product layout
- ✅ Premium typography (serif + sans-serif mix)
- ✅ Dark theme (sophisticated, elegant)
- ✅ Refined borders and spacing
- ✅ "Reserve" instead of "Add" (fine dining UX)
- ✅ LSC video for each dish
- ✅ Allergen information prominent
- ✅ Mobile responsive

### UX Flow
1. User views elegant dark menu
2. Sees fine dining aesthetic
3. Reads premium descriptions
4. Altern ates viewing images left/right
5. Checks allergen information (red badges)
6. Reserves dishes
7. Optionally views LSC explanations
8. Appreciates premium presentation

---

## Template 3: Fast Casual ⚡

### Live Path
`/menu-settings` → Select "Fast Casual" → View Preview

### Design Inspiration
- Mobile-first QSR apps
- Speed and efficiency
- Quick decision-making
- Compact layouts

### Key Visual Elements
- **Color Palette:** Orange accents (#f97316, #ea580c), white + orange
- **Typography:** Bold, legible sans-serif
- **Spacing:** Compact but readable
- **Icons:** Quick actions, counter controls

### Component Architecture

```typescript
FastCasual
├── Header (sticky, compact)
│   ├── Restaurant name + Zap icon
│   ├── Subtitle
│   ├── Shopping cart icon
│   └── Quick category buttons (scrollable)
│       ├── "All" button
│       └── Category buttons (orange when selected)
└── Product Grid (2 columns mobile, 4 desktop)
    └── ProductCard
        ├── Square image
        ├── Name (2-line truncate)
        ├── Short description (1-line)
        ├── Allergens (small badges, max 2)
        ├── Price (large, orange)
        ├── Quantity counter
        │   ├── Minus button
        │   ├── Count display
        │   └── Plus button
        └── Quick Add button

LSC Mode:
├── Orange gradient header
│   ├── Zap icon
│   ├── Restaurant name
│   └── "¡Ordena Rápido!"
├── Welcome video
├── Large category grid (3 columns)
│   └── Big buttons with emoji
├── Product cards (quick)
│   ├── Small image
│   ├── Name + Price
│   ├── LSC video
│   └── Order Now button
└── Fast navigation throughout
```

### Key Features
- ✅ Quantity selector built-in (-, count, +)
- ✅ Compact card design
- ✅ Quick filtering
- ✅ Mobile-first approach
- ✅ Allergen badges (truncated)
- ✅ Speed-optimized UX
- ✅ Fast Casual branding (orange, energetic)
- ✅ LSC mode maintains speed

### UX Flow
1. Mobile user scans QR code
2. Sees fast-casual branding
3. Quickly scrolls categories (single swipe)
4. Sees compact product grid
5. Can adjust quantity immediately
6. Adds multiple items quickly
7. Checks out with minimal steps
8. Optionally views LSC videos during wait

---

## Template 4: Accessibility First 🔵

### Live Path
`/menu-settings` → Select "Accessibility First" → View Preview

### Design Inspiration
- WCAG AAA compliance
- Deaf-first design philosophy
- Large touch targets (iOS minimum 44px, targeting 72px+)
- High contrast (7:1 ratio minimum)
- LSC video prominence

### Key Visual Elements
- **Color Palette:** Primary blue (#1f3f70), secondary gold (#f0b233), white/red warnings
- **Typography:** Extra large (4xl+), sans-serif (Inter)
- **Spacing:** 4px minimum borders, generous padding
- **Icons:** Large emojis, clear visual indicators

### Component Architecture

```typescript
AccessibilityFirst
├── Header (high contrast, blue/white)
│   ├── Restaurant name (4xl, serif, bold)
│   ├── Subtitle (2xl)
│   ├── "Menú en Lengua de Señas Colombiana"
│   └── Welcome video (full-width, prominent)
├── Category Navigation (high visibility)
│   ├── "CATEGORÍAS" label
│   └── Category Grid (2-4 columns)
│       └── CategoryButton
│           ├── Large emoji (5xl)
│           ├── Category name (xl, bold)
│           ├── 4px border
│           ├── 72px+ touch target
│           └── Focus ring on keyboard nav
├── Section Header
│   ├── Category name (3xl, serif)
│   └── Item count (lg)
└── Product List (full-width, expandable)
    └── ProductItem
        ├── Header Button (full-width, clickable)
        │   ├── Name (2xl, bold)
        │   ├── Description (lg)
        │   ├── ChevronRight (expand indicator)
        │   └── 60px+ minimum height
        └── Expandable Content (on click)
            ├── Image (large, bordered)
            ├── Price Card
            │   ├── "PRECIO" label (bold)
            │   └── Price (5xl, secondary color)
            ├── LSC Video (prominent, 4px border)
            ├── Allergen Warnings (if present)
            │   ├── Red background (high contrast)
            │   ├── Large text (xl)
            │   ├── Bold red allergen badges
            │   └── Clear icon representation
            └── Add Button
                ├── Full-width (3xl text)
                ├── Shopping cart icon
                ├── "Añadir al carrito"
                ├── 60px+ height
                └── Focus ring on keyboard nav
├── Keyboard Navigation Support
│   ├── TAB moves through categories/products
│   ├── Enter/Space expands products
│   └── Focus indicators (4px ring)
└── Footer
    └── "Accessible navigation support" message
```

### Accessibility Features
- ✅ **WCAG AAA Contrast:** 7:1+ on all text
- ✅ **Large Touch Targets:** Minimum 72px for buttons
- ✅ **Keyboard Navigation:** Full TAB support
- ✅ **Focus Management:** Visible focus rings (4px)
- ✅ **Semantic HTML:** Proper heading hierarchy
- ✅ **ARIA Labels:** aria-pressed on toggles
- ✅ **Color Not Only:** All information conveyed in multiple ways
- ✅ **Large Typography:** Starting at 2xl, goes to 5xl for prices
- ✅ **No Time Limits:** Infinite time to interact
- ✅ **LSC Video Prominence:** First/primary interaction

### Key Features
- ✅ Expandable product cards (large header always visible)
- ✅ Video-first design (LSC videos prominent)
- ✅ Allergen warnings (red, large, unavoidable)
- ✅ High contrast throughout
- ✅ Responsive to all screen sizes
- ✅ Voice control compatible
- ✅ Screen reader friendly
- ✅ Deaf-first UX (LSC prioritized)

### UX Flow
1. Deaf customer arrives at menu
2. Sees large restaurant name in blue
3. Immediately sees welcome video explaining menu
4. Taps large category buttons (easy to hit)
5. Sees expandable product cards
6. Clicks/taps card header
7. Expands to see full details
8. Watches LSC video for product explanation
9. Sees large, clear price
10. Checks allergen warnings (if any)
11. Taps large "Add to cart" button
12. Repeats for other items

---

## Template Comparison Table

| Aspect | Coffee Shop | Gourmet | Fast Casual | Accessibility |
|--------|-------------|---------|-------------|---------------|
| **Primary Layout** | Grid | Alternating | Compact Grid | Expandable |
| **Color Scheme** | Green | Amber/Slate | Orange | Blue/Gold |
| **Primary User** | Beverage | Diner | Quick Order | Deaf-First |
| **Mobile Columns** | 1 | 1 | 2 | 1 (expandable) |
| **Desktop Columns** | 3 | 2 side-by-side | 4 | 1 (expandable) |
| **Button Size** | Standard | Large | Compact | 72px+ |
| **Typography** | Modern | Elegant | Bold | Extra Large |
| **Favorite Feature** | Heart toggle | N/A | Qty counter | Expandable |
| **LSC Integration** | Full | Full | Fast | PRIMARY |
| **Best For** | Coffee/Cafe | Fine Dining | QSR | Accessibility |

---

## How to Test Templates

### 1. Via Menu Settings Page
```
1. Login to admin dashboard
2. Navigate to /menu-settings
3. Select template from left panel
4. View real-time preview on right
5. Toggle "Sync Traditional & LSC Menus"
6. Click Save Settings
```

### 2. Via QR Code
```
1. Generate QR pointing to /:restaurant-slug
2. Scan on phone
3. Customer sees template live
4. Toggle to LSC mode (depends on implementation)
5. Test all interactions
```

### 3. Direct Routes
```
Traditional Menu:
/lsc-coffee-club?mode=traditional

LSC Menu:
/lsc-coffee-club?mode=lsc
```

---

## Database Integration

### Template Selection
```sql
SELECT template_type FROM restaurants WHERE id = $1;
-- Returns: 'modern-coffee' | 'gourmet' | 'fast-casual' | 'accessibility-first'
```

### Menu Sync Status
```sql
SELECT menu_sync_enabled FROM restaurants WHERE id = $1;
-- Returns: true | false

-- When true, updates to products sync automatically:
UPDATE products SET price = $2 WHERE id = $1;
-- Both traditional and LSC menus reflect change immediately
```

### Product Fields Used by All Templates
```sql
-- Required fields
id, name, description, price, image_url, category_id

-- Enhanced fields
allergens (via join), ingredients, status

-- Template-specific uses
LSC video (separate lsc_videos table)
```

---

## File Structure

```
client/
├── components/
│   └── templates/
│       ├── ModernCoffeeShop.tsx          (258 lines)
│       ├── GourmetRestaurant.tsx         (243 lines)
│       ├── FastCasual.tsx                (261 lines)
│       ├── AccessibilityFirst.tsx        (214 lines)
│       └── index.ts                      (30 lines)
├── pages/
│   ├── MenuSettings.tsx                  (250 lines)
│   ├── Login.tsx                         (180 lines)
│   ├── Register.tsx                      (Modified)
│   ├── ForgotPassword.tsx               (114 lines)
│   └── ResetPassword.tsx                 (162 lines)
├── lib/
│   └── supabase.ts                       (11 lines)
└── App.tsx                               (Modified)
```

---

## Performance Notes

### Image Optimization
- All templates use `object-cover` for consistent aspect ratios
- Images lazy-load via browser default
- Consider CDN/Vercel image optimization for production

### Component Size
- Each template: 214-261 lines
- Minimal dependencies (Lucide icons only)
- No external CSS libraries (Tailwind only)

### Accessibility First Template Specifics
- Expandable design reduces initial DOM nodes
- Only expanded products render content
- Keyboard navigation pre-implemented
- Focus management ready for screen readers

---

## Next Steps for Enhancement

### Post-MVP Improvements
1. **Template Customization:** Custom colors, fonts per restaurant
2. **Template Builder:** Drag-and-drop interface
3. **Template Marketplace:** Share templates between restaurants
4. **Analytics:** Track which template drives more orders
5. **A/B Testing:** Test template performance
6. **Mobile Apps:** Native iOS/Android versions
7. **Voice Control:** Integration with voice assistants
8. **Translation:** Multi-language support

---

Generated: 2024
Project: VISUALSC Pilot MVP
Status: All 4 Templates Fully Functional
