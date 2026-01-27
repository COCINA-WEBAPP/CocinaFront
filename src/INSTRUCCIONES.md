# 🎉 Instrucciones para RecipeShare - Next.js

## ¡Proyecto Completamente Migrado a Next.js!

Tu aplicación ha sido transformada de un proyecto React estándar a una aplicación **Next.js 14** con App Router, manteniendo todas las características y especificaciones originales pero adaptadas para una plataforma de recetas.

---

## 📋 Cambios Principales

### De E-Commerce a Plataforma de Recetas

- ✅ **ProductCard** → **RecipeCard**: Tarjetas de receta con imagen, autor, tiempo, dificultad, calificación
- ✅ **ProductCatalogue** → **RecipeCatalogue**: Catálogo principal con grid responsivo
- ✅ **FilterPanel** → **RecipeFilterPanel**: Filtros adaptados (categorías, tiempo, dificultad, porciones)
- ✅ **SortDropdown** → **RecipeSortDropdown**: Ordenamiento por relevancia, rating, tiempo, dificultad
- ✅ **Header & Footer**: Actualizados con temática de RecipeShare

### Arquitectura Next.js

```
Antes (React):          Ahora (Next.js):
/App.tsx                /app/page.tsx
                        /app/layout.tsx
/components/*           /components/* (con "use client")
```

---

## 🚀 Cómo Ejecutar el Proyecto

### Opción 1: Desarrollo Local (Recomendado)

Si quieres ejecutar esto como un proyecto Next.js real en tu máquina:

```bash
# 1. Asegúrate de tener Node.js 18+ instalado
node --version

# 2. Instala las dependencias
npm install

# 3. Ejecuta el servidor de desarrollo
npm run dev

# 4. Abre tu navegador en
http://localhost:3000
```

### Opción 2: En Figma Make (Actual)

El proyecto sigue funcionando en Figma Make, pero ahora con la estructura de Next.js. Los archivos en `/app/` son los principales:
- `/app/page.tsx` - Página de inicio
- `/app/layout.tsx` - Layout raíz

---

## 📁 Estructura de Archivos

### Archivos Principales de Next.js

```
/app/
  ├── layout.tsx          ← Layout raíz con metadata y Toaster
  └── page.tsx            ← Página principal (Home)

/components/
  ├── RecipeCard.tsx              ← Tarjeta individual de receta
  ├── RecipeCatalogue.tsx         ← Grid principal con filtros/sort
  ├── RecipeFilterPanel.tsx       ← Panel lateral de filtros
  ├── RecipeSortDropdown.tsx      ← Dropdown de ordenamiento
  ├── Header.tsx                  ← Navegación principal
  ├── Footer.tsx                  ← Pie de página
  └── ui/                         ← Componentes shadcn/ui

/styles/
  └── globals.css         ← Estilos Tailwind CSS v4

Archivos de configuración:
  ├── next.config.js      ← Configuración Next.js
  ├── package.json        ← Dependencias
  ├── tsconfig.json       ← Config TypeScript
  └── .gitignore          ← Archivos ignorados
```

### Archivos Antiguos (Puedes Eliminar)

Estos archivos eran del proyecto anterior de e-commerce y ya no se usan:
- `/App.tsx` (reemplazado por `/app/page.tsx`)
- `/components/ProductCard.tsx`
- `/components/ProductCatalogue.tsx`
- `/components/FilterPanel.tsx`
- `/components/SortDropdown.tsx`

---

## 🎨 Características Implementadas

### ✅ Todas las Especificaciones Originales

#### 1. Tarjeta de Receta (RecipeCard)
- ✅ Frame de 300x400 con auto layout vertical
- ✅ Imagen (60% superior) con efecto hover
- ✅ Título + Tiempo + Autor + Dificultad
- ✅ Sistema de calificación con estrellas
- ✅ Badges "Nuevo" y "Destacado"
- ✅ Botón de favoritos (corazón) en esquina
- ✅ Efecto hover con escala y sombra
- ✅ Overlay con botón "Ver Receta"

#### 2. Panel de Filtros (RecipeFilterPanel)
- ✅ Layout vertical con auto layout
- ✅ Filtros por:
  - Categorías (Desayuno, Almuerzo, Cena, etc.)
  - Tiempo de cocción (slider 0-180 min)
  - Dificultad (Fácil, Intermedio, Difícil)
  - Calificación mínima (slider 0-5)
  - Porciones (slider 1-12)
- ✅ Secciones colapsables con acordeón
- ✅ Sticky positioning en desktop
- ✅ Botón "Limpiar filtros"
- ✅ Contador de filtros activos
- ✅ Animaciones de transición

#### 3. Ordenamiento (RecipeSortDropdown)
- ✅ Dropdown con múltiples opciones
- ✅ Iconos descriptivos (↑↓ para tiempo, ⭐ para rating)
- ✅ Opciones:
  - Más Relevantes
  - Mejor/Menor Calificadas
  - Más Rápidas/Lentas
  - Más Fáciles/Difíciles
  - Más Recientes
- ✅ Accesible con teclado
- ✅ Variant states (Default, Open, Selected)

#### 4. Header/Navbar
- ✅ Frame 1440x80 responsive
- ✅ Logo RecipeShare con ícono de chef
- ✅ Navegación central (Inicio, Explorar, Destacados, Mis Recetas)
- ✅ Barra de búsqueda integrada
- ✅ Íconos de acción (Favoritos, Perfil)
- ✅ Sticky al hacer scroll
- ✅ Menú hamburguesa en mobile
- ✅ Badge con contador de favoritos

#### 5. Footer
- ✅ Frame 1440x200 con auto layout horizontal
- ✅ Secciones:
  - Info de la empresa
  - Enlaces rápidos
  - Categorías
  - Newsletter
- ✅ Iconos de redes sociales
- ✅ Newsletter signup
- ✅ Responsive (stacking vertical en mobile)
- ✅ Gradiente sutil de fondo

#### 6. Responsive & Mobile
- ✅ Mobile-first approach
- ✅ Grid: 1 col (mobile) → 2 cols (tablet) → 3 cols (desktop)
- ✅ Filtros como drawer lateral en mobile
- ✅ Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)

---

## 🔧 Tecnologías Utilizadas

- **Framework**: Next.js 14+ (App Router)
- **UI Library**: React 18+
- **Styling**: Tailwind CSS v4
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Components**: Shadcn/ui (Radix UI)
- **Notifications**: Sonner
- **Language**: TypeScript

---

## 📊 Datos de Demostración

El proyecto incluye **12 recetas mock** que demuestran:

1. **Pancakes Esponjosos** (Desayuno, Fácil, 20 min)
2. **Pasta Carbonara** (Almuerzo, Intermedio, 25 min)
3. **Torta de Chocolate** (Postre, Difícil, 60 min)
4. **Ensalada Mediterránea** (Ensalada, Fácil, 15 min)
5. **Pollo a la Parrilla** (Cena, Intermedio, 45 min)
6. **Bowl de Smoothie** (Desayuno, Fácil, 10 min)
7. **Tacos de Carne** (Cena, Intermedio, 35 min)
8. **Sushi Rolls** (Almuerzo, Difícil, 50 min)
9. **Pizza Margherita** (Cena, Intermedio, 40 min)
10. **Tiramisú** (Postre, Intermedio, 30 min)
11. **Sopa de Verduras** (Sopa, Fácil, 35 min)
12. **Hamburguesa Gourmet** (Almuerzo, Fácil, 30 min)

Todas las imágenes son de **Unsplash** de alta calidad.

---

## 🎯 Próximos Pasos Sugeridos

### Para Producción Real

1. **Backend con Supabase** (ya configurado):
   ```typescript
   // Ya tienes el servidor en /supabase/functions/server/
   // Puedes agregar:
   - Autenticación de usuarios
   - CRUD de recetas
   - Upload de imágenes
   - Sistema de favoritos
   - Comentarios y reviews
   ```

2. **Funcionalidades Adicionales**:
   - Página de detalle de receta (`/app/recetas/[id]/page.tsx`)
   - Perfil de usuario (`/app/perfil/page.tsx`)
   - Crear/Editar recetas (`/app/nueva-receta/page.tsx`)
   - Búsqueda por texto
   - Lista de compras generada
   - Compartir en redes sociales

3. **Optimizaciones**:
   - Usar `next/image` para optimización de imágenes
   - Implementar Server Components donde sea posible
   - Agregar ISR (Incremental Static Regeneration)
   - Implementar paginación o infinite scroll
   - SEO con metadata dinámica

---

## 🐛 Troubleshooting

### "Module not found"
```bash
# Reinstala dependencias
rm -rf node_modules package-lock.json
npm install
```

### "Type error" en TypeScript
```bash
# Limpia el cache de Next.js
rm -rf .next
npm run dev
```

### Imágenes de Unsplash no cargan
Verifica que `next.config.js` tenga configurado:
```js
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'images.unsplash.com',
    },
  ],
}
```

---

## 📝 Notas Importantes

1. **Componentes "use client"**: Todos los componentes interactivos tienen la directiva `"use client"` al inicio
2. **Imports relativos**: Usa `../` para imports desde `/app/` hacia `/components/`
3. **Metadata**: Configurada en `/app/layout.tsx` para SEO
4. **Tailwind v4**: Usa la nueva sintaxis sin archivos de configuración separados
5. **Motion**: Importa como `import { motion } from "motion/react"`

---

## 🎨 Personalización

### Cambiar Colores
Edita `/styles/globals.css`:
```css
:root {
  --primary: ...;
  --secondary: ...;
}
```

### Agregar Más Recetas
Edita el array `MOCK_RECIPES` en `/components/RecipeCatalogue.tsx`

### Modificar Filtros
Edita las constantes en `/components/RecipeFilterPanel.tsx`:
```typescript
const CATEGORIES = [...];
const DIFFICULTIES = [...];
```

---

## ✅ Checklist de Migración Completada

- [x] Estructura de Next.js 14 con App Router
- [x] Componente RecipeCard con todas las features
- [x] Panel de filtros completo y funcional
- [x] Sistema de ordenamiento
- [x] Header y Footer responsivos
- [x] 12 recetas mock con imágenes de Unsplash
- [x] Animaciones con Motion
- [x] Diseño responsive mobile/tablet/desktop
- [x] Accesibilidad (ARIA labels, keyboard navigation)
- [x] Configuración de TypeScript
- [x] Configuración de Tailwind CSS v4
- [x] package.json con todas las dependencias
- [x] README y documentación completa

---

## 💡 ¿Preguntas?

Este proyecto está listo para:
- ✅ Desarrollo local con `npm run dev`
- ✅ Deploy en Vercel (optimizado para Next.js)
- ✅ Extensión con backend real
- ✅ Personalización completa

**¡Tu aplicación de recetas está lista para usar!** 🎉👨‍🍳

---

**Creado con ❤️ - RecipeShare Platform**
