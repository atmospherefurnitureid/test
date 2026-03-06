# UI/UX Typography & Spacing System (Global)

## Sumber Terpercaya

Pedoman ini disusun berdasarkan standar dari:
- **Material Design 3** (Google)
- **Apple Human Interface Guidelines** (iOS/macOS)
- **Nielsen Norman Group** (UX Research)
- **WCAG 2.1** (Web Content Accessibility Guidelines)
- **IBM Carbon Design System**
- **Atlassian Design System**

---

## Prinsip Dasar

### 1. **Ukuran Teks Minimum untuk Aksesibilitas (WCAG 2.1)**
| Platform | Minimum Size | Recommended |
|----------|--------------|-------------|
| Web Desktop | 14px (0.875rem) | 16px (1rem) |
| Web Mobile | 14px (0.875rem) | 16px (1rem) |
| iOS | 11pt | 14-17pt |
| Android | 12sp | 14-16sp |

> **Catatan:** WCAG menyarankan rasio kontras 4.5:1 untuk teks normal dan 3:1 untuk teks besar (18px+ atau 14px+ bold)

### 2. **Mobile First Approach**
- Semua ukuran dimulai dari **mobile** sebagai baseline
- Scale up untuk tablet (`sm:`) dan desktop (`lg:`)
- Touch target minimum **44x44px** untuk semua elemen interaktif

---

## Skala Tipografi Global

### **Breakpoints Tailwind CSS**
```
Mobile (base):  < 640px   → Default styles
Tablet (sm):    ≥ 640px   → sm: prefix
Desktop (lg):   ≥ 1024px  → lg: prefix
```

### **Typography Scale (Mobile First)**

| Token | Mobile | Tablet (sm:) | Desktop (lg:) | Tailwind Classes | Use Case |
|-------|--------|--------------|---------------|------------------|----------|
| **display-lg** | 36px | 45px | 57px | `text-3xl sm:text-5xl lg:text-6xl` | Hero, Landing pages |
| **display-md** | 28px | 36px | 45px | `text-2xl sm:text-4xl lg:text-5xl` | Major sections |
| **display-sm** | 24px | 28px | 36px | `text-xl sm:text-2xl lg:text-4xl` | Feature highlights |
| **h1** | 20px | 24px | 32px | `text-xl sm:text-2xl lg:text-4xl` | Page titles |
| **h2** | 18px | 20px | 28px | `text-lg sm:text-xl lg:text-3xl` | Section headers |
| **h3** | 16px | 18px | 24px | `text-base sm:text-lg lg:text-2xl` | Subsections |
| **h4** | 16px | 16px | 20px | `text-base sm:text-base lg:text-xl` | Card titles, widgets |
| **body-lg** | 16px | 16px | 18px | `text-base sm:text-base lg:text-lg` | Lead paragraphs |
| **body-md** | 14px | 14px | 16px | `text-sm sm:text-sm lg:text-base` | **DEFAULT BODY** |
| **body-sm** | 13px | 14px | 14px | `text-xs sm:text-sm` | Captions, metadata |
| **label** | 14px | 14px | 14px | `text-sm` | Form labels, UI labels |
| **button-lg** | 16px | 16px | 16px | `text-base` | Primary CTAs |
| **button-md** | 14px | 14px | 14px | `text-sm` | **DEFAULT BUTTON** |
| **button-sm** | 12px | 12px | 12px | `text-xs` | Secondary actions |
| **caption** | 12px | 12px | 13px | `text-xs` | Helper text, hints |

---

## Font Weights

| Token | Value | Tailwind | Use Case |
|-------|-------|----------|----------|
| **regular** | 400 | `font-normal` | Body text, descriptions |
| **medium** | 500 | `font-medium` | Labels, secondary text |
| **semibold** | 600 | `font-semibold` | **Headings**, buttons, emphasis |
| **bold** | 700 | `font-bold` | Strong emphasis, badges |

---

## Line Heights

| Token | Value | Tailwind | Use Case |
|-------|-------|----------|----------|
| **tight** | 1.2 | `leading-tight` | Headings, display text |
| **normal** | 1.5 | `leading-normal` | **Body text**, paragraphs |
| **relaxed** | 1.75 | `leading-relaxed` | Long-form content |

---

## Spacing System (Mobile First)

### **Padding & Margin Scale**

| Token | Mobile | Tablet (sm:) | Desktop (lg:) | Tailwind | Use Case |
|-------|--------|--------------|---------------|----------|----------|
| **xs** | 4px | 4px | 4px | `p-1` | Tight spacing |
| **sm** | 8px | 8px | 8px | `p-2` | Compact elements |
| **md** | 12px | 12px | 12px | `p-3` | Standard spacing |
| **lg** | 16px | 16px | 16px | `p-4` | Card padding |
| **xl** | 20px | 20px | 20px | `p-5` | Section spacing |
| **2xl** | 24px | 24px | 24px | `p-6` | Large sections |
| **3xl** | 32px | 32px | 32px | `p-8` | Major sections |
| **4xl** | 40px | 40px | 48px | `p-10 lg:p-12` | Page sections |

### **Gap (Flexbox/Grid)**

| Token | Mobile | Tablet (sm:) | Desktop (lg:) | Tailwind | Use Case |
|-------|--------|--------------|---------------|----------|----------|
| **xs** | 8px | 8px | 8px | `gap-2` | Button groups |
| **sm** | 12px | 12px | 12px | `gap-3` | Form elements |
| **md** | 16px | 16px | 20px | `gap-4 sm:gap-5` | Card grids |
| **lg** | 20px | 24px | 32px | `gap-5 sm:gap-6 lg:gap-8` | Section gaps |
| **xl** | 24px | 32px | 48px | `gap-6 sm:gap-8 lg:gap-12` | Major sections |

---

## Component Patterns

### **Page Header (Sticky)**
```html
<div className="sticky top-0 z-30 -mx-3 sm:-mx-4 px-3 sm:px-4 py-4 sm:py-5 bg-white/80 backdrop-blur-md border-b border-zinc-100 mb-8 sm:mb-12">
  <div className="flex items-center justify-between max-w-7xl mx-auto">
    <div className="flex items-center gap-2 sm:gap-3">
      <!-- Back button: p-2.5 sm:p-3 -->
      <!-- Title: text-xl sm:text-2xl font-semibold -->
      <!-- Subtitle: text-sm sm:text-base text-zinc-500 -->
    </div>
    <div className="flex items-center gap-2 sm:gap-3">
      <!-- Buttons: px-5 sm:px-6 py-2.5 sm:py-3 text-sm sm:text-base -->
    </div>
  </div>
</div>
```

### **Section Heading**
```html
<h3 className="text-lg sm:text-xl font-semibold text-zinc-900 tracking-tight font-poppins">
  Section Title
</h3>
```

### **Form Label (Required)**
```html
<label className="text-sm font-semibold text-zinc-700">
  Label Text <span className="text-red-500">*</span>
</label>
```

### **Form Input**
```html
<input
  className="w-full bg-transparent border-b border-zinc-300 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-all font-medium"
/>
```

### **Button Primary**
```html
<button className="flex items-center justify-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 bg-zinc-900 text-white rounded-xl text-sm sm:text-base font-semibold hover:bg-sky-600 transition-all shadow-lg min-h-[44px]">
  <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
  <span>Button Text</span>
</button>
```

### **Button Secondary**
```html
<button className="px-5 sm:px-6 py-2.5 sm:py-3 text-zinc-600 text-sm sm:text-base font-semibold border border-zinc-200 rounded-xl bg-white hover:bg-zinc-50 transition min-h-[44px]">
  Button Text
</button>
```

### **Card**
```html
<div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-4 sm:p-6">
  <h4 className="text-base sm:text-lg font-semibold text-zinc-900 mb-3 sm:mb-4">Card Title</h4>
  <p className="text-sm sm:text-base text-zinc-600">Card description...</p>
</div>
```

### **Table**
```html
<table className="w-full">
  <thead>
    <tr className="border-b border-zinc-200">
      <th className="text-xs font-semibold text-zinc-500 uppercase tracking-wide text-left py-3 px-4">Header</th>
    </tr>
  </thead>
  <tbody>
    <tr className="border-b border-zinc-100">
      <td className="text-sm text-zinc-900 py-3 px-4">Cell content</td>
    </tr>
  </tbody>
</table>
```

### **Badge/Tag**
```html
<span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-100 text-zinc-700">
  Badge Text
</span>
```

### **Alert/Notification**
```html
<div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
  <Icon className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
  <div>
    <p className="text-sm font-semibold text-amber-900">Alert Title</p>
    <p className="text-sm text-amber-700 mt-1">Alert description...</p>
  </div>
</div>
```

---

## Form-Specific Guidelines

### **Input Field Hierarchy**
```
┌─────────────────────────────────────────────────────┐
│  Label: text-sm (14px) font-semibold                │
│  Required (*): text-red-500                         │
├─────────────────────────────────────────────────────┤
│  Input: text-base (16px) ← WCAG minimum             │
│  border-b, py-3, focus:border-zinc-900              │
│  placeholder: text-sm text-zinc-400                 │
├─────────────────────────────────────────────────────┤
│  Helper: text-sm (14px) text-zinc-500               │
│  Error: text-sm (14px) text-red-500 font-medium     │
└─────────────────────────────────────────────────────┘
```

### **Textarea**
```html
<textarea
  rows={4}
  className="w-full bg-transparent border-b border-zinc-300 py-3 text-base text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-zinc-900 transition-all resize-none font-medium"
/>
```

### **Select Dropdown**
```html
<div className="relative group">
  <select className="w-full appearance-none bg-transparent border-b border-zinc-300 py-3 text-base text-zinc-900 focus:outline-none focus:border-zinc-900 transition-all pr-10 cursor-pointer font-medium">
    <option>Option 1</option>
  </select>
  <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
    <svg>...</svg>
  </div>
</div>
```

### **Radio/Checkbox Group**
```html
<label className="flex items-center gap-3 p-4 rounded-xl border-2 transition-all cursor-pointer">
  <input type="radio" className="w-4 h-4 text-zinc-900 border-zinc-300 focus:ring-zinc-900" />
  <span className="text-sm font-semibold text-zinc-700">Option Label</span>
</label>
```

---

## Layout Containers

### **Page Container**
```html
<div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
  <!-- Content -->
</div>
```

### **Two Column Layout (Form)**
```html
<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16">
  <!-- Main Content: lg:col-span-8 -->
  <!-- Sidebar: lg:col-span-4 -->
</div>
```

### **Section Spacing**
```html
<section className="space-y-8 sm:space-y-12">
  <h3 className="text-lg sm:text-xl font-semibold">Section Title</h3>
  <div className="space-y-6">
    <!-- Content -->
  </div>
</section>
```

---

## Mobile Sticky Footer (Action Bar)

```html
<div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-md border-t border-zinc-100 lg:hidden z-20">
  <div className="max-w-7xl mx-auto flex gap-3">
    <button className="flex-1 px-5 py-3 text-zinc-600 text-sm font-semibold border border-zinc-200 rounded-xl bg-white hover:bg-zinc-50 transition">
      Batal
    </button>
    <button className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-sky-600 transition-all shadow-lg">
      <Save className="h-4 w-4" /> Simpan
    </button>
  </div>
</div>
```

---

## Color Tokens (Zinc Scale)

| Token | Light | Dark | Use Case |
|-------|-------|------|----------|
| **zinc-50** | `#fafafa` | - | Backgrounds, hover states |
| **zinc-100** | `#f4f4f5` | - | Borders, subtle backgrounds |
| **zinc-200** | `#e4e4e7` | - | Dividers, inactive states |
| **zinc-300** | `#d4d4d8` | - | Input borders, placeholders |
| **zinc-400** | `#a1a1aa` | - | Muted text, icons |
| **zinc-500** | `#71717a` | - | Secondary text |
| **zinc-600** | `#52525b` | - | Tertiary text |
| **zinc-700** | `#3f3f46` | - | Labels, emphasis |
| **zinc-800** | `#27272a` | - | Headings |
| **zinc-900** | `#18181b` | - | **Primary text**, buttons |

### **Accent Colors**
| Token | Value | Use Case |
|-------|-------|----------|
| **sky-500** | `#0ea5e9` | Links, highlights |
| **sky-600** | `#0284c7` | Primary actions, hover |
| **red-500** | `#ef4444` | Errors, required indicators |
| **amber-500** | `#f59e0b` | Warnings |
| **emerald-500** | `#10b981` | Success states |

---

## Accessibility Checklist

### ✅ **Typography**
- [ ] Semua teks body menggunakan **minimum 14px** (text-sm)
- [ ] Input text menggunakan **minimum 16px** (text-base)
- [ ] Line height **1.5** untuk body text
- [ ] Rasio kontras **4.5:1** untuk teks normal
- [ ] Rasio kontras **3:1** untuk teks besar (18px+)

### ✅ **Touch Targets**
- [ ] Semua tombol **min-height 44px**
- [ ] Icon button **min 44x44px** (p-2.5 sm:p-3)
- [ ] Form inputs **py-3** untuk area klik yang cukup

### ✅ **Focus States**
- [ ] Semua input memiliki `focus:outline-none focus:border-zinc-900`
- [ ] Link dan button memiliki hover/focus states
- [ ] Skip links untuk keyboard navigation

### ✅ **Semantic HTML**
- [ ] Gunakan `<h1>` - `<h6>` secara hierarkis
- [ ] `<label>` untuk semua form inputs
- [ ] `<button>` untuk actions, `<a>` untuk navigation

---

## Quick Reference: Tailwind Classes

### **Headings**
```
H1 (Page Title)  → text-xl sm:text-2xl lg:text-4xl font-semibold
H2 (Section)     → text-lg sm:text-xl lg:text-3xl font-semibold
H3 (Subsection)  → text-base sm:text-lg lg:text-2xl font-semibold
H4 (Card Title)  → text-base sm:text-lg font-semibold
```

### **Body Text**
```
Body Large       → text-base sm:text-base lg:text-lg font-normal
Body Medium      → text-sm sm:text-sm lg:text-base font-normal ← DEFAULT
Body Small       → text-xs sm:text-sm font-normal
```

### **Labels & UI**
```
Form Label       → text-sm font-semibold
Helper Text      → text-sm text-zinc-500
Error Text       → text-sm text-red-500 font-medium
Caption          → text-xs text-zinc-400
```

### **Buttons**
```
Button Large     → text-base px-6 py-3 rounded-xl font-semibold
Button Medium    → text-sm px-5 py-2.5 rounded-xl font-semibold ← DEFAULT
Button Small     → text-xs px-3 py-1.5 rounded-lg font-medium
```

### **Spacing**
```
Page Padding     → px-3 sm:px-4 lg:px-6
Section Gap      → gap-8 sm:gap-12 lg:gap-16
Card Padding     → p-4 sm:p-6
Form Field Gap   → gap-3 (label to input)
```

---

## Referensi

1. Material Design 3 Typography: https://m3.material.io/styles/typography
2. Apple HIG Typography: https://developer.apple.com/design/human-interface-guidelines/typography
3. Nielsen Norman Group - Font Size: https://www.nngroup.com/articles/font-size-guidelines/
4. WCAG 2.1 Text Minimum: https://www.w3.org/WAI/WCAG21/Understanding/visual-presentation.html
5. IBM Carbon Typography: https://carbondesignsystem.com/guidelines/typography/introduction/
6. Atlassian Typography: https://atlassian.design/foundations/typography
7. Tailwind CSS Documentation: https://tailwindcss.com/docs

---

*Last Updated: March 5, 2026*
*Version: 2.0 - Global Mobile First System*
