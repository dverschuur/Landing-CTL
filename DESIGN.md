---
name: Crimson Edge
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#5c403c'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#906f6b'
  outline-variant: '#e5bdb8'
  surface-tint: '#bc1515'
  primary: '#930007'
  on-primary: '#ffffff'
  primary-container: '#bc1515'
  on-primary-container: '#ffcdc6'
  inverse-primary: '#ffb4aa'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e2e2e2'
  on-secondary-container: '#646464'
  tertiary: '#464748'
  on-tertiary: '#ffffff'
  tertiary-container: '#5d5f5f'
  on-tertiary-container: '#d9d9d9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4aa'
  on-primary-fixed: '#410001'
  on-primary-fixed-variant: '#930007'
  secondary-fixed: '#e2e2e2'
  secondary-fixed-dim: '#c6c6c6'
  on-secondary-fixed: '#1b1b1b'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
typography:
  headline-lg:
    fontFamily: Nova Square
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
  headline-md:
    fontFamily: Nova Square
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Poppins
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Poppins
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.5px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 48px
---

# Crimson Edge Design System

## Brand & Style
Crimson Edge is a high-impact, modern brand identity that blends technical precision with aggressive, high-contrast aesthetics. It is designed for platforms that require an authoritative and energetic presence. The style is a hybrid of **Modern Brutalism** and **High-Contrast Bold**. It utilizes sharp geometric forms, a stark monochromatic base punctuated by a vibrant primary red, and a mix of futuristic "techno" headlines with clean, readable body typography.

## Colors
The palette is dominated by "Signal Red," a high-chroma primary color used to draw immediate attention to key actions and brand elements. The color system relies on extreme contrast to ensure a rigorous, high-visibility user experience.

- **Primary:** #BC1515 (Signal Red) - Used for primary actions and brand emphasis.
- **Secondary:** #000000 (Black) - Used for headers, borders, and high-contrast text.
- **Tertiary:** #F9F9F9 (Ghost White) - Used for card surfaces and subtle layering.
- **Neutral:** #DEDEDE (Light Grey) - Used for structural borders and background depth.

## Typography
The typography strategy creates a tension between technical "display" styles and approachable functional text.

- **Headlines:** **Nova Square**. A geometric, techno-inspired typeface used for high-impact titles.
- **Body & Labels:** **Poppins**. A clean, geometric sans-serif that ensures readability across all functional UI elements.

## Layout & Spacing
The layout uses a **Fluid Grid** model with a hard-coded 8px baseline rhythm.
- **Gutters:** 16px fixed gutters to maintain a tight, industrial look.
- **Margins:** 24px on mobile, scaling to 48px on desktop.
- **Philosophy:** Spacing is used to create distinct "blocks" of information, emphasizing a structured and modular environment.

## Elevation & Depth
This system eschews traditional soft shadows in favor of **Bold Borders** and **Flat Tonal Layers**.
- **Borders:** Depth is communicated through 1px or 2px solid black borders.
- **Stacking:** Surface-container tiers (using Tertiary and Neutral colors) create depth without the need for ambient light simulation.

## Shapes
The shape language is **Soft-Geometric**. A slight corner radius is applied to maintain a balance between technical rigidity and modern usability.
- **Standard Radius:** 4px (Soft) for buttons and inputs.
- **Container Radius:** 8px for larger cards and modules.

## Components
- **Buttons:** Primary buttons are solid Signal Red (#BC1515). Secondary buttons are outlined with heavy black strokes.
- **Inputs:** Rectangular with 4px rounding and high-contrast focus states.
- **Cards:** Minimalist containers using the Tertiary color with solid 1px borders.
- **Status Elements:** Use the primary red for alerts/active states to maintain brand consistency and high visibility.