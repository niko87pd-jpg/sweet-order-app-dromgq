
# 🚀 Quick Customization Guide

## 📁 Key Files to Customize

### 1. **config/appConfig.ts** - Main Configuration
All app settings in one place:
- Pastry shop name and info
- Prices and calculations
- Colors and theme
- All UI texts
- Payment settings

### 2. **data/products.ts** - Products List
Add, remove, or modify your products here.

---

## ⚡ Quick Changes

### Change Shop Name
**File:** `config/appConfig.ts`
```typescript
PASTRY_INFO.name = 'Your Pastry Shop Name'
```

### Change Colors
**File:** `config/appConfig.ts`
```typescript
THEME_COLORS = {
  primary: '#E91E63',    // Main color
  secondary: '#9C27B0',  // Secondary color
  // ... other colors
}
```

### Change Prices
**File:** `config/appConfig.ts`
```typescript
CAKE_PRICING = {
  basePrice: 25,              // Base cake price
  pricePerHundredGrams: 3.5,  // Price per 100g
  gramsPerPerson: 140,        // Grams per person
}
```

### Change Deposit Percentage
**File:** `config/appConfig.ts`
```typescript
PAYMENT_CONFIG.depositPercentage = 0.5  // 50%
```

### Add Your Photos

**Option 1: Use Imgur (Recommended)**
1. Upload to [Imgur.com](https://imgur.com)
2. Copy image URL
3. Use in `imageUrl` field

**Option 2: Use Unsplash**
1. Find image on [Unsplash.com](https://unsplash.com)
2. Copy URL and add `?w=400`
3. Example: `https://images.unsplash.com/photo-123?w=400`

### Add New Product
**File:** `data/products.ts`
```typescript
{
  id: '7',  // Increment number
  name: 'Product Name',
  description: 'Product description',
  price: 10.0,
  imageUrl: 'https://your-image-url.jpg',
}
```

---

## 🎨 Color Palette Examples

### Current (Pink/Purple)
```typescript
primary: '#E91E63'
secondary: '#9C27B0'
```

### Blue Theme
```typescript
primary: '#2196F3'
secondary: '#03A9F4'
```

### Green Theme
```typescript
primary: '#4CAF50'
secondary: '#8BC34A'
```

---

## ✅ Customization Checklist

- [ ] Shop name and info
- [ ] Contact details
- [ ] Product names and prices
- [ ] Product photos
- [ ] Theme colors
- [ ] Cake pricing
- [ ] Deposit percentage
- [ ] UI texts

---

## 🐛 Troubleshooting

**Images not loading?**
- Check URL starts with `https://`
- Test URL in browser
- Use JPG or PNG format

**Colors not changing?**
- Edit `config/appConfig.ts`
- Restart app completely
- Use HEX format (#RRGGBB)

**Prices not updating?**
- Edit `CAKE_PRICING` in config
- Use numbers without quotes
- Use dot for decimals (3.5 not 3,5)

---

## 📱 Testing

After customization:
1. Test all features
2. Check all images load
3. Verify price calculations
4. Test on iOS and Android
5. Check color contrast

---

For detailed instructions, see **GUIDA_PERSONALIZZAZIONE.md** (Italian)
