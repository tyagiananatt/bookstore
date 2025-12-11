# Premium Landing Page - Apple-Style Design

## 🎨 Design Overview

A complete, modern, premium-quality landing page inspired by Apple's official design style, featuring:

- **Yellow + Black Theme** - Classy, minimal, futuristic, and premium
- **3D Interactions** - Three.js powered 3D scenes
- **Custom Cursor System** - Magnetic effects and hover interactions
- **Animated Sidebar Menu** - Glassmorphism design with smooth transitions
- **GSAP Animations** - Smooth scroll-triggered animations
- **Parallax Effects** - Depth and movement on scroll
- **Framer Motion** - Micro-interactions and transitions

## 🚀 Features

### 1. Custom Cursor
- Follows mouse movement smoothly
- Enlarges on hover over interactive elements
- Shows text/tooltips on buttons
- Magnetic button effects
- Yellow highlight effects

### 2. Sidebar Menu
- Opens on hover near left edge
- Glassmorphism design with yellow accents
- Smooth sliding animations
- Individual link animations
- User profile section

### 3. Hero Section
- Fullscreen design
- 3D rotating cube/sphere using Three.js
- Animated gradient text
- Magnetic CTA buttons
- Parallax background effects

### 4. Features Section
- 4 feature cards with icons
- Floating animations
- Hover effects with yellow glow
- Scroll-triggered reveals

### 5. Products/Gallery Section
- 3D tilt effects on cards
- Hover reveals with overlays
- Staggered grid animations
- Image parallax

### 6. Testimonials Section
- Clean minimal design
- Star ratings
- Smooth slide-in animations
- Yellow accent highlights

### 7. Pricing Section
- 3 pricing tiers
- Hover scaling effects
- Neon yellow edges
- Popular badge highlight

### 8. CTA Section
- Full-width black background
- Bright yellow text
- Glowing buttons
- Magnetic hover effects

### 9. Footer
- Apple-style minimal design
- Social links with hover effects
- Yellow accent animations

## 📁 File Structure

```
client/src/
├── components/
│   ├── CustomCursor.js          # Custom cursor component
│   ├── CustomCursor.css
│   ├── SidebarMenu.js           # Animated sidebar
│   ├── SidebarMenu.css
│   └── ThreeScene.js            # Three.js 3D scene
├── pages/
│   ├── PremiumLanding.js        # Main landing page
│   └── PremiumLanding.css       # Landing page styles
└── index.css                    # Global styles with Tailwind
```

## 🎯 How to Access

1. **Start the application:**
   ```bash
   npm run dev
   ```

2. **Navigate to the landing page:**
   - URL: http://localhost:3000/landing
   - Or add a link from your main app

## 🎨 Design Elements

### Colors
- **Primary Black:** #000000
- **Yellow Accent:** #facc15, #eab308
- **Text:** #ffffff with opacity variations
- **Glassmorphism:** rgba(255, 255, 255, 0.05) with blur

### Typography
- **Font:** Inter (system font fallback)
- **Headings:** 900 weight, large sizes
- **Body:** 400-600 weight, readable sizes

### Animations
- **GSAP:** Scroll-triggered animations
- **Framer Motion:** Component animations
- **CSS:** Keyframe animations for floating, gradients
- **Three.js:** 3D object rotations

## 🔧 Customization

### Change 3D Shape
In `PremiumLanding.js`, change the `shape` prop:
```jsx
<ThreeScene shape="cube" />  // or "sphere"
```

### Modify Colors
Update the yellow color in:
- `tailwind.config.js` - Yellow color palette
- `PremiumLanding.css` - All #facc15 references
- Component CSS files

### Adjust Animations
- **GSAP:** Modify in `useEffect` hooks
- **Framer Motion:** Adjust `transition` props
- **CSS:** Edit `@keyframes` in CSS files

## 📱 Responsive Design

- **Desktop:** Full 3D effects, custom cursor, sidebar menu
- **Tablet:** Simplified animations, touch-friendly
- **Mobile:** Standard cursor, simplified menu, optimized layouts

## 🎭 Interactive Elements

### Magnetic Buttons
Add `cursor-magnetic` class to any button:
```jsx
<button className="cursor-magnetic" data-cursor-text="Click Me">
  Button
</button>
```

### Custom Cursor Text
Add `data-cursor-text` attribute:
```jsx
<a href="#" data-cursor-text="Navigate">Link</a>
```

## 🚀 Performance

- **Lazy Loading:** Images load on scroll
- **Optimized Animations:** GPU-accelerated transforms
- **Three.js:** Efficient 3D rendering
- **Code Splitting:** Components load as needed

## 📝 Notes

- Custom cursor is disabled on mobile devices
- Three.js scene adapts to container size
- All animations respect `prefers-reduced-motion`
- Uses free images from Unsplash

## 🎉 Enjoy!

The premium landing page is ready to use. Navigate to `/landing` to see the full experience!

