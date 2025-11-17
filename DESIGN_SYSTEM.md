# Tikkit Design System

> A colorful, modern design system for Tikkit - A tiny ticket system for solo entrepreneurs

## 🎨 Brand Colors

### Primary Gradient
The main brand gradient used throughout the application:
```
from-purple-600 via-pink-600 to-orange-600
```

### Color Palette

#### Purple Shades
- **Purple 50**: `from-purple-50` / `to-purple-50`
- **Purple 100**: `from-purple-100` / `to-purple-100`
- **Purple 200**: `border-purple-200` (borders)
- **Purple 300**: `bg-purple-300` (decorative blobs - light mode)
- **Purple 400**: `from-purple-400` / `to-purple-400`
- **Purple 500**: `from-purple-500` (main gradients)
- **Purple 600**: `from-purple-600` (brand text)
- **Purple 700**: `from-purple-700` (hover states)
- **Purple 800**: `dark:border-purple-800` (dark mode borders)
- **Purple 900**: `dark:bg-purple-900` (dark mode blobs)
- **Purple 950**: `dark:from-purple-950` (dark mode backgrounds)

#### Pink Shades
- **Pink 50**: `via-pink-50`
- **Pink 100**: `via-pink-100`
- **Pink 200**: `border-pink-200`
- **Pink 300**: `bg-pink-300` (decorative blobs - light mode)
- **Pink 400**: `to-pink-400`
- **Pink 500**: `via-pink-500` (main gradients)
- **Pink 600**: `via-pink-600` (brand text)
- **Pink 700**: `to-pink-700` (hover states)
- **Pink 800**: `dark:border-pink-800`
- **Pink 900**: `dark:bg-pink-900`
- **Pink 950**: `dark:via-pink-950`

#### Orange/Yellow Shades
- **Orange 50**: `to-orange-50`
- **Orange 100**: `to-orange-100`
- **Orange 200**: `border-orange-200`
- **Orange 400**: `from-orange-400`
- **Orange 500**: `to-orange-500`
- **Orange 600**: `to-orange-600` (brand text)
- **Orange 800**: `dark:border-orange-800`
- **Orange 950**: `dark:to-orange-950`
- **Yellow 300**: `bg-yellow-300`
- **Yellow 400**: `to-yellow-400`
- **Yellow 500**: `to-yellow-500`
- **Yellow 600**: `to-yellow-600`
- **Yellow 900**: `dark:bg-yellow-900`
- **Yellow 950**: `dark:to-yellow-950`

#### Blue/Cyan Shades (Secondary)
- **Blue 50**: `from-blue-50`
- **Blue 200**: `border-blue-200`
- **Blue 400**: `from-blue-400`
- **Blue 600**: `from-blue-600`
- **Blue 800**: `dark:border-blue-800`
- **Blue 950**: `dark:from-blue-950`
- **Cyan 50**: `to-cyan-50`
- **Cyan 500**: `to-cyan-500`
- **Cyan 600**: `to-cyan-600`
- **Cyan 950**: `dark:to-cyan-950`

#### Green/Emerald Shades (Secondary)
- **Green 50**: `from-green-50`
- **Green 200**: `border-green-200`
- **Green 400**: `from-green-400`
- **Green 600**: `from-green-600`
- **Green 800**: `dark:border-green-800`
- **Green 950**: `dark:from-green-950`
- **Emerald 50**: `to-emerald-50`
- **Emerald 500**: `to-emerald-500`
- **Emerald 600**: `to-emerald-600`
- **Emerald 950**: `dark:to-emerald-950`

## 🎭 Gradient Patterns

### Primary Brand Gradient (Text)
```css
bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent
```
**Usage**: Main headings, brand name, important text

### Primary Brand Gradient (Background)
```css
bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500
```
**Usage**: Logo icons, primary buttons

### Button Gradient (Hover)
```css
bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700
```
**Usage**: Primary action buttons

### Feature Card Gradients

#### Lightning Fast (Yellow/Orange)
```css
/* Icon */
bg-gradient-to-br from-yellow-400 to-orange-500

/* Background */
bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950
```

#### Built for Solo (Purple/Pink)
```css
/* Icon */
bg-gradient-to-br from-purple-400 to-pink-500

/* Background */
bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950
```

#### Stay Organized (Blue/Cyan)
```css
/* Icon */
bg-gradient-to-br from-blue-400 to-cyan-500

/* Background */
bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950
```

#### Privacy First (Green/Emerald)
```css
/* Icon */
bg-gradient-to-br from-green-400 to-emerald-500

/* Background */
bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950
```

### Background Gradients

#### Hero/Section Background
```css
bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 
dark:from-purple-950 dark:via-pink-950 dark:to-orange-950
```

#### Sidebar Gradient
```css
bg-gradient-to-b from-purple-50/50 via-pink-50/30 to-background 
dark:from-purple-950/30 dark:via-pink-950/20 dark:to-background
```

## 🎨 Shadow Effects

### Primary Shadow (Purple Glow)
```css
shadow-lg shadow-purple-500/50 dark:shadow-purple-500/30
```
**Usage**: Buttons, logo icons, featured elements

## 🔲 Borders

### Primary Borders
```css
border-2 border-purple-200 dark:border-purple-800
```
**Usage**: Cards, sidebars, important sections

### Feature-Specific Borders
- **Purple theme**: `border-purple-200 dark:border-purple-800`
- **Blue theme**: `border-blue-200 dark:border-blue-800`
- **Orange theme**: `border-orange-200 dark:border-orange-800`
- **Green theme**: `border-green-200 dark:border-green-800`

## 🎯 Technical Background Pattern

### Dot Grid Pattern
```jsx
<div style={{
  backgroundImage: 'radial-gradient(circle, rgba(147, 51, 234, 0.03) 1px, transparent 1px)',
  backgroundSize: '24px 24px'
}}></div>
```
**Usage**: Hero section background, protected area background
**Opacity**: Very subtle (0.03) for professional look

## ✨ Animations

### Blob Animation (Floating Background Elements)
```css
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}
```

### Float Animation (Logo/Icons)
```css
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
}
```

### Animation Delays
```css
.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}
```

## 🔮 Decorative Blobs

### Background Blob Pattern
```jsx
<div className="absolute top-0 left-1/4 w-72 h-72 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob"></div>
<div className="absolute top-0 right-1/4 w-72 h-72 bg-yellow-300 dark:bg-yellow-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
<div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-pink-300 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
```

### Smaller Decorative Blobs (For Cards)
```jsx
<div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full filter blur-3xl opacity-20"></div>
<div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-full filter blur-3xl opacity-20"></div>
```

## 🖼️ Component Patterns

### Logo Icon Pattern
```jsx
<div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 shadow-lg shadow-purple-500/50 dark:shadow-purple-500/30 mb-4 animate-float">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-12 h-12"
  >
    {/* Ticket/Document Icon */}
  </svg>
</div>
```

### Highlighted Pill Badge
```jsx
<div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100 dark:from-purple-950 dark:via-pink-950 dark:to-orange-950 border-2 border-purple-200 dark:border-purple-800">
  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent">
    Simple. Fast. Yours.
  </span>
</div>
```

### Primary Button Pattern
```jsx
<Button asChild size="lg" className="text-base px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/50 dark:shadow-purple-500/30 group">
  <Link href="/auth/sign-up" className="flex items-center gap-2">
    <Icon className="w-5 h-5" />
    Get Started Free
    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
  </Link>
</Button>
```

### Outline Button Pattern
```jsx
<Button asChild size="lg" variant="outline" className="text-base px-8 py-6 border-2 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950/50">
  <Link href="/auth/login" className="flex items-center gap-2">
    <Icon className="w-5 h-5" />
    Sign In
  </Link>
</Button>
```

### Feature Card Pattern
```jsx
<Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
  <CardHeader>
    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-pink-500 shadow-lg flex items-center justify-center text-white mb-4 transition-transform hover:scale-110 hover:rotate-3">
      <Icon className="w-6 h-6" />
    </div>
    <CardTitle className="text-lg">Feature Title</CardTitle>
  </CardHeader>
  <CardContent>
    <CardDescription className="text-base">Feature description</CardDescription>
  </CardContent>
</Card>
```

### Sidebar Navigation Active State
```css
bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950 dark:to-pink-950 
text-purple-700 dark:text-purple-300 
shadow-sm border border-purple-200 dark:border-purple-800
```

### Sidebar Navigation Hover State
```css
text-muted-foreground 
hover:bg-purple-50 dark:hover:bg-purple-950/50 
hover:text-purple-600 dark:hover:text-purple-400
```

## 📝 Typography Gradients

### Heading Gradient (Large)
```css
text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight 
bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent
```

### Heading Gradient (Medium)
```css
text-3xl md:text-4xl font-bold 
bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 bg-clip-text text-transparent
```

### Inline Gradient Text
```css
bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent
```

## 🎪 Brand Voice & Design Principles

### Brand Tagline
**"Simple. Fast. Yours."**

### Target Audience
Solo entrepreneurs who need simple, focused ticket management

### Design Principles
1. **Colorful but Professional**: Use vibrant gradients but keep opacity low for subtlety
2. **Playful with Purpose**: Animations and colors add personality without overwhelming
3. **Focus on Clarity**: Despite colors, maintain high readability and clear hierarchy
4. **Consistent Gradients**: Use purple → pink → orange as primary brand gradient
5. **Dark Mode Support**: Always provide dark mode alternatives with proper contrast

### Key Design Elements
- **Dot grid backgrounds**: Add technical feel without distraction
- **Animated blobs**: Create depth and movement
- **Gradient icons**: Make features pop
- **Gradient text**: Emphasize important headings
- **Purple theme borders**: Create visual consistency
- **Hover interactions**: Scale, translate, color changes for engagement

## 🚀 Usage Guidelines

### When to Use Primary Gradient
- Brand name "Tikkit"
- Main page headings (H1)
- Primary CTA buttons
- Logo icons
- Important statistics/numbers

### When to Use Secondary Gradients
- Feature cards (use themed gradients)
- Category indicators
- Stats cards
- Icon backgrounds

### When to Use Borders
- Always use purple-themed borders for consistency
- Use border-2 for emphasis
- Use themed borders (blue, green, orange) only for specific feature categories

### Opacity Guidelines
- **Background patterns**: Very low (0.03)
- **Decorative blobs**: 20% opacity
- **Gradient backgrounds**: 50% opacity or less
- **Shadows**: 30-50% opacity

## 📦 Component Library

### Icon Sizes
- **Large (Hero)**: w-12 h-12
- **Medium (Cards)**: w-6 h-6
- **Small (Buttons)**: w-4 h-4 or w-5 h-5

### Border Radius
- **Large (Cards, Sections)**: rounded-2xl
- **Medium (Buttons, Icons)**: rounded-lg or rounded-xl
- **Small (Badges)**: rounded-full

### Spacing
- **Section gaps**: gap-12 or gap-20
- **Card gaps**: gap-6
- **Content gaps**: gap-4 or gap-3

### Padding
- **Sections**: p-8 or p-12
- **Cards**: p-6
- **Buttons**: px-8 py-6
- **Small elements**: px-3 py-2

## 🔄 Transition Effects

### Standard Transitions
```css
transition-colors    /* For color changes */
transition-all       /* For multiple properties */
transition-transform /* For movements */
```

### Hover Effects
- **Cards**: `hover:shadow-xl hover:-translate-y-1`
- **Icons**: `hover:scale-110 hover:rotate-3`
- **Arrows**: `group-hover:translate-x-1`
- **Backgrounds**: `hover:bg-purple-50`

## 🎨 Prompts for AI/Design Tools

### Landing Page Prompt
"Create a colorful, modern landing page for Tikkit - a tiny ticket system for solo entrepreneurs. Use vibrant purple, pink, and orange gradients for the brand. Include a dot grid technical background with very low opacity, animated blob decorations, and feature cards with different color themes (purple/pink, yellow/orange, blue/cyan, green/emerald). Add floating animations, gradient icons, and maintain a professional yet playful aesthetic. Support dark mode throughout."

### Protected Area Prompt
"Design a protected dashboard area matching the landing page color scheme. Use purple-themed gradients in the sidebar, gradient logo, colorful stat cards with icons (purple/pink for active, blue/cyan for completed, orange/yellow for total), and maintain the dot grid background. Add welcome banner with gradient and decorative blobs. Keep navigation clean with gradient active states and purple hover effects."

### Component Styling Prompt
"Style components with purple → pink → orange gradient as primary brand color. Use gradient backgrounds at 50% opacity or less, border-2 with purple-200/purple-800 for light/dark modes, shadow-lg with purple glow for emphasis. Add hover effects: scale for icons, translate-y for cards, translate-x for arrows. Maintain high contrast text for readability."

---

**Last Updated**: November 17, 2025
**Version**: 1.0.0
**Maintained by**: Tikkit Team

